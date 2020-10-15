import React, { useContext } from 'react';
import useForm from "../../hooks/useForm";
import AppContext from "../../Context";
import { extractFormData } from "../../utils/extractFormData";
import
{
    required,
    price,
    fileCount
} from "../../utils/validators";
import gemList, { cuts } from "../../utils/gemList";
import GemUpload from "../../components/GemUpload/GemUpload";


const config =
{
    name:
    {
        label: "Gem name",
        placeholder: "Input name...",
        validators: [ required ]
    },
    type:
    {
        label: "Choose type",
        control: "select",
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
        validators: [ required, price ]
    },
    description:
    {
        label: "Gem description",
        control: "textarea",
        placeholder: "Type description.",
        validators: [ required ]
    },

    photos:
    {
        control: "file",
        label: "Upload Images ",
        validators: [ fileCount ]
    }


};

function AddGem ()
{
    const [ formState, changeHandler ] = useForm( config );
    const { sendData } = useContext( AppContext );

    const handleSubmit = async ( ev ) =>
    {
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

        const resp = await sendData(
            {
                endpoint: "admin/gems",
                method: "POST",
                formData,
            } );

        console.log( resp );


    };


    return (
        <GemUpload
            title="Add Gem"
            fields={ [ ...formState.state ] }
            valid={ formState.valid }
            handleSubmit={ handleSubmit }
            changeHandler={ changeHandler } />
    );
}

export default AddGem;
