import React, { Component, createContext } from 'react';

const AppContext = createContext( null );

AppContext.displayName = 'AppContext';

class AppProvider extends Component
{
    state =
        {
            gems: [],
            loading: false,
            currencies: {},
            activeCurr: "",
            isAuth: false,
            baseUrl: "",
            permissions: []

        };

    componentDidMount ()
    {
        let base;

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' )
        {
            base = "http://localhost:7272";

        } else
        {
            base = process.env.REACT_APP_SERVER;
        }
        if ( !this.state.currencies[ "ngn" ] )
        {
            fetch( "./currency-country.json" )
                .then( resp => resp.json() )
                .then( curr =>
                {
                    this.setState(
                        {
                            activeCurr: "ngn",
                            baseUrl: base,
                            currencies: this.formatData( curr )
                        }
                    );
                } );
        }
        if ( this.checkExpiredToken() )
        {
            this.setState( { isAuth: true } );
            this.getPerms( base );
        }

    }

    getPerms = async ( baseUrl ) =>
    {
        const token = localStorage.getItem( "token" );
        fetch( `${ baseUrl }/admin/permissions`,
            {
                headers:
                {
                    Authorization: `Bearer ${ token }`
                }
            } )
            .then( res => res.json() )
            .then( perms => 
            {
                const permissions = [];

                for ( const perm in perms ) 
                {
                    const p =
                    {
                        name: perm.replace( /_/ig, " " ),
                        slug: perm,
                        id: perms[ perm ]
                    };

                    permissions.push( p );
                }

                this.setState( { permissions } );
            } )
            .catch( e => 
            {
                this.setState( { permissions: { error: e.error } } );
            } );
    };

    changeCurr = ( curr ) =>
    {
        this.setState( { activeCurr: curr } );
    };

    sendData = async ( { endpoint, formData, method = "GET", headers } ) =>
    {
        this.setState( { loading: true } );
        headers =
        {
            ...headers,
            Authorization: `Bearer ${ localStorage.getItem( "token" ) }`
        };

        let response,
            url = this.state.baseUrl;

        try 
        {

            if ( method === "GET" || method === "DELETE" )
            {
                response = await Promise.race( [ fetch( `${ url }/${ endpoint }`,
                    {
                        headers
                    } ), new Promise( ( _, reject ) => setTimeout( () => reject( new Error( "Timeout" ) )
                        , 10000 ) ) ] );
            }
            else
            {
                response = await Promise.race( [ fetch( `${ url }/${ endpoint }`,
                    {
                        method,
                        headers,
                        body: formData
                    } ), new Promise( ( _, reject ) => setTimeout( () => reject( new Error( "Timeout" ) )
                        , 10000 ) ) ] );
            }

            if ( response.ok )
            {
                this.setState( { loading: false } );
                return { data: await response.json() };
            }
            else
            {

                this.setState( { loading: false } );
                return {
                    code: response.status,
                    error: await response.json()
                };
            }

        }
        catch ( err )
        {
            //handle error like server is offline
            //no network
            //or request timeout
            return {
                error: err.message
            };

        }


    };

    formatData = ( currencies ) =>
    {
        const formatted = {};
        for ( let cur in currencies ) 
        {
            formatted[ cur.toLowerCase() ] =
            {
                currencySymbol: currencies[ cur ].currencySymbol.toLowerCase(),
                currencyName: currencies[ cur ].currencyName.toLowerCase(),
            };
        }

        return formatted;
    };

    checkExpiredToken = () =>
    {
        const now = new Date().getTime();
        const token = localStorage.getItem( "token" );
        const expires = +localStorage.getItem( "token-exp" );
        const diff = ( expires && token ) ? expires - now : 0;
        return diff > 0 ? true : false;
    };

    login = ( token, expires ) =>
    {
        localStorage.setItem( 'token', token );
        localStorage.setItem( 'token-exp', expires );
        this.setState( { isAuth: true } );

    };

    logout = () =>
    {
        localStorage.removeItem( 'token' );
        localStorage.removeItem( 'token-exp' );
        this.setState( { isAuth: false } );
    };

    render ()
    {
        return (
            <AppContext.Provider value={
                {
                    ...this.state,
                    changeCurr: this.changeCurr,
                    login: this.login,
                    sendData: this.sendData,
                    logout: this.logout
                } }>
                { this.props.children }
            </AppContext.Provider>
        );
    }

}

export default AppContext;

export { AppProvider };
