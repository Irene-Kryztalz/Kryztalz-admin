import React from 'react';
import classes from "./Success.module.css";
import Button from "../Button";
import { joinClasses } from "../../utils/joinClasses";

function PageSuccess ( { message, styles, handler, isEdit } ) 
{
    return (
        <div className={ joinClasses( classes.PageSuccess, styles ) } >
            <h1>{ message }</h1>
            <br />
            {
                !isEdit && <Button onClick={ handler }> Add gem </Button>
            }

        </div>
    );
}


function ModalSuccess ( { message, styles } ) 
{
    return (
        <div>

        </div>
    );
}

export 
{
    PageSuccess,
    ModalSuccess,
};
