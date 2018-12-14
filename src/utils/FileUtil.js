'use strict';

const fs = require( "fs" );

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
                // console.log( "file: " + ele );
                files.push( ele );
            }
        } );

        return files;
    },


    readTextFile: function ( file ) {
        return fs.readFileSync( file, "utf-8" )
    },

    writeTextFile: function ( file, content ) {
        fs.writeFileSync( file, content )
    }
};

exports.FileUtil = FileUtil;