import React, { useState } from 'react';
import { useHistory, useRouteMatch, Route, Switch } from "react-router-dom";
import GemList from "./GemList/GemList";
import GemSearch from "./GemSearch/GemSearch";

import Search from "../../../components/Search/Search";

function GemDisplay () 
{
    let { path, url } = useRouteMatch();
    const history = useHistory();
    const [ searchTerm, setSearchTerm ] = useState( "" );

    const changeHandler = ( e ) =>
    {
        const { value } = e.target;
        setSearchTerm( value );

        if ( !value.trim() )
        {
            history.push( `${ url }` );
        }
    };

    const keyPressHandler = ( e ) =>
    {
        const code = ( e.keyCode ? e.keyCode : e.which );
        if ( code === 13 && searchTerm.trim() )
        {
            let term = searchTerm.trim().toLowerCase();
            history.push( `${ url }/${ term }` );
            return;
        }

    };

    return (
        <>

            <Search
                term={ searchTerm }
                changeHandler={ changeHandler }
                keypress={ keyPressHandler } />

            <Switch>
                <Route exact path={ path }>
                    <GemList />
                </Route>
                <Route path={ `${ path }/:term` }>
                    <GemSearch />
                </Route>
            </Switch>


        </>
    );
}

export default GemDisplay;
