import React, { Component, createContext } from 'react';

const AppContext = createContext( null );

AppContext.displayName = 'AppContext';

class AppProvider extends Component
{
    state =
        {
            gems: [],
            loading: false,
            isAuth: false,
            baseUrl: "",
            user: {},
            count: 0

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

        this.setState( { baseUrl: base } );


        if ( this.checkExpiredToken() )
        {
            const user = JSON.parse( localStorage.getItem( 'kryztalz-user' ) );

            this.setState( { isAuth: true, user } );
        }

    }


    makeRequest = async ( { endpoint, formData, method = "GET", headers }, loader = true ) =>
    {
        method = method.toUpperCase();
        const timeOut = 20000;

        if ( loader )
        {
            this.setState( { loading: true } );
        }

        headers =
        {
            ...headers,
            Authorization: `Bearer ${ localStorage.getItem( "kryztalz-token" ) }`
        };

        let response,
            url = this.state.baseUrl;

        try 
        {
            if ( method === "GET" )
            {
                response = await Promise.race( [ fetch( `${ url }/${ endpoint }`,
                    {
                        headers
                    } ), new Promise( ( _, reject ) => setTimeout( () => reject( new Error( "Timeout" ) )
                        , timeOut ) ) ] );

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
                const e = await response.json();
                return {
                    code: response.status,
                    error: e.error
                };
            }

        }
        catch ( err )
        {
            this.setState( { loading: false } );
            //handle error like server is offline
            //no network
            //or request timeout
            return {
                error: `${ err.message }. Please check internet connection or contact the site administrator(s) directly.`
            };

        }

    };

    checkExpiredToken = () =>
    {
        const now = new Date().getTime();
        const token = localStorage.getItem( "kryztalz-token" );
        const expires = +localStorage.getItem( "kryztalz-token-exp" );
        const diff = ( expires && token ) ? expires - now : 0;
        return diff > 0 ? true : false;
    };

    login = ( user ) =>
    {
        const { token, expires, name, email } = user;
        localStorage.setItem( 'kryztalz-token', token );
        localStorage.setItem( 'kryztalz-token-exp', expires );
        localStorage.setItem( 'kryztalz-user', JSON.stringify( { name, email } ) );
        this.setState( { isAuth: true, user: { name, email } } );

    };

    logout = () =>
    {
        localStorage.removeItem( 'kryztalz-token' );
        localStorage.removeItem( 'kryztalz-token-exp' ); localStorage.removeItem( 'kryztalz-user' );
        this.setState( { isAuth: false } );
    };

    setGems = ( items, count, isDelete ) =>
    {
        let gems;
        if ( !Array.isArray( items ) )
        {
            gems = [ ...this.state.gems ];
            const editedGemIndex = gems.findIndex( g => g._id === items._id );

            if ( editedGemIndex > -1 )
            {
                gems[ editedGemIndex ] = items;
            }

        }
        else if ( isDelete )
        {
            gems = [ ...items ];
        }
        else
        {
            gems = [ ...this.state.gems, ...items ];
        }

        this.setState( { gems, count } );
    };

    render ()
    {
        return (
            <AppContext.Provider value={
                {
                    ...this.state,
                    login: this.login,
                    makeRequest: this.makeRequest,
                    logout: this.logout,
                    setGems: this.setGems
                } }>
                { this.props.children }
            </AppContext.Provider>
        );
    }

}

export default AppContext;

export { AppProvider };
