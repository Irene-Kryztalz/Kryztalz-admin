// @ts-nocheck
import styled from 'styled-components';

const Title = styled.h3`
   color: var( --gold );
    margin: 12px 10px;
    font-size: 2rem;
    font-family: 'Revalia', cursive;
    position: relative;
    padding-bottom: 10px;

    &:after
    {
        content: "";
        background-color: var( --purple );
        position: absolute;
        height: 2px;
        width: 180px;
        bottom: 0;
        left: 0;
    }

`;

export default Title;
