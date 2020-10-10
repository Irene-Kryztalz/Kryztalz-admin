import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { joinClasses } from "../../utils/joinClasses";
import Button from "../Button";
import AppContext from "../../Context";
import logo from "../../assets/images/logo-small.svg";
import classes from "./index.module.css";


const routes =
    [
        {
            path: "/home",
            text: "home",
            icon: <i className="fas fa-columns"></i>
        },
        {
            path: "/add-gem",
            text: "add gem",
            icon: <i className="fas fa-plus-circle"></i>
        },
        {
            path: "/edit-permissions",
            text: "edit user",
            icon: <i className="fas fa-user-plus"></i>
        }
    ];


function Index ( { isOpen, toggle } )
{
    const { logout } = useContext( AppContext );
    return (
        <nav className={ joinClasses( classes.SideMenu, ( isOpen ? classes.Open : null ) ) }>


            <div onClick={ toggle } className={ classes.Logo } >
                <NavLink to="/home">
                    <img src={ logo } alt="Krystalz logo" />

                    <h3>Krystalz</h3>
                </NavLink>

            </div>





            <ul className={ classes.Routes }>
                {
                    routes.map( r => (
                        <li
                            onClick={ toggle }
                            key={ r.path }>
                            <NavLink
                                activeClassName={ classes.Active }
                                to={ r.path } >

                                { r.icon }
                                { r.text }
                            </NavLink>
                        </li> ) )
                }
            </ul>


            <Button
                onClick={ logout }
                pad="10px 20px"
                className={ classes.Logout }>
                Sign Out <i className="fas fa-sign-out-alt"></i>
            </Button>

        </nav>
    );
}

export default Index;
