'use strict';

var fs = require( "fs" );
var path = require( "path" );
var shell = require( 'shelljs' );

const JsonUtil = {
    differenceSet: function ( origin, compareTo ) {

        if ( typeof ( origin ) !== 'object' || typeof ( compareTo ) !== 'object' ) {
            throw new Error( "origin or compareTo is not object" );
        }

        if ( ( origin instanceof Array ) || ( compareTo instanceof Array ) ) {
            throw new Error( "origin or compareTo can not be array" );
        }

        const keys = Object.keys( origin );

        const objectDiff = {};

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];
            if ( compareTo[ key ] == null || compareTo[ key ] === undefined ) {
                objectDiff[ key ] = origin[ key ]
            } else {
                if ( typeof ( origin[ key ] ) === 'object' && typeof ( compareTo[ key ] ) === 'object' ) {
                    const temp = this.differenceSet( origin[ key ], compareTo[ key ] );
                    if ( temp && Object.keys( temp ).length > 0 ) {
                        objectDiff[ key ] = temp
                    }
                }
            }
        }

        return this.sortSet(objectDiff);
    },

    mergerSet: function ( origin, mergerTo ) {
        if ( typeof ( origin ) !== 'object' || typeof ( mergerTo ) !== 'object' ) {
            throw new Error( "origin or mergerTo is not object" );
        }

        if ( ( origin instanceof Array ) || ( mergerTo instanceof Array ) ) {
            throw new Error( "origin or mergerTo can not be array" );
        }

        const keys = Object.keys( mergerTo );

        const objectDiff = JSON.parse( JSON.stringify( origin ) );

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];
            if ( !origin[ key ] ) {
                objectDiff[ key ] = mergerTo[ key ]
            } else {
                if ( typeof ( origin[ key ] ) === 'object' && typeof ( mergerTo[ key ] ) === 'object' ) {
                    const temp = this.mergerSet( origin[ key ], mergerTo[ key ] );
                    if ( temp ) {
                        objectDiff[ key ] = temp
                    }
                } else {
                    objectDiff[ key ] = origin[ key ]
                }
            }
        }

        return this.sortSet(objectDiff);
    },

    sortSet: function ( obj ) {

        if ( typeof ( obj ) !== 'object' ) {
            throw new Error( "obj is not object" );
        }

        if ( obj instanceof Array ) {
            throw new Error( "obj can not be array" );
        }

        const keys = Object.keys( obj );

        keys.sort();

        const objectNew = {};

        for ( let index = 0; index < keys.length; index++ ) {
            const key = keys[ index ];
            if ( typeof ( obj[ key ] ) === 'object' ) {
                objectNew[ key ] = this.sortSet( obj[ key ] );
            } else {
                objectNew[ key ] = obj[ key ];
            }
        }

        return objectNew;
    }
};

exports.JsonUtil = JsonUtil;

const a = {
    aaa: 'aaa',
    bbb: { ee: 11, ff: 22 },
    ccc: 1.2,
    dddd: true,
    gg: { a: 11 },
    "country": {
        "AD": {
            "sort": "AN DAO ER",
            "value": "أندورا"
        },
    }
};
const b = {
    gg: { b: 22, a: 11 },
    aaa: 'aaa',
    bbb: 2,
    eee: 1.2,
    fff: true,
    "country": {
        "AD": {
            "sort": "",
            "value": "Andorra"
        },
    }
};
//
// console.log( typeof ( a ) );
// console.log( typeof ( b ) );
//
// console.log( a instanceof Array );
// console.log( b instanceof Array );
// //
// console.log( "1 = : " + JSON.stringify( JsonUtil.differenceSet( a, b ), null, 4 ) );
// console.log( "2 = : " + JSON.stringify( JsonUtil.differenceSet( b, a ), null, 4 ) );
//
// console.log( "3 = : " + JSON.stringify( JsonUtil.mergerSet( a, b ), null, 4 ) );
// console.log( "4 = : " + JSON.stringify( JsonUtil.mergerSet( b, a ), null, 4 ) );
// // console.log( "2 = : " + JsonUtil.differenceSet( b ,a) );
//
// console.log( "5 = : " + JSON.stringify( JsonUtil.sortSet( a ), null, 4 ) );
// console.log( "6 = : " + JSON.stringify( JsonUtil.sortSet( b ), null, 4 ) );