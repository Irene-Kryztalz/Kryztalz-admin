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
            baseUrl: "",
            loginUrl: ""

        };

    componentDidMount ()
    {
        let base, loginUrl;

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' )
        {
            base = "http://localhost:8080/admin";
            loginUrl = "http://localhost:8080/user";

        } else
        {
            base = process.env.REACT_APP_SERVER;
            loginUrl = process.env.REACT_APP_AUTH_SERVER;
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
                            loginUrl,
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

    sendData = async ( { endpoint, formData, method = "GET", headers, forAuth = false } ) =>
    {
        this.setState( { loading: true } );

        let response,
            url = this.state.baseUrl;

        if ( forAuth ) 
        {
            url = this.state.loginUrl;
        }

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

        const token = localStorage.getItem( "kryztalz-admin-token" );
        const expires = +localStorage.getItem( "kryztalz-admin-exp" );

        const diff = ( expires && token ) ? expires - now : 0;

        return diff > 0 ? true : false;
    };

    login = ( token, expires ) =>
    {
        localStorage.setItem( 'kryztalz-admin-token', token );
        localStorage.setItem( 'kryztalz-admin-exp', expires );
        this.setState( { isAuth: true } );

    };

    logout = () =>
    {
        localStorage.removeItem( 'kryztalz-admin-token' );
        localStorage.removeItem( 'kryztalz-admin-exp' );
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
