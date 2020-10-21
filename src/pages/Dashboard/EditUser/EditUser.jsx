import React, { useContext, useReducer, useState } from 'react';
import AppContext from "../../../Context";
import { email as isEmail } from "../../../utils/validators";

import Button from "../../../components/Button";
import Field from "../../../components/Inputs/Field";
import Title from "../../../components/Title";
import UserCard from "../../../components/UserCard/UserCard";
import PermForm from "../../../components/PermForm/PermForm";


import classes from './EditUser.module.css';

const reducer = ( state, action ) =>
{
    switch ( action.type ) 
    {
        case "setEmail":
            return { ...state, email: action.payload };

        case "search":
            return { ...state, last: action.payload };

        case "setUser":
            return {
                ...state, user: action.payload,
                error: null
            };

        case "setUserPerms":
            const { allowed, notAllowed } = action.payload;
            return {
                ...state,
                allowedPerms: allowed,
                notAllowedPerms: notAllowed,
                error: null
            };

        case "setError":
            return { ...state, error: action.payload };

        case "setShow":
            return { ...state, show: true };


        case "setMode":
            return { ...state, mode: action.payload };


        default:
            return state;
    }
};

function EditUser () 
{
    const { permissions, sendData } = useContext( AppContext );
    const [ state, dispatch ] = useReducer( reducer,
        {
            last: "",
            email: "",
            user: {},
            allowedPerms: [],
            notAllowedPerms: [],
            submitPerms: [],
            error: null,
            show: false,
            mode: null
        } );

    const [ showForm, setShowForm ] = useState( false );
    const [ config, setConfig ] = useState( {} );

    const changeEmail = ( e ) =>
    {
        const { value } = e.target;
        dispatch(
            {
                type: "setEmail",
                payload: value
            } );
    };

    const searchUser = async () =>
    {
        const { last, email } = state;

        if ( last === email )
        {
            return;
        }
        else if ( isEmail( email ) ) 
        {
            dispatch(
                {
                    type: "search",
                    payload: email
                }
            );

            const response = await sendData(
                {
                    endpoint: "admin/user",
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    formData: JSON.stringify( { email } )
                } );

            if ( response.error )
            {
                if ( typeof response.error === "object" )
                {
                    dispatch(
                        {
                            type: "setError",
                            payload: response.error.error
                        }
                    );
                }
                else
                {
                    dispatch(
                        {
                            type: "setErr",
                            payload: response.error
                        }
                    );
                }

            }
            else
            {
                const { data } = response;
                dispatch(
                    {
                        type: "setUser",
                        payload: data
                    } );
                genPerms( data.roleId );
            }
        }
        else
        {
            dispatch(
                {
                    type: "setError",
                    payload: "Invalid email"
                }
            );
        }

        if ( !state.show )
        {
            dispatch(
                {
                    type: "setShow"
                } );
        }

    };

    const genPerms = ( roleId ) =>
    {
        const allowed = [];
        const notAllowed = [];

        permissions.forEach( perm =>
        {
            if ( perm.id & roleId )
            {
                allowed.push( perm );
            }
            else
            {
                notAllowed.push( perm );
            }
        } );

        dispatch(
            {
                type: "setUserPerms",
                payload:
                {
                    allowed,
                    notAllowed
                }
            }
        );
    };

    const handleSubmit = async ( perms ) =>
    {
        const payload =
        {
            id: state.user._id,
            perms
        };

        let endpoint = "admin/add-permission";

        if ( state.mode === "remove" )
        {
            endpoint = "admin/remove-permission";
        }

        const response = await sendData(
            {
                endpoint,
                formData: JSON.stringify( payload ),
                method: "PUT",
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
            const user = response.data;
            dispatch(
                {
                    type: "setUser",
                    payload: user
                } );
            genPerms( user.roleId );
            setShowForm( false );
        }

    };

    const setMode = ( mode ) =>
    {

        if ( mode === "add" )
        {
            const formConfig =
            {
                perms:
                {
                    label: "",
                    control: "checkbox",
                    options: state.notAllowedPerms.map( p => (
                        {
                            val: p.id,
                            name: p.name
                        }
                    ) )
                }

            };

            setShowForm( true );
            setConfig( formConfig );

            dispatch(
                {
                    type: "setMode",
                    payload: "add"
                }
            );
        }
        else if ( mode === "remove" )
        {
            const formConfig =
            {
                perms:
                {
                    label: "",
                    control: "checkbox",
                    options: state.allowedPerms.map( p => (
                        {
                            val: p.id,
                            name: p.name
                        }
                    ) )
                }

            };
            setShowForm( true );
            setConfig( formConfig );
            dispatch(
                {
                    type: "setMode",
                    payload: "remove"
                }
            );
        }
        else
        {
            setShowForm( false );
        }

    };

    return (
        <>
            <Title>Edit User</Title>
            <section className={ classes.Group }>
                <Field
                    label="User mail"
                    value={ state.email }
                    changeHandler={ changeEmail }
                    control="email"
                    placeholder="Enter email..."
                    classNamesInput={ classes.Input }
                    classNamesLabel={ classes.Label }
                />
                <Button onClick={ searchUser } >Search</Button>
            </section>

            {
                state.show && (
                    state.error
                        ?
                        <h1>{ state.error }</h1>
                        :
                        <section className={ classes.User }>
                            <UserCard
                                setMode={ setMode }
                                allowed={ state.allowedPerms }
                                user={ state.user } />

                            <div>
                                {
                                    showForm && state.mode === "add" &&
                                    <PermForm
                                        submitHandler={ handleSubmit }
                                        config={ config }
                                    />
                                }

                                {
                                    showForm && state.mode === "remove" &&
                                    <PermForm
                                        submitHandler={ handleSubmit }
                                        config={ config }
                                    />
                                }
                            </div>



                        </section>

                )
            }



        </>
    );
}

export default EditUser;
