import React from 'react';
import { InputError } from "../Errors/Errors";

function Select ( props ) 
{
    return (
        <div className={ props.classNamesGroup }>
            <label className={ props.classNamesLabel } htmlFor={ props.name }>{ props.label }</label>

            <select
                className={ props.classNamesInput }
                onChange={ props.changeHandler }
                name={ props.name }
                id={ props.name }>
                <option value="">
                    ----Select----
                </option>

                {
                    props.options.map( opt => (
                        <option key={ opt.value } value={ opt.value }>
                            {opt.text }
                        </option>
                    ) )
                }

            </select>
            {props.touched && !props.valid && <InputError message={ props.message } /> }
        </div>
    );
}

export default Select;
