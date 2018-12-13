'use strict';

var fs = require( "fs" );
var path = require( "path" );


const Translate = {

    translate: function ( fromFolder, toFile ) {
        console.log( "fromFolder: " + fromFolder );
        console.log( "toFile: " + toFile );

        this.readDirSync( fromFolder );

        //usage:
        const text = this.readTextFile( "/Users/xiechao/codes/xctranslate/data/locales/ar.json" );

        const data = JSON.parse( text );
        console.log( data.about_us );

        this.writeTextFile( "/Users/xiechao/codes/xctranslate/data/locales/ar.json", JSON.stringify( data, null, 2 ) + "\n" )
    },


    readDirSync: function ( path ) {
        const pa = fs.readdirSync( path );
        pa.forEach( function ( ele, index ) {
            const info = fs.statSync( path + "/" + ele );
            if ( info.isDirectory() ) {
                console.log( "dir: " + ele );
                this.readDirSync( path + "/" + ele );
            } else {
                console.log( "file: " + ele )
            }
        } )
    },


    readTextFile: function ( file ) {
        var data = fs.readFileSync( file, "utf-8" );

        return data
    },

    writeTextFile: function ( file, content ) {
        fs.writeFileSync( file, content )
    }


};

exports.Translate = Translate;