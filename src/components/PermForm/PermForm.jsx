import React from 'react';
import useForm from "../../hooks/useForm";
import CheckboxSwitch from "../CheckboxSwitch/CheckboxSwitch";
import { extractFormData } from "../../utils/extractFormData";


function PermForm ( { config, submitHandler } ) 
{
    const [ formState, changeHandler ] = useForm( config );

    const formSubmit = ev =>
    {
        ev.preventDefault();
        const formData = extractFormData( formState.state );
        submitHandler( formData.perms );
    };

    return (
        <form onSubmit={ formSubmit }>

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

            <button type="submit">Submit</button>

        </form>
    );
}

export default PermForm;
