import React from 'react';
import classes from "./ImagePreview.module.css";

function ImagePreview ( { images } ) 
{
    return (
        <div className={ classes.ImageList } >

            {
                images.map( ( img, i ) => (
                    <div key={ i } className={ classes.ImgContainer }>
                        <img src={ img } alt="Photograph of gem" />
                    </div>
                ) )
            }

        </div>
    );
}

export default ImagePreview;
