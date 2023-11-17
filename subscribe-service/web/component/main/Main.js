import styled from "styled-components";
import MainIntro from "./MainIntro";
import MainProduct from "./MainProduct";
import MainDeliveryDate from "./MainDeliveryDate";
import ProductImg from "./ProductImg";
import Feature from "./Feature";
import Features from "./Features";
import MenuList from "./MenuList";
import DeliveryAvailable from "./DeliveryAvailable";
import MainReview from "./MainReview";
import { FeatureBtn , device, fontWeight  } from "component/common/GlobalComponent";
import Router from "next/router";
const MainWrapper = styled.div`
  width: 100%;
  min-width: 100%;
  min-height: 100vh;
`

const SubscribeBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  width:100%;
  margin:0 auto;
`

const SubscribeBtn = styled(FeatureBtn)`
  /* width: 142px;
  height: 46px; */
  font-size:24px;
  @media ${device.mobileL} {
      width: 131px;
      height: 46px;
      font-size :14px;
      font-weight:${fontWeight("semiBold")};
      line-height:14.5px;
  }
`



function Main() {
  return (
    <MainWrapper>
      <MainIntro></MainIntro>
      <MainProduct></MainProduct>
      <SubscribeBtnContainer>
        <SubscribeBtn type="button" onClick={() => Router.push("/subscribe")}>구독하러가기</SubscribeBtn>
      </SubscribeBtnContainer>
      <MainDeliveryDate></MainDeliveryDate>
      <ProductImg></ProductImg>
      <Feature></Feature>
      <Features></Features>
      <MenuList></MenuList>
      <DeliveryAvailable></DeliveryAvailable>
      <MainReview></MainReview>
    </MainWrapper>
  );
}

export default Main;