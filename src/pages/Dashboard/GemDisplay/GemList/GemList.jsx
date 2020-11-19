import React, { useEffect, useContext, useState, useCallback } from 'react';

import AppContext from "../../../../Context";
import Overlay from "../../../../components/Overlay";
import Button from "../../../../components/Button";
import GemCard from "../../../../components/GemCard/GemCard";
import classes from './GemList.module.css';

function numWithComma ( num ) 
{
    return num.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
}

function GemList ()
{
    const
        {
            count,
            gems,
            makeRequest,
            setGems,
            logout
        } = useContext( AppContext );
    const [ error, setError ] = useState( null );
    const [ activeGem, setActiveGem ] = useState( null );

    const toggleModal = ( e, gem ) =>
    {
        e.stopPropagation();
        setError( null );

        if ( gem )
        {
            setActiveGem( gem );
        }
        else
        {
            setActiveGem( null );
        }


    };

    const deleteGem = async () =>
    {
        const { error, data } = await makeRequest(
            {
                endpoint: `admin/gems/${ activeGem._id }`,
                method: "DELETE"
            } );


        if ( error )
        {
            if ( typeof error === "object" )
            {
                setError( error.error );
            }
            else
            {
                if ( error.includes( "expire" ) )
                {
                    logout();
                    return;
                }
                setError( error );
            }
        }
        else
        {
            const filteredGems = gems.filter( g => g._id !== activeGem._id );

            setGems( filteredGems, count - 1 );
            setActiveGem( null );
        }



    };

    const getGems = useCallback(
        async () =>
        {

            let response;

            if ( !gems.length )
            {
                response = await makeRequest(
                    {
                        endpoint: "shop/gems",
                    } );
            }
            else
            {
                const lastId = gems[ gems.length - 1 ]._id;
                response = await makeRequest(
                    {
                        endpoint: `shop/gems?lastId=${ lastId }`,
                    }, false );
            }

            const { error, data } = response;

            if ( error )
            {
                if ( typeof error === "object" )
                {
                    setError( error.error );
                }
                else
                {
                    setError( error );
                }
            }
            else
            {
                setGems( data.gems, data.count );
            }

        },
        [ makeRequest, setGems, setError, gems ],
    );

    useEffect( () => 
    {
        if ( !gems.length ) 
        {
            setTimeout( getGems, 500 );
        }

    }, [ gems, makeRequest, setGems, getGems ] );

    return (
        <div >
            <section className={ classes.Grid }>

                {
                    gems.map( gem => <GemCard
                        key={ gem._id }
                        _id={ gem._id }
                        name={ gem.name }
                        price={ numWithComma( gem.price ) }
                        image={ gem.imageUrls[ 0 ] }
                        setActiveGem={ toggleModal }
                        type={ gem.type } /> )
                }

            </section>

            {
                ( count > gems.length ) && <button onClick={ getGems } >Load more</button>
            }

            {
                activeGem && ( !error ) && <Overlay onClick={ toggleModal } >

                    <section className={ classes.Modal } >
                        <article className={ classes.ModalBody }>
                            <h2>Are you sure you want to delete this gem ?</h2>
                            <hr />

                            <div className={ classes.Image }>
                                <img src={ activeGem.image }
                                    alt={ `Gem photogragh of ${ activeGem.name }` }
                                />
                            </div>

                            <h3>Name : { activeGem.name }</h3>
                            <h3>Price : ₦ { activeGem.price }</h3>
                            <h3>Type : { activeGem.type }</h3>

                            <div className={ classes.Btns }>

                                <Button onClick={ toggleModal }>
                                    Cancel
                            </Button>

                                <Button
                                    color="#fff"
                                    bg="var(--err-red)"
                                    onClick={ deleteGem }>
                                    Delete
                            </Button>

                            </div>



                        </article>


                    </section>

                </Overlay>

            }

            {
                error && <Overlay onClick={ toggleModal } >

                    <section className={ classes.Modal } >
                        <article className={ classes.ModalBody }>
                            <h2>Error !!</h2>
                            <hr />

                            <p className={ classes.Error } >{ error }</p>


                            <div className={ classes.Btns }>

                                <Button onClick={ toggleModal }>
                                    Close Modal
                            </Button>


                            </div>



                        </article>


                    </section>

                </Overlay>

            }



        </div>
    );
}

export default GemList;
