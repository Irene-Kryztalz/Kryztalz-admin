import React from 'react';
import { Switch, Route } from "react-router-dom";
import SideDrawer from "../../components/SideDrawer";
import classes from "./index.module.css";

function index ()
{
    return (
        <div className={ classes.MainAppContainer }>
            <section id="top-nav">Top Nav</section>
            <aside id="side-nav">
                <SideDrawer />
            </aside>
            <section id="page">
                Dashboard
            </section>
        </div>
    );
}

export default index;
