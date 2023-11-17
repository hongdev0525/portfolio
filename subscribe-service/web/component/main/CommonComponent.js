import styled from "styled-components";

import { device } from "component/common/GlobalComponent";
import { fontWeight } from "component/common/GlobalComponent";

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
  border-radius: 80px;
  @media ${device.mobileL} {
    border-radius: 30px;
  }
`

export const Title = styled.div`
  font-size: 72px;
  line-height: 94px;
  font-weight: ${fontWeight("extraBold")};
  color:#DC5F00;
  margin-bottom: 20px;
  @media ${device.mobileL} {
    font-size:25px;
    font-weight: ${fontWeight("bold")};
    line-height: 35px;
    margin-bottom: 5px;
  }
`
export const SubTitle = styled.div`
  font-size: 24px;
  line-height: 25px;
  font-weight: ${fontWeight("semiBold")};
  color:#898989;
  margin-bottom: 20px;
  @media ${device.mobileL} {
    font-size:12px;
    line-height: 12.5px;
    margin-bottom: 12px;
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