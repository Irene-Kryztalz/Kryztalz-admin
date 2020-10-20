import React, { useState, useContext } from 'react';
import AppContext from "../../../Context";

import Field from "../../../components/Inputs/Field";
import Title from "../../../components/Title";


import classes from './EditUser.module.css';

function EditUser () 
{
    const [ email, setEmail ] = useState( "" );
    const { permissions } = useContext( AppContext );

    const changeEmail = ( e ) =>
    {
        const { value } = e.target;
        setEmail( value );
    };

    return (
        <>
            <Title>Edit Gem</Title>
            <Field
                label="Email"
                value={ email }
                changeHandler={ changeEmail }
                control="email"
                placeholder="Enter email..."
            />
        </>
    );
}

export default EditUser;
