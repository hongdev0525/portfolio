import styled from "styled-components";
import { FeatureContainer, Title, SubTitle, Text, FeatureBtn } from "./CommonComponent"
import { fontWeight, device } from "component/common/GlobalComponent";
import Image from "next/image";
import Router from "next/router";
import { useEffect } from "react";
import { useState } from "react";


const FeaturesWrapprer = styled.div`
  width: 1600px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  margin-bottom: 45px;
  @media ${device.mobileL} {
    width: auto;
    flex-direction: column;
  margin-bottom: 0px;

  }
`

const Feature02Container = styled(FeatureContainer)`
  display: flex;
  flex-direction: column;
  width: 850px;
  height: 1000px;
  padding: 0  80px 24px;
  @media ${device.mobileL} {
    width: auto;
    height: 100%;
    margin: 0 24px 24px;
    padding:0;
    &>div{
      margin:0;
      padding:0;
      margin-bottom: 19px;
    }
    & img{
      width:259px;
      height:259px;
    }
  }
`
const Feature03Container = styled(FeatureContainer)`
  display: flex;
  flex-direction: column;
  width: 670px;
  height: 1000px;
  padding: 0 45px 80px;
  @media ${device.mobileL} {
    width: auto;
    height: 100%;
    margin: 0 24px 24px;
    padding:0;
    &>div{
      margin:0;
      padding:0;
      margin-bottom: 19px;
    }
    & img{
      width:259px;
      height:259px;
    }
  }
`

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 2;
  @media ${device.mobileL} {
    justify-content: center;
    z-index: 10;
    margin: 0 auto;
    & img{
      width: 271px;
      height: 278px;
    }
  }
`

const ImgCalendar = styled(Image)`
  position: absolute;
  width: 500px;
  height: 100%;
  top:0;
  left:50%;
  transform: translate(-50%,0);
  z-index: -1;
  @media ${device.mobileL} {
    justify-content: center;
    z-index: -1;
    margin: 0 auto;
    & img{
      width: 271px;
      height: 278px;
    }
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top:80px;
  @media ${device.mobileL} {
  }

`
const TitleGroup = styled.div`
  @media ${device.mobileL} {
    padding: 37px 0 0 28px;
  }
`

const FeaturesTitle = styled(Title)`
  font-size: 48px;
  line-height: 68px;
  @media ${device.mobileL} {
    font-size:25px;
    font-weight: ${fontWeight("bold")};
    line-height: 35px;
    margin-bottom: 5px;
  }
`



const CheckImage = styled(Image)`
  animation: checkAnimation 4s ease infinite; 
  animation-delay : ${props => { return props.delay + "ms" }};
  @keyframes checkAnimation {
      from{
        opacity: 0;
        transform: translate(0, 0px);
      }
      to{
        opacity: 1;
        transform: translate(0, -20px);
      }
  }
  @media ${device.mobileL} {
    width: 65px !important;
    height: 71px !important;
  }
`

function Features() {
  const [imgState, setImgState] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgState(currentState => currentState === 1 ? 2 : 1)
    }, 850)
    return () => clearInterval(interval);
  }, []);




  return (
    <FeaturesWrapprer>
      <Feature02Container>
        <TitleContainer>
          <TitleGroup>
            <SubTitle>어린이 메뉴</SubTitle>
            <FeaturesTitle>우리 아이가 먹을거니까<br></br>건강하게 수제로 조리해요</FeaturesTitle>
            <Text>어린이 반찬 고민은 현키 배송으로 해결!</Text>
            <FeatureBtn type="button" onClick={() => Router.push("/subscribe")}>구독하기</FeatureBtn>
          </TitleGroup>
        </TitleContainer>
        <ImgContainer>
          <Image quality={100} src={`/img/main/web/feature02_0${imgState}.png`} width={518} height={540} alt="무료배송 일러스트"></Image>
        </ImgContainer>
      </Feature02Container>
      <Feature03Container>
        <TitleContainer>
          <TitleGroup>
            <SubTitle>매일 다른 메뉴</SubTitle>
            <FeaturesTitle>원하는 요일에<br></br>원하는 구성으로!</FeaturesTitle>
            <Text>균형잡힌 한끼를 해결해요</Text>
            <FeatureBtn type="button" onClick={() => Router.push("/subscribe")}>어서 신청하기</FeatureBtn>
          </TitleGroup>
        </TitleContainer>
        <ImgContainer>
          <Image quality={100} src="/img/main/web/feature03_01.gif" width={500} height={500} alt="무료배송차 일러스트"></Image>
          <ImgCalendar quality={100} src="/img/main/web/feature03_01.png" width={500} height={500} alt="무료배송차 일러스트"></ImgCalendar>
        </ImgContainer>
      </Feature03Container>
    </FeaturesWrapprer >
  )
}

export default Features;