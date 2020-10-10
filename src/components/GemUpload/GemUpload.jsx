import React from 'react';
import Field from "../Inputs/Field";
import Button from "../Button";
import { joinClasses } from "../../utils/joinClasses";

function GemUpload ( { fields, ...props } ) 
{
    return (
        <div>
            <form onSubmit={ props.handleSubmit } method="post">


                {
                    fields.map( field => (
                        <Field
                            key={ field.fieldName }
                            changeHandler={ props.changeHandler }
                            classNamesGroup=""
                            classNamesInput=""
                            classNamesLabel=""
                            name={ field.fieldName }
                            { ...field }
                        />
                    ) )
                }

            </form>
        </div>
    );
}

export default GemUpload;
