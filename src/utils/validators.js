export const required = value => value.trim() !== '';

export const length = config => value =>
{
    let isValid = true;
    if ( config.min )
    {
        isValid = isValid && value.trim().length >= config.min;
    }
    if ( config.max )
    {
        isValid = isValid && value.trim().length <= config.max;
    }
    return isValid;
};

export const alphaNumeric = value => (
    /^[a-z0-9]{1,}$/ig.test( value.trim() )
);

export const email = value =>
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        value.trim()
    );

export const price = value => value > 0;

export const fileCount = config => files =>
{
    let isValid = true;
    if ( config.min )
    {
        isValid = isValid && files.length >= config.min;
    }
    if ( config.max )
    {
        isValid = isValid && files.length <= config.max;
    }
    return isValid;
};

export const isImage = files =>
{
    let isValid = true;
    //check file extesion
    const allowedImages = [ "png", "webp", "jpg", "svg", "jpeg", "gif", "ico" ];

    files.forEach( file => 
    {
        const indexOfDot = file.name.lastIndexOf( "." );
        const ext = file.name.substr( indexOfDot + 1 ).toLowerCase();
        isValid = isValid && allowedImages.includes( ext );
    } );

    return isValid;

};
