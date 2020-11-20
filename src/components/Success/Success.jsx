import React from 'react';
import classes from "./Success.module.css";
import Button from "../Button";
import { joinClasses } from "../../utils/joinClasses";

function PageSuccess ( { message, styles, handler, isEdit } ) 
{
    return (
        <section className={ classes.Success } >
            <div className={ joinClasses( classes.PageSuccess, styles ) } >

                <i className="far fa-check-circle"></i>

                <h1>{ message }</h1>



                <br />
                {
                    <Button onClick={ handler }> { isEdit ? "Go back" : "Add gem" } </Button>
                }

            </div>
        </section>

    );
}

export 
{
    PageSuccess
};
