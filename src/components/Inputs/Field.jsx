import React from 'react';
import PropTypes from 'prop-types';
import TextLike from "./TextLike";
import Select from "./Select";
import Textarea from "./Textarea";
import Checkbox from "./Checkbox";
import File from "./File";

function Field ( props )
{

    switch ( props.control.toLowerCase() )
    {
        case "email":
        case "password":
        case "number":
            return <TextLike control={ props.control.toLowerCase() } { ...props } />;

        case "select":
            return <Select options={ props.options } { ...props } />;

        case "textarea":
            return <Textarea { ...props } />;

        case "file":
            return <File { ...props } />;

        case "checkbox":
            return <Checkbox { ...props } />;

        default:
            return <TextLike { ...props } />;
    }
}

Field.defaultProps =
{
    control: "text"
};


Field.propTypes =
{
    control: PropTypes.string,
    changeHandler: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
    valid: PropTypes.bool,
    required: PropTypes.bool,
    validators: PropTypes.arrayOf( PropTypes.func ),
    options: PropTypes.arrayOf( PropTypes.object ),
    classNamesInput: PropTypes.string,
    classNamesLabel: PropTypes.string,
    classNamesGroup: PropTypes.string,

};


export default Field;
