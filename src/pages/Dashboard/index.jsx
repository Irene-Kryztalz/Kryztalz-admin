import React, { useState } from 'react';
import { joinClasses } from "../../utils/joinClasses";
import SideDrawer from "../../components/SideDrawer";
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
            <section id="top-nav">Top Nav</section>
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
                Dashboard
            </section>
        </div>
    );
}

export default Dashboard;
