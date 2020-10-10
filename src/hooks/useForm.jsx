// @ts-nocheck
import { useReducer } from 'react';
import { flattenFormFields } from "../utils/flattenFormFields";

const configureInitState = ( fieldConfig ) =>
{
    const formState =
    {
        valid: false,
        isSubmitting: false,
        state: {},
    };
    const { state } = formState;

    for ( const f in fieldConfig )
    {

        if ( fieldConfig[ f ].control === "file" )
        {
            state[ f ] =
            {
                control: fieldConfig[ f ].control,
                label: fieldConfig[ f ].label,
                photos: [],
                valid: false,
                validators: fieldConfig[ f ].validators,

            };
        }
        else
        {
            state[ f ] =
            {
                control: fieldConfig[ f ].control,
                label: fieldConfig[ f ].label,
                placeholder: fieldConfig[ f ].placeholder,
                value: "",
                valid: false,
                validators: fieldConfig[ f ].validators,
                options: fieldConfig[ f ].options
            };
        }

    };

    //so that i can apply some array methods to objects
    state[ Symbol.iterator ] = function ()
    {
        let keys = Object.keys( this );
        let count = 0;
        let isDone = false;

        let next = () =>
        {
            if ( count >= keys.length ) { isDone = true; }

            const flatten = flattenFormFields( state[ keys[ count ] ], keys[ count ] );
            count += 1;
            return (
                {
                    done: isDone,
                    value: flatten
                }
            );
        };

        return { next };
    };

    return formState;
};

const checkFormCanSubmit = ( formFieldStates ) =>
{
    let canSubmit = true;
    for ( const field of formFieldStates )
    {
        canSubmit = canSubmit && field.valid;
    }
    return canSubmit;
};

const reducer = ( state, action ) =>
{
    let formState = { ...state };
    let field, isValid;
    switch ( action.type )
    {
        case "change":

            field = formState.state[ action.payload.name ];
            formState.valid = false;

            field.value = action.payload.value;
            isValid = true;

            const pwd = formState.state.password ? formState.state.password.value.trim() : null;
            const confirmPwd = formState.state.confirmPassword ? formState.state.confirmPassword.value.trim() : null;

            if ( pwd && confirmPwd )
            {
                isValid = isValid && ( pwd === confirmPwd );
            }

            if ( field.control === "email" )
            {
                field.value = field.value.toLowerCase();
            }

            field.validators.forEach( check =>
            {
                isValid = isValid && check( field.value );
            } );

            field.valid = isValid;

            if ( checkFormCanSubmit( formState.state ) )
            {
                formState.valid = true;
            }

            return formState;

        case "file-change":

            field = formState.state[ action.payload.name ];
            formState.valid = false;
            const photos = action.payload.files;

            isValid = true && field.validators[ 0 ]( photos.length );

            if ( isValid )
            {
                field.photos = photos;
            }

            field.valid = isValid;

            if ( checkFormCanSubmit( formState.state ) )
            {
                formState.valid = true;
            }

            console.log( formState );

            return formState;


        default:
            return state;
    }


};

function useForm ( config )
{
    const [ formState, dispatch ] = useReducer( reducer, configureInitState( config ) );

    const changeHandler = evt =>
    {

        const { value, name, type } = evt.target;
        if ( type === "file" )
        {

            const files = evt.target.files;
            dispatch(
                {
                    type: "file-change",
                    payload:
                    {
                        name,
                        files,

                    }
                } );

        }
        else
        {
            dispatch(
                {
                    type: "change",
                    payload:
                    {
                        name,
                        value,
                    }
                } );

        }
    };

    return [ formState, changeHandler ];
}

export default useForm;
