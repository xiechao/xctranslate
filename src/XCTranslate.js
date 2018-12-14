'use strict';

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

        if ( fileCompareArray && fileCompareArray.length > 0 ) {
            this.mergerFiles( fromFolder, fileCompareArray, 0, ( error ) => {
                if ( error ) {
                    throw error;
                } else {
                    console.log( "" );
                    console.log( "mergerFiles complete" );
                    console.log( "" );

                    this.createKeys( fromFolder, files[ 0 ], toFile );

                    console.log( "" );
                    console.log( "create keys complete" );
                    console.log( "" );
                }
            } );
        }
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

            const options = {
                from: this.calcTranslateLangFromFileName( file1 ),
                to: this.calcTranslateLangFromFileName( file2 )
            };

            const translatedMap = {};
            this.doTranslate( needTranslated, options, 0, translatedMap, ( err, result ) => {
                if ( err ) {
                    callback && callback( err, null );
                } else {
                    const dataDiffAfterTranslate = this.replaceTranslatedStr( dataDiff, true, result );


                    FileUtil.writeTextFile( fromFolder + "/" + file2, JSON.stringify( JsonUtil.mergerSet( data2, dataDiffAfterTranslate ), null, 2 ) + "\n" );

                    this.mergerFiles( fromFolder, fileCompareArray, index + 1, callback );
                }
            } )
        }
    },

    doTranslate: function ( needTranslated, options, index, translatedMap, callback ) {
        if ( index >= needTranslated.length ) {
            callback && callback( null, translatedMap );
            return;
        }

        const translateStep = 10;

        const stepData = [];
        for ( let index1 = index; index1 < needTranslated.length && index1 - index < translateStep; index1++ ) {
            stepData.push( needTranslated[ index1 ] )
        }

        console.log( "Start Translate: " + JSON.stringify( stepData ) );
        this.googleTranslate( stepData, options, ( err, result ) => {
            console.log( "Translate Success: " + JSON.stringify( stepData ) );

            if ( err ) {
                callback && callback( err, null )
            } else {
                translatedMap = JsonUtil.mergerSet( translatedMap, result );

                this.doTranslate( needTranslated, options, index + translateStep, translatedMap, callback );
            }
        } );
    },

    googleTranslate: function ( needTranslated, options, callback ) {
        const projectId = 'gtdollar-production';

        const translate = new Translate( {
            projectId: projectId,
        } );

        translate
            .translate( needTranslated, options )
            .then( results => {
                const translatedMap = {};
                for ( let index = 0; index < results[ 0 ].length; index++ ) {
                    translatedMap[ needTranslated[ index ] ] = results[ 0 ][ index ];
                }

                callback && callback( null, translatedMap );
            } )
            .catch( err => {
                callback && callback( err, null );
            } );

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

    createKeys: function ( fromFolder, fromFile, toFile ) {
        const text = FileUtil.readTextFile( fromFolder + "/" + fromFile );
        const data = JSON.parse( text );

        const keysObject = this.createKeysByObject( data, null, null );

        let fileContent = "const Keys = {" + "\n";

        const keys = Object.keys( keysObject );
        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];

            fileContent += "    \"" + key + "\"" + ": " + "\"" + keysObject[ key ] + "\"" + "," + "\n";
        }

        fileContent += "};\n" +
            "export default Keys;" + "\n";

        FileUtil.writeTextFile( toFile, fileContent );

    },

    createKeysByObject: function ( data, keyParent, valueParent ) {
        if ( typeof ( data ) !== 'object' ) {
            throw new Error( "data is not object" );
        }

        if ( data instanceof Array ) {
            throw new Error( "data can not be array" );
        }

        let keysObject = {};

        const keys = Object.keys( data );

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];

            const keyParentNew = ( keyParent && keyParent.length > 0 ? ( keyParent + "_" ) : '' ) + key;
            const valueParentNew = ( valueParent && valueParent.length > 0 ? ( valueParent + "." ) : '' ) + key;

            keysObject[ keyParentNew ] = valueParentNew;

            if ( typeof ( data[ key ] ) === 'object' ) {
                const childKeysObject = this.createKeysByObject( data[ key ], keyParentNew, valueParentNew );

                keysObject = JsonUtil.mergerSet( keysObject, childKeysObject )
            }
        }

        return keysObject;
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
};

exports.XCTranslate = XCTranslate;