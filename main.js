'use strict';


const program = require( 'commander' );
const colors = require( 'colors' );

const {Translate} = require('./src/Translate');

program
    .version( '0.1.0' )
    .option( '-f, --fromFolder [value]', 'from folder' )
    .option( '-t, --toFile [value]', 'to file' )
    .parse( process.argv );

program.on( '--help', function () {
    console.log( '' );
    console.log( 'Examples:' );
    console.log( '  $ translate-macos --help' );
    console.log( '  $ translate-macos -h' );
    console.log( '' );
    console.log( '  $ translate-macos -f /Users/xiechao/codes/gtb-wallet/data/locales -t /Users/xiechao/codes/gtb-wallet/src/configs/Keys.js' );
    console.log( '' );
    console.log( '' );
} );

let argvAmount = process.argv.slice( 2 ).length;

if ( program.fromFolder && program.toFile && argvAmount === 4 ) {
    Translate.translate(program.fromFolder, program.toFile);
} else {
    let fromFolder = "/Users/xiechao/codes/gtb-wallet/data/locales";
    let toFile = "/Users/xiechao/codes/gtb-wallet/src/configs/Keys.js";

    Translate.translate(fromFolder, toFile);
    // program.outputHelp( make_red );
}


function make_red( txt ) {
    return colors.red( txt ); //display the help text in red on the console
}



