import React from 'react';
import { joinClasses } from "../../utils/joinClasses";
import classes from "./UserCard.module.css";
import Title from "../Title";
import CheckboxSwitch from "../CheckboxSwitch/CheckboxSwitch";
import Button from "../Button";

function UserCard ( { user, allowed, setMode, allowedLen, nAllowedLen } ) 
{
    return (
        <div className={ classes.Card }>

            <Title lS="2px" fS="1rem" width="32%">User name</Title>
            <p className={ joinClasses( classes.Text, classes.Name ) }>{ user.name }</p>

            <Title lS="2px" fS="1rem" width="32%">User email</Title>

            <p className={ classes.Text }>{ user.email }</p>

            <Title lS="2px" fS="1rem" width="50%">User permissions</Title>

            <div className={ classes.List }>

                {
                    allowed.map( perm => (
                        <CheckboxSwitch key={ perm.id }
                            label={ perm.name }
                            name={ perm.name }
                            value={ perm.id }
                            changeHandler={ () => { } }
                            disabled
                            checked
                        />
                    ) )
                }


            </div>

            <div className={ classes.Toggle }>
                {
                    nAllowedLen > 0 && <Button
                        onClick={ () => setMode( "add" ) }>Add Permission</Button>
                }
                {
                    allowedLen > 0 && <Button
                        color="var(--gold)"
                        bg="#000"
                        onClick={ () => setMode( "remove" ) }
                    >Remove Permission</Button>
                }


            </div>





        </div>
    );
}

export default UserCard;
