import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";

import SideDrawer from "../../components/SideDrawer";
import AddGem from "./AddGem";
import EditUser from "./EditUser/EditUser";

import { joinClasses } from "../../utils/joinClasses";
import classes from "./index.module.css";

function Dashboard ()
{
    const [ isOpen, setIsOpen ] = useState( false );

    const toggleOpen = () =>
    {
        setIsOpen( !isOpen );
    };

    return (
        <div className={ classes.MainAppContainer }>
            <button
                className={ joinClasses( classes.Toggler, isOpen && classes.Open ) }
                onClick={ toggleOpen }>
                &#x21D0;
            </button>
            <aside >
                <SideDrawer

                    toggle={ toggleOpen }
                    isOpen={ isOpen } />
            </aside>
            <section >
                <Switch>
                    <Route path="/add-gem" component={ AddGem } />
                    <Route path="/edit-permissions" component={ EditUser } />
                </Switch>
            </section>
        </div>
    );
}

export default Dashboard;
