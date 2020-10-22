import React, { useRef } from 'react';
import { joinClasses } from "../../utils/joinClasses";
import { InputError } from "../Errors/Errors";

function File ( props ) 
{
    const input = useRef();
    const divWrap = useRef();

    const addClasses = () =>
    {
        divWrap.current.classList.add( props.FocusDropZone );
    };

    const handleBlur = () =>
    {
        divWrap.current.classList.remove( props.FocusDropZone );
    };

    const handleDragEnter = e =>
    {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = e =>
    {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = e =>
    {
        divWrap.current.classList.add( props.FocusDropZone );
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };
    const handleDrop = e =>
    {
        e.preventDefault();
        e.stopPropagation();

        const evt =
        {
            target:
            {
                type: "file",
                name: props.name,
                files: e.dataTransfer.files
            }
        };


        props.changeHandler( evt );
        input.current.files = e.dataTransfer.files;
        handleBlur();

    };

    return (
        <div className={ joinClasses( props.ExtraGroupClass, props.DragDrop ) }>
            <label
                htmlFor={ props.name } className={ props.classNamesLabel }>{ props.label }</label>
            <label
                name={ props.name }
                htmlFor={ props.name }
                onDrop={ handleDrop }
                onDragOver={ handleDragOver }
                onDragEnter={ handleDragEnter }
                onDragLeave={ handleDragLeave }
                ref={ divWrap }
            >

                <input
                    ref={ input }
                    accept="image/*"
                    onChange={ props.changeHandler }
                    multiple
                    type="file"
                    name={ props.name }
                    onFocus={ addClasses }
                    onBlur={ handleBlur }
                    id={ props.name } />

            </label>

            {props.touched && !props.valid && <InputError message={ props.message } /> }
        </div>

    );

}

export default File;
