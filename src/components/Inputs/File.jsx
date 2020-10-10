import React, { useRef } from 'react';
import { joinClasses } from "../../utils/joinClasses";

function File ( props ) 
{
    const input = useRef();


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
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };
    const handleDrop = e =>
    {
        e.preventDefault();
        e.stopPropagation();
        let files = [ ...e.dataTransfer.files ];

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
            >

                <input
                    ref={ input }
                    onChange={ props.changeHandler }
                    multiple
                    type="file"
                    name={ props.name }
                    id={ props.name } />

            </label>
        </div>

    );

}

export default File;
