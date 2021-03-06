'use strict';


const program = require( 'commander' );
const colors = require( 'colors' );

const { JSTranslate } = require( './src/JSTranslate' );

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
    console.log( '  $ translate-macos -f ~/codes/gtb-wallet/data/locales -t ~/codes/gtb-wallet/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/gtrobotrn/data/locales -t ~/codes/gtrobotrn/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/gtdollar-hh/data/locales -t ~/codes/gtdollar-hh/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/exchange-webapp/src/Lang/locales -t ~/codes/exchange-webapp/src/Lang/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/gtins-app/data/locales -t ~/codes/gtins-app/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/gls-app/data/locales -t ~/codes/gls-app/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/girl-vip-app/data/locales -t ~/codes/girl-vip-app/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/gt-exchange-app/data/locales -t ~/codes/gt-exchange-app/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/aim-app/data/locales -t ~/codes/aim-app/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/ai-robot/data/locales -t ~/codes/ai-robot/src/configs/Keys.js' );
    console.log( '  $ translate-macos -f ~/codes/market_app/data/locales -t ~/codes/market_app/src/configs/Keys.js' );
    console.log( '' );
    console.log( '' );
} );

let argvAmount = process.argv.slice( 2 ).length;

if ( program.fromFolder && program.toFile && argvAmount === 4 ) {
    JSTranslate.translate( program.fromFolder, program.toFile );
} else {
    program.outputHelp( make_red );
}


function make_red( txt ) {
    return colors.red( txt ); //display the help text in red on the console
}



