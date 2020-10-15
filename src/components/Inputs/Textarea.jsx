import React from 'react';
import { joinClasses } from "../../utils/joinClasses";

function Textarea ( props )
{
    return (
        <div className={ joinClasses( props.classNamesGroup, props.ExtraGroupClass ) }>
            <label className={ props.classNamesLabel } htmlFor={ props.name }>{ props.label }</label>

            <textarea
                className={ props.classNamesInput }
                onChange={ props.changeHandler }
                name={ props.name }
                id={ props.name }
                rows="5"></textarea>

        </div>
    );
}

export default Textarea;
