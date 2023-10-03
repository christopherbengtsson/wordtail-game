import { styled } from 'styled-components';

export function Input(props) {
  return (
    <Container>
      <StyledInput {...props} />
    </Container>
  );
}
const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 2px;
  font-size: 1rem;
  border-style: solid;
  border-width: 2px;
  border-color: rgb(132, 133, 132) rgb(254, 254, 254) rgb(254, 254, 254)
    rgb(132, 133, 132);
  line-height: 1.5;

  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background: rgb(255, 255, 255);

  &:before {
    position: absolute;
    left: 0px;
    top: 0px;
    content: '';
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-style: solid;
    border-width: 2px;
    border-color: rgb(10, 10, 10) rgb(223, 223, 223) rgb(223, 223, 223)
      rgb(10, 10, 10);
    pointer-events: none;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 3px inset;
  }
`;

const StyledInput = styled.input`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: none;
  font-size: 1rem;
  min-height: ${(p) => p.theme.sizes.buttonHeight};
  font-family: inherit;
  color: rgb(10, 10, 10);
  padding: 0px 8px;
`;
