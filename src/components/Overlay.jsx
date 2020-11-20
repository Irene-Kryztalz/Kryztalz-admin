import styled from 'styled-components';

const Overlay = styled.div`
   position:fixed;
   top:0;
   left:0;
   z-index:calc( 10 * var(--z) );
   width:100vw;
   height:100vh;
   background-color: var(--purple-transparent)

`;

export default Overlay;
