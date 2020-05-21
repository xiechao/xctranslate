'use strict';

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

        return this.sortSet( objectDiff );
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

        return this.sortSet( objectDiff );
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