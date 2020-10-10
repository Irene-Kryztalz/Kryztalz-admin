import React from 'react';
import Field from "../Inputs/Field";
import Button from "../Button";
import classes from './GemUpload.module.css';

function GemUpload ( { fields, ...props } ) 
{
    return (
        <>

            <h3 className={ classes.Title }>{ props.title }</h3>
            <form
                className={ classes.FormContainer }
                encType="multipart/form-data"
                onSubmit={ props.handleSubmit }
                method="post">



                {
                    fields.map( field => (
                        <Field
                            key={ field.fieldName }
                            changeHandler={ props.changeHandler }
                            classNamesGroup={ classes.FormGroup }
                            classNamesInput={ classes.FormInput }
                            classNamesLabel={ classes.FormLabel }
                            ExtraGroupClass={ classes.ExtraGroupClass }
                            DragDrop={ field.control === "file" && classes.DragDrop }
                            name={ field.fieldName }
                            { ...field }
                        />
                    ) )
                }

                <Button type="submit">Submit</Button>



            </form>


        </>
    );
}

export default GemUpload;
