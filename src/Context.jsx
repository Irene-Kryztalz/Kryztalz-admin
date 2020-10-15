import React, { Component, createContext } from 'react';

const AppContext = createContext( null );

AppContext.displayName = 'AppContext';

class AppProvider extends Component
{
    state =
        {
            gems: [],
            users: [],
            loading: false,
            currencies: {},
            activeCurr: "",
            isAuth: false,
            baseUrl: ""

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
        }

    }

    changeCurr = ( curr ) =>
    {
        this.setState( { activeCurr: curr } );
    };

    sendData = async ( { endpoint, formData, method = "GET", headers, } ) =>
    {
        this.setState( { loading: true } );
        headers =
        {
            ...headers,
            Authorization: `Bearer ${ localStorage.getItem( "token" ) }`
        };

        let response,
            url = this.state.baseUrl;

        if ( method === "GET" )
        {
            response = await fetch( `${ url }/${ endpoint }` );
        }
        else
        {
            response = await fetch( `${ url }/${ endpoint }`,
                {
                    method,
                    headers,
                    body: formData
                } );
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
