'use strict';

var fs = require( "fs" );
var path = require( "path" );
var shell = require( 'shelljs' );

const FileUtil = {

    readDirSync: function ( path ) {
        const files = [];

        const pa = fs.readdirSync( path );
        pa.forEach( function ( ele, index ) {
            const info = fs.statSync( path + "/" + ele );
            if ( info.isDirectory() ) {
                // console.log( "dir: " + ele );
                // this.readDirSync( path + "/" + ele );
            } else {
                console.log( "file: " + ele )

                files.push( ele );
            }
        } );

        return files;
    },


    readTextFile: function ( file ) {
        var data = fs.readFileSync( file, "utf-8" );

        return data
    },

    writeTextFile: function ( file, content ) {
        fs.writeFileSync( file, content )
    }


};

exports.FileUtil = FileUtil;