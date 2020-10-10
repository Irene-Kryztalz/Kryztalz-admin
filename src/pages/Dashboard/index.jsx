import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";

import SideDrawer from "../../components/SideDrawer";
import AddGem from "./AddGem";

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
            <aside id="side-nav">
                <SideDrawer

                    toggle={ toggleOpen }
                    isOpen={ isOpen } />
            </aside>
            <section id="page">
                <Switch>
                    <Route component={ AddGem } />
                </Switch>
            </section>
        </div>
    );
}

export default Dashboard;
