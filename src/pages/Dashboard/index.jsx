import React, { useState } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import SideDrawer from "../../components/SideDrawer";
import AddGem from "./AddGem";
import EditUser from "./EditUser/EditUser";
import Overview from "./Overview/Overview";
import GemList from "./GemDisplay/GemList/GemList";

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
                    <Route path="/home" component={ Overview } />
                    <Route path="/add-gem" component={ AddGem } />
                    <Route path="/edit-permissions" component={ EditUser } />
                    <Route path="/all-gems" component={ GemList } />
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>

                </Switch>
            </section>
        </div>
    );
}

export default Dashboard;
