import React, { useContext } from 'react';
import useForm from "../../hooks/useForm";
import AppContext from "../../Context";
import { extractFormData } from "../../utils/extractFormData";
import
{
    required,
} from "../../utils/validators";
import GemUpload from "../../components/GemUpload/GemUpload";


const config =
{
    name:
    {
        label: "Gem name",
        placeholder: "Input name...",
        validators: [ required ]
    },


};

function AddGem ()
{
    const [ formState, changeHandler ] = useForm( config );

    const handleSubmit = async ( ev ) =>
    {

        ev.preventDefault();
        const formData = extractFormData( formState.state );
    };

    return (
        <GemUpload
            fields={ [ ...formState.state ] }
            valid={ formState.valid }
            handleSubmit={ handleSubmit }
            changeHandler={ changeHandler } />
    );
}

export default AddGem;
