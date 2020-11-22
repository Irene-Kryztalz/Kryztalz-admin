import React from 'react';
import
{
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryLabel,
    VictoryTooltip
}
    from 'victory';

const colorsByType =
{
    "alexandrite": "#ae3fac",
    "amethyst": "#f296fd",
    "emerald": "#0fa185",
    "diamond": "#bcbcbd",
    "garnet": "#d8301d",
    "jade": "#25ad6b",
    "opal": "#50a2d4",
    "pearl": "#fadadd",
    "ruby": "#d54f5d",
    "sapphire": "#0250e4",
    "topaz": "#fdfc6c"
};

const colorsByCut =
{
    "none": "#6C7156",
    "asscher": "#212121",
    "baguette": "#CF3476",
    "briolette": "#3E5F8A",
    "cabachon": "#7F7679",
    "(antique) cushion": "8A9597",
    "emerald": "#C51D3",
    "heart": "#317F43",
    "marquise": "#B32428",
    "octagon": "#3B83BD",
    "oval": "#47449f",
    "drop": "#ffdf1d",
    "princess": "#EAE6CA",
    "radiant": "#2271B3",
    "round": "#781F19",
    "trillion / trilliant": "#3F888F",
    "buff-top": "#F5D033"

};

const formatTicks = ( tick, byCut ) =>
{
    tick = tick.toUpperCase();

    if ( byCut && tick.includes( "(" ) )
    {
        return "CU";
    }

    return tick.substr( 0, 2 );
};

const transformData = ( data, total ) =>
{

    return data.map( d =>
    {
        return {
            count: ( 100 * ( d.count / total ) ),
            _id: d._id,
            label: `${ d._id.toUpperCase() }\n${ d.count } out of ${ total }`
        };
    } );
};

const gold = "rgb(250, 219, 140)";

function Chart ( { data, byCut = true, label, total } )
{

    if ( !data?.length ) return null;

    return (
        <div>
            <VictoryChart
                domainPadding={ 20 }
                style=
                {
                    {
                        parent:
                        {
                            border: `1px solid ${ gold }`
                        },
                    }
                }
            >

                <VictoryAxis
                    style={
                        {
                            axis: { stroke: gold },
                            tickLabels: { fill: gold },
                            axisLabel: { fill: gold },
                        } }

                    label={ label }
                    tickFormat={ ( t ) => formatTicks( t ) }
                    axisLabelComponent={ <VictoryLabel dy={ -250 } /> }
                />

                <VictoryAxis
                    dependentAxis
                    tickValues={ [ 20, 40, 60, 80, 100 ] }
                    tickFormat={ ( t ) => `${ t }%` }
                    style=
                    {
                        {
                            axis: { stroke: gold },
                            tickLabels: { fill: gold },
                            grid: { stroke: gold }
                        }
                    }

                />
                <VictoryBar
                    style=
                    {
                        {
                            data:
                            {
                                fill: ( { datum } ) => 
                                {
                                    const name = datum.xName;
                                    if ( byCut )
                                    {
                                        return colorsByCut[ name ];
                                    }

                                    return colorsByType[ name ];
                                },
                                cursor: "pointer"
                            }

                        }
                    }
                    data={ transformData( data, total ) }
                    x="_id"
                    y="count"
                    sortKey="_id"
                    labelComponent=
                    {
                        <VictoryTooltip
                            flyoutPadding={ 10 }
                            pointerLength={ 6 }
                            flyoutStyle={ { fill: gold } }
                        />
                    }
                    animate={ { duration: 100 } }
                />
            </VictoryChart>
        </div>
    );
}

export default Chart;
