import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import SideDrawer from "../../components/SideDrawer";
import AddGem from "./AddGem";
import EditGem from "./EditGem";
import EditUser from "./EditUser/EditUser";
import Overview from "./Overview/Overview";
import GemDisplay from "./GemDisplay";
import Page404 from "./Page404/Page404";

import { joinClasses } from "../../utils/joinClasses";
import classes from "./index.module.css";

function Dashboard ()
{

    const [ isOpen, setIsOpen ] = useState( false );

    const toggleOpen = () =>
    {
        setIsOpen( !isOpen );
    };

    useEffect( () => 
    {
        const resize = () =>
        {
            if ( window.innerWidth < 768 )
            {
                setIsOpen( false );
            }
        };

        window.addEventListener( "resize", resize );
        return () =>
        {
            window.removeEventListener( "resize", resize );
        };
    }, [ setIsOpen ] );


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
                <div className={ classes.Content } >
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
                            <Page404 />
                        </Route>

                    </Switch>
                </div>



                <footer>
                    <p className={ classes.Copyright }>
                        Copyright &copy; { new Date().getFullYear() } &nbsp;&nbsp;
                        <a href="https://github.com/Irene-Kryztalz/Kryztalz-admin" target="_blank" rel="noopener noreferrer">
                            Kryztalz </a>
                    </p>

                    <p className={ classes.Disclaimer }>

                        All images and icons displayed on this application belong to their respective owners.

                        <br /><br />

Logo design belongs to me however.

                        <br /> <br />

                        Kryztalz and the owners of this site are not liable for anything.

                        <br /><br />

                        All information about gems here was sourced from the internet.

                        <br /><br />

                         This application is simply an intellectual excercise.

                    </p>
                </footer>
            </section>


        </div>
    );
}

export default Dashboard;
