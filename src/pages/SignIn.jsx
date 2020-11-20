import React, { useContext, useState } from 'react';
import useForm from "../hooks/useForm";
import AppContext from "../Context";
import Auth from "../components/Auth/Auth";
import { extractFormData } from "../utils/extractFormData";
import
{
    length,
    required,
    email,
    alphaNumeric
} from "../utils/validators";


const config =
{
    email:
    {
        label: "Email address",
        placeholder: "Input email...",
        control: "email",
        message: "Please type in a valid email",
        validators: [ required, email ]

    },
    password:
    {
        label: "Password",
        placeholder: "Enter password...",
        control: "password",
        message: "Invalid password. Password is case sensitive and must contain at least 8 alphanumeric characters",
        validators: [ required, length( { min: 8 } ), alphaNumeric ]
    }

};

function SignIn () 
{
    const [ formState, changeHandler ] = useForm( config );
    const [ error, setError ] = useState( "" );
    const { login, makeRequest } = useContext( AppContext );


    const handleSubmit = async ( ev ) =>
    {
        setError( null );
        ev.preventDefault();
        const formData = extractFormData( formState.state );

        const response = await makeRequest(
            {
                endpoint: "admin/signin",
                formData: JSON.stringify( formData ),
                method: "post",
                headers:
                {
                    "Content-Type": "application/json"
                }
            } );

        if ( response.error )
        {
            if ( typeof response.error === "object" )
            {
                setError( response.error.error );
            }
            else
            {
                setError( response.error );
            }

        }
        else
        {
            login( response.data.user );
        }

    };

    return (
        <Auth
            error={ error }
            to="sign-up"
            submitText="sign in"
            valid={ formState.valid }
            handleSubmit={ handleSubmit }
            changeHandler={ changeHandler }
            fields={ [ ...formState.state ] } />


    );
}
export default SignIn;
