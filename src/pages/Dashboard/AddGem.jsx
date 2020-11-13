import React, { useContext, useState } from 'react';
import useForm from "../../hooks/useForm";
import AppContext from "../../Context";
import { extractFormData } from "../../utils/extractFormData";
import
{
    required,
    price,
    fileCount,
    isImage
} from "../../utils/validators";
import gemList, { cuts } from "../../utils/gemList";
import GemUpload from "../../components/GemUpload/GemUpload";

import { PageSuccess } from "../../components/Success/Success";


const config =
{
    name:
    {
        label: "Gem name",
        placeholder: "Input name...",
        validators: [ required ],
        message: "Please type a name for the gem",
    },
    type:
    {
        label: "Choose type",
        control: "select",
        message: "Please select a gem type",
        options: gemList.map( gem => (
            {
                value: gem.toLowerCase(),
                text: gem.toLowerCase()
            }
        ) ),
        validators: [ required ]
    },
    cutType:
    {
        label: "Choose cut",
        control: "select",
        message: "Please select a cut",
        options: cuts.map( gem => (
            {
                value: gem.toLowerCase(),
                text: gem.toLowerCase()
            }
        ) ),
        validators: [ required ]
    },
    price:
    {
        label: "price per weight",
        control: "number",
        placeholder: "Input price...",
        validators: [ required, price ],
        message: "Price must be a number and greater than 0",
    },
    description:
    {
        label: "Gem description",
        control: "textarea",
        placeholder: "Type description...",
        message: "Please enter gem description",
        validators: [ required ]
    },

    photos:
    {
        control: "file",
        label: "Upload Images ",
        message: "Only image file types allowed. File count must be at least 1 and less than 5",
        validators: [ fileCount( { min: 1, max: 4 } ), isImage ]
    }


};

function AddGem ()
{
    let [ formState, changeHandler, reset ] = useForm( config );
    const [ error, setError ] = useState( "" );
    const [ willAdd, setWillAdd ] = useState( true );
    const { makeRequest, logout } = useContext( AppContext );

    const handleSubmit = async ( ev ) =>
    {
        setError( null );
        ev.preventDefault();
        const formValues = extractFormData( formState.state );
        const formData = new FormData();

        for ( const key in formValues ) 
        {
            if ( Array.isArray( formValues[ key ] ) )
            {
                formValues[ key ].forEach( item => 
                {
                    formData.append( key, item );
                } );
            }
            else
            {
                formData.append( key, formValues[ key ] );
            }

        }

        const response = await makeRequest(
            {
                endpoint: "admin/gems",
                method: "POST",
                formData,
            } );

        if ( response.error )
        {
            if ( typeof response.error === "object" )
            {
                setError( response.error.error );
            }
            else
            {
                if ( response.error.includes( "expire" ) )
                {
                    logout();
                    return;
                }
                setError( response.error );
            }
        }
        else
        {
            setWillAdd( false );
            reset();

        }


    };

    if ( !willAdd )
    {
        return <PageSuccess
            handler={ () => setWillAdd( true ) }
            message="Gem successfully created" />;
    }


    return (
        <GemUpload
            error={ error }
            title="Add Gem"
            fields={ [ ...formState.state ] }
            valid={ formState.valid }
            handleSubmit={ handleSubmit }
            changeHandler={ changeHandler } />
    );
}

export default AddGem;
