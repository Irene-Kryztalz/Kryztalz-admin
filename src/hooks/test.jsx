import React, { useState, useEffect } from 'react';
import CheckboxSwitch from "../CheckboxSwitch/CheckboxSwitch";


function PermForm ( { perms, submitHandler } ) 
{

    const [ formState, setFormState ] = useState( {} );
    const changeHandler = e =>
    {
        const { value } = e.target;
        const state = { ...formState };
        const index = state.values.findIndex( v => value === v );
        const indexOpt = state.options.findIndex( o => 
        {
            console.log( o );
            return o.value === +value;
        } );


        if ( index > -1 )
        {
            state.options[ indexOpt ].checked = false;
            state.values = state.values.filter( v => value !== v );
        }
        else
        {
            state.options[ indexOpt ].checked = true;
            state.values.push( value );
        }

        setFormState( state );

    };

    useEffect( () => 
    {
        const formState =
        {
            options: perms.map( p => (
                {
                    name: p.name,
                    value: p.id,
                    checked: false,
                }
            ) ),
            values: []

        };

        setFormState( formState );

    }, [ perms ] );


    const formSubmit = ev =>
    {
        ev.preventDefault();
    };

    return (
        <form onSubmit={ formSubmit }>

            {
                formState.options?.map( o => (
                    <CheckboxSwitch key={ o.name }
                        label={ o.name }
                        name={ o.name }
                        value={ o.value }
                        id={ `${ o.name }-` }
                        changeHandler={ changeHandler }
                        checked={ o.checked }
                        text={ o.text }
                    />
                ) )
            }

        </form>
    );
}

export default PermForm;
