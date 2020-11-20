import { useReducer } from 'react';
import { flattenFormFields } from "../utils/flattenFormFields";

const configureInitState = ( fieldConfig, isEdit ) =>
{
    const formState =
    {
        valid: isEdit,
        isSubmitting: false,
        state: {},
    };
    const { state } = formState;

    for ( const f in fieldConfig )
    {

        switch ( fieldConfig[ f ].control ) 
        {
            case "file":
                state[ f ] =
                {
                    control: fieldConfig[ f ].control,
                    label: fieldConfig[ f ].label,
                    valid: isEdit,
                    photos: fieldConfig[ f ].photos || [],
                    validators: fieldConfig[ f ].validators,

                };

                break;

            case "checkbox":
                state[ f ] =
                {
                    control: fieldConfig[ f ].control,
                    label: fieldConfig[ f ].label,
                    valid: isEdit,
                };

                state[ f ].value = [];
                state[ f ].options = [];

                fieldConfig[ f ].options.forEach( ( opt, i ) =>
                {
                    const option =
                    {
                        name: `${ f }-${ opt.name }`,
                        text: opt.name,
                        checked: false,
                        value: opt.val,
                        field: f
                    };

                    state[ f ].options.push( option );
                } );

                break;

            case "select":
                state[ f ] =
                {
                    options: fieldConfig[ f ].options,
                    control: fieldConfig[ f ].control,
                    label: fieldConfig[ f ].label,
                    valid: isEdit,
                    placeholder: fieldConfig[ f ].placeholder,
                    value: fieldConfig[ f ].value || "",
                    validators: fieldConfig[ f ].validators
                };
                break;

            default:
                state[ f ] =
                {
                    control: fieldConfig[ f ].control,
                    label: fieldConfig[ f ].label,
                    valid: isEdit,
                    placeholder: fieldConfig[ f ].placeholder,
                    value: fieldConfig[ f ].value || "",
                    validators: fieldConfig[ f ].validators
                };
                break;
        }

        state[ f ].touched = false;
        state[ f ].message = fieldConfig[ f ].message;

    }


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
            field.touched = true;
            field.value = action.payload.value;
            isValid = true;

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
            field.touched = true;
            const photos = action.payload.files;

            isValid = true;

            field.validators.forEach( check =>
            {
                isValid = isValid && check( [ ...photos ] );
            } );

            if ( isValid )
            {
                field.photos = photos;
            }

            field.valid = isValid;

            if ( checkFormCanSubmit( formState.state ) )
            {
                formState.valid = true;
            }

            return formState;

        case "checked":

            field = formState.state[ action.payload.field ];
            const optIndex = field.options.findIndex( o => o.name === action.payload.name );

            const values = [ ...new Set( [ ...field.value, action.payload.value ] ) ];

            field.value = values;
            field.options[ optIndex ].checked = true;

            return formState;

        case "checked-off":

            field = formState.state[ action.payload.field ];
            const optInd = field.options.findIndex( o => o.name === action.payload.name );

            field.options[ optInd ].checked = false;

            field.value = field.value.filter( v => v !== action.payload.value );
            return formState;

        case "reset":
            formState = configureInitState( action.payload );
            return formState;

        default:
            return state;
    }

};

function useForm ( config, isEdit = false )
{
    const [ formState, dispatch ] = useReducer( reducer, configureInitState( config, isEdit ) );

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
                        files
                    }
                } );

        }
        else if ( type === "checkbox" )
        {
            if ( evt.target.checked )
            {
                dispatch(
                    {
                        type: "checked",
                        payload:
                        {
                            name,
                            value,
                            field: evt.target.dataset.field
                        }
                    } );

            }
            else
            {
                dispatch(
                    {
                        type: "checked-off",
                        payload:
                        {
                            name,
                            value,
                            field: evt.target.dataset.field
                        }
                    } );

            }
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

    const reset = () =>
    {
        dispatch( { type: "reset", payload: config } );
    };

    return [ formState, changeHandler, reset ];
}

export default useForm;
