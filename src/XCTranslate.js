'use strict';

var fs = require( "fs" );
var path = require( "path" );
var shell = require( 'shelljs' );

const { FileUtil } = require( './utils/FileUtil' );
const { JsonUtil } = require( './utils/JsonUtil' );

const { Translate } = require( '@google-cloud/translate' );

const XCTranslate = {

    translate: function ( fromFolder, toFile ) {
        console.log( "fromFolder: " + fromFolder );
        console.log( "toFile: " + toFile );

        const files = FileUtil.readDirSync( fromFolder );

        const fileCompareArray = [];

        for ( let index = 0; index < files.length; index++ ) {
            for ( let index1 = 0; index1 < files.length; index1++ ) {
                if ( index !== index1 ) {
                    const file1 = files[ index ];
                    const file2 = files[ index1 ];


                    fileCompareArray.push( {
                        file1: file1,
                        file2: file2
                    } )
                }
            }
        }


        this.mergerFiles( fromFolder, fileCompareArray, 0, ( error, result ) => {
            if ( error ) {
                throw error;
            } else {
                console.log( "mergerFiles complete" )
            }
        } );
        //usage:


        // console.log( data.about_us );

        // FileUtil.writeTextFile( "/Users/xiechao/codes/xctranslate/data/locales/ar.json", JSON.stringify( data, null, 2 ) + "\n" )
        //
        //
        // const { stdout, stderr, code } = shell.exec( 'ls /Users/xiechao/codes/xctranslate/data/locales', { silent: true } )

        // console.log( "www" + stdout );

        // jq -S -s '.[0] * .[1]' /Users/xiechao/codes/xctranslate/data/locales/en.json /Users/xiechao/codes/xctranslate/data/locales/ar.json
        // jq -S -s '.[0] - .[1]' /Users/xiechao/codes/xctranslate/data/locales/en.json /Users/xiechao/codes/xctranslate/data/locales/ar.json
        // jq -n /Users/xiechao/codes/xctranslate/data/locales/en.json /Users/xiechao/codes/xctranslate/data/locales/ar.json
        //
        //
        // jq --argfile a /Users/xiechao/codes/xctranslate/data/locales/en.json --argfile b /Users/xiechao/codes/xctranslate/data/locales/ar.json -n 'def post_recurse(f): def r: (f | select(. != null) | r), .; r; def post_recurse: post_recurse(.[]?); ($a | (post_recurse | arrays) |= sort) as $a | ($b | (post_recurse | arrays) |= sort) as $b | $a == $b'

        // console.log( "1 = : " + JSON.stringify( JsonUtil.differenceSet( data1, data2 ), null, 4 ) );
        // console.log( "2 = : " + JSON.stringify( JsonUtil.differenceSet( data2, data1 ), null, 4 ) );


        // Imports the Google Cloud client library


    },

    mergerFiles: function ( fromFolder, fileCompareArray, index, callback ) {
        if ( index >= fileCompareArray.length ) {
            callback && callback( null, true );
            return;
        }

        const { file1, file2 } = fileCompareArray[ index ];

        const text1 = FileUtil.readTextFile( fromFolder + "/" + file1 );
        const data1 = JSON.parse( text1 );

        const text2 = FileUtil.readTextFile( fromFolder + "/" + file2 );
        const data2 = JSON.parse( text2 );

        const dataDiff = JsonUtil.differenceSet( data1, data2 );

        const needTranslated = this.calcNeedTranslateString( dataDiff, true );

        if ( needTranslated.length <= 0 ) {
            FileUtil.writeTextFile( fromFolder + "/" + file2, JSON.stringify( JsonUtil.sortSet( data2 ), null, 2 ) + "\n" );

            this.mergerFiles( fromFolder, fileCompareArray, index + 1, callback )
        } else {
            // Your Google Cloud Platform project ID
            const projectId = 'gtdollar-production';

            // Instantiates a client
            const translate = new Translate( {
                projectId: projectId,
            } );

            // The text to translate
            const text = 'Hello, world!';
            // The target language
            const target = 'ru';

            const options = {
                from: this.calcTranslateLangFromFileName( file1 ),
                to: this.calcTranslateLangFromFileName( file2 )
            };

            // Translates some text into Russian
            translate
                .translate( needTranslated, options )
                .then( results => {
                    const translation = results[ 0 ];

                    const translatedMap = {};
                    for ( let index = 0; index < results[ 0 ].length; index++ ) {
                        translatedMap[ needTranslated[ index ] ] = results[ 0 ][ index ];
                    }

                    const dataDiffAfterTranslate = this.replaceTranslatedStr( dataDiff, true, translatedMap );


                    FileUtil.writeTextFile( fromFolder + "/" + file2, JSON.stringify( JsonUtil.mergerSet( data2, dataDiffAfterTranslate ), null, 2 ) + "\n" );

                    this.mergerFiles( fromFolder, fileCompareArray, index + 1, callback );
                } )
                .catch( err => {
                    callback && callback( err, null );
                } );
        }
    },

    replaceTranslatedStr: function ( obj, isOutermostLayer, translatedMap ) {
        let data = JSON.parse( JSON.stringify( obj ) );

        const keys = Object.keys( obj );

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];

            if ( typeof ( obj[ key ] ) === 'object' ) {
                data[ key ] = this.replaceTranslatedStr( obj[ key ], false, translatedMap );
            } else {
                if ( !isOutermostLayer && key === 'sort' ) {

                } else {
                    data[ key ] = translatedMap[ data[ key ] ];
                }
            }
        }

        return data;
    },

    calcNeedTranslateString: function ( obj, isOutermostLayer ) {
        let data = [];

        const keys = Object.keys( obj );

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];

            if ( typeof ( obj[ key ] ) === 'object' ) {
                const dataTemp = this.calcNeedTranslateString( obj[ key ], false );

                data = data.concat( dataTemp );
            } else {
                if ( !isOutermostLayer && key === 'sort' ) {

                } else {
                    data.push( obj[ key ] );
                }
            }
        }

        return data;
    },


    calcTranslateLangFromFileName: function ( file ) {
        if ( file === 'ar.json' ) {
            return "ar"
        }
        else if ( file === 'en.json' ) {
            return "en"
        }
        else if ( file === 'es.json' ) {
            return "es"
        }
        else if ( file === 'fr.json' ) {
            return "fr"
        }
        else if ( file === 'hi.json' ) {
            return "hi"
        }
        else if ( file === 'in.json' ) {
            return "id"
        }
        else if ( file === 'ja.json' ) {
            return "ja"
        }
        else if ( file === 'ko.json' ) {
            return "ko"
        }
        else if ( file === 'ms.json' ) {
            return "ms"
        }
        else if ( file === 'ne.json' ) {
            return "ne"
        }
        else if ( file === 'ru.json' ) {
            return "ru"
        }
        else if ( file === 'th.json' ) {
            return "th"
        }
        else if ( file === 'vi.json' ) {
            return "vi"
        }
        else if ( file === 'zh-tw.json' ) {
            return "zh-TW"
        }
        else if ( file === 'zh.json' ) {
            return "zh-CN"
        }
    }
}

exports.XCTranslate = XCTranslate;