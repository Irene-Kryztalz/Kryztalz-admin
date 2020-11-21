import React, { useState } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import SideDrawer from "../../components/SideDrawer";
import AddGem from "./AddGem";
import EditGem from "./EditGem";
import EditUser from "./EditUser/EditUser";
import Overview from "./Overview/Overview";
import GemDisplay from "./GemDisplay";

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
                    <Route exact path="/home" component={ Overview } />
                    <Route exact path="/add-gem" component={ AddGem } />
                    <Route exact path="/edit-gem/:id" component={ EditGem } />
                    <Route exact path="/edit-permissions" component={ EditUser } />
                    <Route path="/all-gems" component={ GemDisplay } />
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>

                    <Route path="/*">
                        <h1>Not Found</h1>
                    </Route>

                </Switch>
            </section>
        </div>
    );
}

export default Dashboard;
