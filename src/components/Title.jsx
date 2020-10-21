import styled from 'styled-components';

const Title = styled.h3`
   color: var( --gold );
    margin: 12px 10px;
    font-size: ${ props => props.fS || "2rem" };
    font-family: 'Revalia', cursive;
    position: relative;
    padding-bottom: 10px;
    text-transform:capitalize;
    letter-spacing: ${ props => props.lS || 0 };

    &:after
    {
        content: "";
        background-color: var( --purple );
        position: absolute;
        height: 2px;
        width:${ props => props.width || "180px" };
        bottom: 0;
        left: 0;
    }

`;

export default Title;
