import React from 'react';
import Field from "../Inputs/Field";
import { useLocation } from "react-router-dom";
import classes from "./Search.module.css";

function Search ( { term, keypress, changeHandler } ) 
{
    const { pathname } = useLocation();

    if ( pathname.lastIndexOf( "/" ) > 1 )
    {
        term = term || pathname.substring( 1 + pathname.lastIndexOf( "/" ) );
    }

    return (
        <Field
            keypress={ keypress }
            changeHandler={ changeHandler }
            label="Search gems : "
            value={ term }
            placeholder="e.g diamond..."
            control="search"
            classNamesGroup={ classes.SearchBar }
            classNamesInput={ classes.Search }
            classNamesLabel={ classes.Label }
        />
    );
}

export default Search;
