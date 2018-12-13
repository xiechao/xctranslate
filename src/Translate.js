'use strict';

var fs = require( "fs" );
var path = require( "path" );


const Translate = {

    translate: function ( fromFolder, toFile ) {
        console.log( "fromFolder: " + fromFolder );
        console.log( "toFile: " + toFile );

        this.readDirSync( fromFolder );

        //usage:
        this.readTextFile( "/Users/Documents/workspace/test.json", function ( text ) {
            const data = JSON.parse( text );
            console.log( data );
        } )
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


    readTextFile: function ( file, callback ) {
        const rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType( "application/json" );
        rawFile.open( "GET", file, true );
        rawFile.onreadystatechange = function () {
            if ( rawFile.readyState === 4 && rawFile.status == "200" ) {
                callback( rawFile.responseText );
            }
        }
        rawFile.send( null );
    }
};

exports.Translate = Translate;