import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import Overlay from "../../../../components/Overlay";
import Button from "../../../../components/Button";
import GemCard from "../../../../components/GemCard/GemCard";

import LoadMore from "../../../../components/LoadMore/LoadMore";

import classes from '../GemList/GemList.module.css';

import AppContext from "../../../../Context";

function numWithComma ( num ) 
{
    return num.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
}

function GemSearch () 
{
    let { term } = useParams();
    const history = useHistory();
    const [ gems, setGems ] = useState( [] );
    const [ error, setError ] = useState( null );
    const [ activeGem, setActiveGem ] = useState( null );
    const [ count, setCount ] = useState( 0 );
    const [ pageLoad, setPageLoad ] = useState( false );
    const [ hasL, setHasL ] = useState( false );
    const [ last, setLast ] = useState( term );

    const
        {
            makeRequest,
            logout,
            loading
        } = useContext( AppContext );

    const deleteGem = async () =>
    {
        const { error } = await makeRequest(
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

    const getGems = useCallback(
        async ( reload ) =>
        {

            setLast( term );
            setHasL( true );
            setError( null );
            let response;

            if ( !gems.length || reload )
            {
                response = await makeRequest(
                    {
                        endpoint: `shop/search?searchString=${ term }`,
                    } );
            }
            else
            {
                setPageLoad( true );
                const lastId = gems[ gems.length - 1 ]._id;
                response = await makeRequest(
                    {
                        endpoint: `shop/search?searchString=${ term }&lastId=${ lastId }`,
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
                if ( data.count )
                {
                    setGems( [ ...gems, ...data.gems ] );
                }
                else
                {
                    setGems( [] );
                }
                setCount( data.count );
                setPageLoad( false );

            }

        },
        [ makeRequest, setGems, setCount, setError, gems, logout, term, setHasL ],
    );

    useEffect( () => 
    {

        if ( !gems.length && !hasL ) 
        {
            getGems();
        }

        if ( term !== last )
        {

            setGems( [] );
            getGems( true );
        }

    }, [ gems, getGems, hasL, term, last ] );

    const goTo = async id =>
    {
        const { error, data } = await makeRequest(
            {
                endpoint: `shop/gems/${ id }`
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
            history.push( `/edit-gem/${ id }`, data );
        }

    };

    return (
        <div>

            { !gems.length && !( loading || pageLoad ) && <div className={ classes.Nothing }>
                <h1>No gems found </h1>

                <Button onClick={ () => history.push( "/all-gems" ) } >Go back</Button>
            </div>
            }

            {
                gems.length && <h1 className={ classes.Preview }>
                    { count } { count === 1 ? "result" : "results" } found for <q>{ term }</q>
                </h1>
            }


            <section className={ classes.Grid }>

                {
                    gems.map( gem => <GemCard
                        goTo={ goTo }
                        key={ gem._id }
                        _id={ gem._id }
                        name={ gem.name }
                        cutType={ gem.cutType }
                        price={ numWithComma( gem.price ) }
                        image={ gem.imageUrls[ 0 ] }
                        setActiveGem={ toggleModal }
                        type={ gem.type } /> )
                }

            </section>

            {
                ( count > gems.length ) && <LoadMore loading={ pageLoad } click={ () => getGems( false ) } />
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


                            <div className={ classes.Icon }>
                                <i className="fas fa-exclamation-circle"></i>
                            </div>

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

export default GemSearch;
