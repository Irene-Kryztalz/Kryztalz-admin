import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
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


const formConfig = ( data ) =>
{
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
            label: "price per weight (in ₦)",
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

    for ( const field in data ) 
    {
        if ( config[ field ] )
        {

            config[ field ].value = data[ field ];
        }

        if ( field === "imageUrls" )
        {
            config.photos.photos = data.imageUrls;
        }

    }



    return config;

};

function EditGem () 
{
    const { location: { state }, push } = useHistory();
    const { makeRequest, logout, setGems } = useContext( AppContext );
    const [ error, setError ] = useState( null );
    let [ formState, changeHandler, reset ] = useForm( formConfig( state ), true );

    const [ editDone, setEditDone ] = useState( true );


    const handleSubmit = async ( ev ) =>
    {
        setError( null );
        ev.preventDefault();
        const formValues = extractFormData( formState.state );
        let formData; let headers = {};

        if ( typeof formValues.photos[ 0 ] !== "string" )
        {
            const data = new FormData();
            for ( const key in formValues ) 
            {
                if ( Array.isArray( formValues[ key ] ) )
                {
                    formValues[ key ].forEach( item => 
                    {
                        data.append( key, item );
                    } );
                }

                else
                {
                    data.append( key, formValues[ key ] );
                }

            }

            formData = data;
        }
        else
        {

            formData = JSON.stringify( { ...formValues, photos: false } );
            headers =
            {
                "Content-Type": "application/json"
            };

        }


        const { error, data } = await makeRequest(
            {
                endpoint: `admin/gems/${ state._id }`,
                method: "put",
                headers,
                formData
            }
        );


        if ( error )
        {
            if ( typeof error === "object" )
            {
                setError( error.error );
            }
            else
            {
                if ( error.includes( "expire" ) )
                {
                    logout();
                    return;
                }
                setError( error );
            }
        }
        else
        {
            setEditDone( false );
            reset();
            setGems( data );
        }
    };

    const goTo = () =>
    {
        push( "/all-gems" );
    };


    if ( !editDone )
    {
        return <PageSuccess
            isEdit
            handler={ goTo }
            message="Gem successfully edited" />;
    }



    return (
        <GemUpload
            error={ error }
            title="Edit Gem"
            fields={ [ ...formState.state ] }
            valid={ formState.valid }
            handleSubmit={ ( handleSubmit ) }
            changeHandler={ changeHandler } />
    );


}

export default EditGem;
