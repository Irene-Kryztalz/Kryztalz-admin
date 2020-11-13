import React, { useState, useEffect, useContext } from 'react';
import AppContext from "../../../Context";
import Chart from "../../../components/Chart";
import { PageError } from "../../../components/Errors/Errors";
import styles from "./Overview.module.css";

function Overview ()
{
    const [ overview, setOverview ] = useState( {} );
    const [ error, setError ] = useState( null );
    const { user, makeRequest, logout } = useContext( AppContext );

    const getTotal = collection =>
    {
        if ( collection?.length )
        {
            const total = collection.reduce( ( sum, item ) => sum += item.count, 0 );
            return total;


        }

        return 1;
    };

    useEffect( () => 
    {
        const getOverview = async () =>
        {
            const { error, data } = await makeRequest(
                {
                    endpoint: "admin/overview",
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
                setOverview( data );
            }

        };

        setTimeout( getOverview, 500 );

    }, [ makeRequest, logout ] );




    return (
        <>
            <h2 className={ styles.Title } >
                Welcome, { user.name }
            </h2>

            {
                error
                    ?
                    <PageError message={ error } />
                    :
                    <>
                        <div className={ styles.GemCount }>

                            <p className={ styles.CountText }>Total number of gems in database</p>
                            <p className={ styles.Count } >{ overview.gemCount }</p>

                        </div>

                        <section className={ styles.ChartFlex }>
                            <Chart
                                percent
                                byCut={ false }
                                data={ overview.gemDistByType }
                                total={ getTotal( overview.gemDistByType ) }
                                label="Gem distribution by type" />

                            <Chart
                                percent
                                data={ overview.gemDistByCut }
                                total={ getTotal( overview.gemDistByCut ) }
                                label="Gem distribution by cut" />
                        </section>


                        <section className={ styles.ChartFlex }>
                            <Chart
                                byCut={ false }
                                total={ getTotal( overview.ordersByType ) }
                                data={ overview.ordersByType }
                                label="Order distribution by gem type" />

                            <Chart
                                data={ overview.ordersByCut }
                                total={ getTotal( overview.ordersByCut ) }
                                label="Order distribution by gem cut" />
                        </section>

                    </>
            }



        </>
    );
}

export default Overview;
