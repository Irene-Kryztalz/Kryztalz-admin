import React, { useContext } from 'react';
import AppContext from "../Context";

import Main from "../components/Main";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";

function Index () 
{
    const { isAuth } = useContext( AppContext );

    return (
        <Main>
            {
                isAuth ? < Dashboard /> : <SignIn />
            }
        </Main>

    );
}
export default Index;
