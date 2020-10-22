import React from 'react';
import useForm from "../../hooks/useForm";
import Button from "../Button";
import CheckboxSwitch from "../CheckboxSwitch/CheckboxSwitch";
import { extractFormData } from "../../utils/extractFormData";

import classes from "./PermForm.module.css";


function PermForm ( { config, submitHandler, mode, size, setMode } ) 
{
    const [ formState, changeHandler ] = useForm( config );

    const formSubmit = ev =>
    {
        ev.preventDefault();
        const formData = extractFormData( formState.state );
        submitHandler( formData.perms );
    };

    if ( size < 1 )
    {
        return (
            <div className={ classes.Form } >
                <h1 className={ classes.Title }>
                    No permissions to { mode }
                </h1>

                <Button
                    color="var(--gold)"
                    bg="#000"
                    onClick={ setMode }
                >Cancel</Button>

            </div>
        );
    }

    return (
        <form className={ classes.Form } onSubmit={ formSubmit }>

            <h1 className={ classes.Title }>Permissions to { mode }
            </h1>

            <div className={ classes.Inputs }>

                {
                    [ ...formState.state ][ 0 ].options.map( o => (
                        <CheckboxSwitch key={ o.name }
                            label={ o.name }
                            name={ o.name }
                            value={ o.value }
                            changeHandler={ changeHandler }
                            checked={ o.checked }
                            round
                            { ...o }
                        />
                    ) )
                }

            </div>

            <Button type="submit">Submit</Button>

            <Button
                color="var(--gold)"
                bg="#000"
                onClick={ setMode }
            >Cancel</Button>

        </form>
    );
}

export default PermForm;
