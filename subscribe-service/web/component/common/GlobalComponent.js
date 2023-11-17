
import styled, { css } from "styled-components";


export const fontWeight = (weight) => {
  switch (weight) {
    case "black":
      return 900;
    case "extraBold":
      return 800;
    case "bold":
      return 700;
    case "semiBold":
      return 600;
    case "medium":
      return 500;
    case "regular":
      return 400;
    case "light":
      return 300;
    case "extraLight":
      return 200;
    case "thin":
      return 100;
    default:
      return 500;
  }
}


const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`
};



export const Box = styled.div`
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  height: fit-content;
  font-weight: bold;
  padding: 20px;
`;


export const Notice = styled.p`
  color:tomato;
`

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #333;
  padding: 16px 0;
`;
export const PageTitle = styled.h1`
  font-size: 18px;
  color: #666;
  padding: 16px 0;
`;

export const InputGroup = styled.div`
  width: 100%;
  margin: 20px 0;
  @media ${device.mobileL} {
    margin: 15px 0;
  }
`;
export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
export const InputContainer = styled.div`
  position: relative;
  @media ${device.mobileL} {
    width: 100%;
  }
`;
export const InputLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 6px;
  font-weight: 400;
  span{
    color:#767676;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid #DBDBDB;
  border-radius: 4px;
  padding: 21px 10px;
  outline: none;
  ::placeholder{
    font-size:16px;
    line-height: 26px;
    color:#A9A9A8;
    font-weight: 400;
  }
  &:focus {
    border: 1px solid #333;
  }
  ${(props) =>
    props.readOnly === true
      ? `
    background-color: #fafafa;
    &:focus {
    border: 1px solid #e5e5e5;
    }
    `
      : ""}



  @media ${device.mobileL} {
    font-size:12px;
    height: 48px;
    padding: 12px 5px;
   
    ::placeholder{
      font-size:11px;
      line-height: 10px;
      color:#A9A9A8;
      font-weight: 400;
    }
  }

 

`;

export const Button = styled.button`
  width: fit-content;
  height: 56px;
  background-color: #DC5F00;
  color: #fcfcfc;
  font-weight: bold;
  border: none;
  border-radius: 40px;
  font-size: 18px;
  box-shadow: 0 3px 6px rgba(0,0,0,.2);
  cursor: pointer;
  ${(props) =>
    props.pos
      ? css`
          float: right;
        `
      : ""}
  &:disabled {
    border: 1px solid #777;
    background-color: #fcfcfc;
    color: #777;
  }
  &:active {
    border: 1px solid #333;
    background-color: #fcfcfc;
    color: #333;
  }

  @media ${device.mobileL} {
    width: 131px;
    height: 46px;
    font-size :18px;
    font-weight:600;
    line-height:23.5px;
  }
`;


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
`
export const FlexContainer = styled.div`
  display: flex;
  width: 100%;
`

export const ShadowBox = styled.div`
  border:1px solid #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 5px 10px #f6f6f6;
  padding: 20px;
`

export const BoxUList = styled.ul`
  display: flex;
  justify-content:space-around;
  align-items: center;
  flex-direction: column;
  border:1px solid #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 5px 10px #f6f6f6;
  padding: 10px 20px;
  margin-bottom: 48px;
  & li{

    display: flex;
  justify-content: space-between;
  align-items:center;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  border-bottom :  1px solid #e5e5e5;
  cursor: pointer;
  svg{
    width: 18px;
    height: 18px;
  }
  }
  & li:last-child{
    border: none;
    margin-bottom: 0;
  }
`



/**
 * 자간은 gloabl.css에 초기화
 */
export const Header01 = styled.div`
 font-size: 96px;
 font-weight: ${fontWeight("bold")};
 line-height: 119px;
`
export const Header02 = styled.div`
 font-size: 80px;
 font-weight: ${fontWeight("bold")};
 line-height: 119px;
`
export const Header03 = styled.div`
 font-size: 72px;
 font-weight: ${props => { return fontWeight(props.fontWeight) }};
 line-height: 119px;
`


export const FeatureContainer = styled.div`
 display: flex;
 justify-content: space-between;
 box-shadow: 5px 10px 40px rgba(87,86,86,.1);
 background-color: #FFF9F5;
 border-radius: 80px;
 @media ${device.mobileL} {
   border-radius: 30px;
 }
`

export const Text = styled.div`
 font-size: 24px;
 line-height: 32px;
 font-weight: ${fontWeight("regular")};
 color: #4D4D4D;
 margin-bottom: 42px;
 @media ${device.mobileL} {
   font-size:16px;
   line-height: 22px;
   font-weight: ${fontWeight("medium")};
   margin-bottom: 22px;

 }

`

export const FeatureBtn = styled.button`
   width: 230px;
   height: 74px;
   color:#fcfcfc;
   font-size: 28px;
   line-height: 29px;
   font-weight: ${fontWeight("bold")};
   background-color:#DC5F00 ;
   border-radius:40px;
   border:none;
   box-shadow: 5px 5px 10px rgba(0,0,0,.2);
   cursor: pointer;
   @media ${device.mobileL} {
     width: 131px;
     height: 46px;
     font-size :14px;
     font-weight:${fontWeight("bold")};
     line-height:14.5px;
 }
`