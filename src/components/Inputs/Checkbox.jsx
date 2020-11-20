import React from 'react';

function Checkbox ( props ) 
{

    return (
        <div className={ props.classNamesGroup }>
            <label
                className={ props.classNameSwitch }
                htmlFor={ props.id || props.name } >
                <input
                    checked={ props.checked }
                    id={ props.id || props.name }
                    value={ props.value }
                    disabled={ props.disabled }
                    onChange={ props.changeHandler }
                    type="checkbox"
                    data-field={ props.field }
                    name={ props.name } />

                { props.children }
            </label>

            <p className={ props.classNamesLabel } >{ props.text || props.label }</p>
        </div>

    );
}

export default Checkbox;
