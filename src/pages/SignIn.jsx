import React, { useContext } from 'react';
import useForm from "../hooks/useForm";
import AppContext from "../Context";
import Dashboard from "./Dashboard";
import Auth from "../components/Auth/Auth";
import Main from "../components/Main";
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
        validators: [ required, email ]

    },
    password:
    {
        label: "Password",
        placeholder: "Enter password...",
        control: "password",
        validators: [ required, length( { min: 8 } ), alphaNumeric ]
    }

};

function SignIn () 
{
    const [ formState, changeHandler ] = useForm( config );
    const { login, sendData, isAuth } = useContext( AppContext );


    const handleSubmit = async ( ev ) =>
    {
        ev.preventDefault();
        const formData = extractFormData( formState.state );

        const response = await sendData(
            {
                forAuth: true,
                endpoint: "user/signin",
                formData: JSON.stringify( formData ),
                method: "post",
                headers:
                {
                    "Content-Type": "application/json"
                }
            } );

        if ( response.error )
        {
            console.log( response );
        }
        else
        {
            const { token, expires } = response.data.user;
            login( token, expires );
            console.log( response.data.user );
        }



    };


    return (
        <Main>
            {
                isAuth ? < Dashboard /> : <Auth
                    to="sign-up"
                    submitText="sign in"
                    valid={ formState.valid }
                    handleSubmit={ handleSubmit }
                    changeHandler={ changeHandler }
                    fields={ [ ...formState.state ] } />
            }


        </Main>

    );
}
export default SignIn;
