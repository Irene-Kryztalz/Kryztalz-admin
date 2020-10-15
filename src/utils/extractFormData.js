export const extractFormData = ( formFields ) =>
{
    const formData = {};
    for ( const field in formFields ) 
    {
        if ( formFields[ field ].control === "file" )
        {
            formData[ field ] = [ ...formFields[ field ].photos ];
        }
        else
        {
            formData[ field ] = formFields[ field ].value;
        }

    }
    return formData;
};
