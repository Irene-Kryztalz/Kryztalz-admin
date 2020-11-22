import React from 'react';
import { useHistory } from "react-router-dom";
import Button from "../../../components/Button";
import classes from "./Page404.module.css";

function Page404 ()
{
    const history = useHistory();
    return (
        <div className={ classes.Flex }>

            <i className="fas fa-frown"></i>
            <h2>404</h2>

            <p> Uh Oh! Looks like this page does not exist.</p>

            <Button onClick={ () => history.push( "/all-gems" ) }>Explore gems</Button>


        </div>
    );
}

export default Page404;
