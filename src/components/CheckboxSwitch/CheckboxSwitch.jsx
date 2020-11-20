import React from 'react';
import { joinClasses } from "../../utils/joinClasses";
import Field from "../Inputs/Field";
import classes from "./CheckboxSwitch.module.css";

function CheckboxSwitch ( props ) 
{
    return (
        <Field
            control="checkbox"
            classNamesGroup={ classes.Group }
            classNameSwitch={ classes.Switch }
            classNamesLabel={ classes.Text }
            changeHandler={ props.changeHandler }
            { ...props }
        >

            <div className={ joinClasses( classes.Slider, props.round && classes.Round ) }></div>
        </Field>
    );
}

export default CheckboxSwitch;
