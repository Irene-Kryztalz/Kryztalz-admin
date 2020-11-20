import React from 'react';
import Field from "../Inputs/Field";
import Button from "../Button";
import Title from "../Title";
import classes from './GemUpload.module.css';

import { PageError } from "../Errors/Errors";

function GemUpload ( { fields, ...props } ) 
{
    return (
        <>
            <Title>{ props.title }</Title>
            {
                props.error && <PageError message={ props.error } />

            }
            <form
                className={ classes.FormContainer }
                encType="multipart/form-data"
                onSubmit={ props.handleSubmit }>



                {
                    fields.map( field => (
                        <Field
                            key={ field.fieldName }
                            changeHandler={ props.changeHandler }
                            classNamesGroup={ classes.FormGroup }
                            classNamesInput={ classes.FormInput }
                            classNamesLabel={ classes.FormLabel }
                            ExtraGroupClass={ classes.ExtraGroupClass }
                            FocusDropZone={ classes.ActiveDropZone }
                            DragDrop={ field.control === "file" && classes.DragDrop }
                            name={ field.fieldName }
                            { ...field }
                        />
                    ) )
                }

                <Button
                    className={ !props.valid && classes.Disabled }
                    type="submit">Submit</Button>



            </form>


        </>
    );
}

export default GemUpload;
