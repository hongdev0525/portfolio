import styled from "styled-components";
import Image from 'next/image'
import { device, FeatureBtn, fontWeight } from "component/common/GlobalComponent";
import Router from "next/router";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { useEffect } from "react";
const MainIntroWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 920px;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  background-image: url("/img/main/web/mainIntro.png");
  /* margin-top: 52px; */
  @media ${device.mobileL} {
    height: 715px;
    background-size: cover;
    background-position: center ;
    padding: 0 24px;
    background-image: url("/img/main/web/m_mainIntro.png");
  }

`

const MainIntroContainer = styled.div`
  width: 1194px;
  @media ${device.mobileL} {
      width: 100%;
  }
`
const MainTitle = styled.div`
  margin-top: 101px;
  @media ${device.mobileL} {
    text-align: right;
    margin-top: 92px;
  }
 
`
const SubTitle = styled.h1`
  font-size: 40px;
  font-weight: ${fontWeight("semiBold")};
  margin-bottom: 20px;
  @media ${device.mobileL} {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 10px;
  }
`

const TitleContainer = styled.div`
  margin-bottom: 40px;
  @media ${device.mobileL} {
    margin-bottom: 20px;
  }
`
const Title = styled.h2`
 font-size: 92px;
  line-height: 119px;
  font-weight: ${fontWeight("bold")};
  @media ${device.mobileL} {
    font-size: 40px;
    line-height: 56px;
  }
`

const IntroButton = styled(FeatureBtn)`
  width: 208px;
  height: 60px;
  font-size: 24px;
  line-height: 47px;
  font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    width: 131px;
    font-size: 16px;
    height: 46px;
    line-height: 23.5px;
    font-weight: ${fontWeight("semiBold")};
  }
`

const MainScroll = styled.div`
  position: absolute;

  bottom: 0%;
  left:50%;
  transform: translate(-50%,0);
  /* animation: floating 1.5s ease-in-out infinite; */
  @keyframes floating {
    0%{
      bottom: 10%;
    }
    50%{
      bottom: 0%;
    }
    10%{
      bottom: 10%;
    }
  }
  @media ${device.mobileL} {
      bottom: 0px;
    &>img{
      width: 45px;
      height: 42px;
    }
  }
`

function MainIntro() {
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    setMobile(isMobile)
  }, [])

  return (
    <MainIntroWrapper>
      <MainIntroContainer>
        <MainTitle>
          <SubTitle>반찬,샐러드 정기구독 서비스</SubTitle>
          <TitleContainer>
            <Title>집밥 고민 끝</Title>
            <Title>현관앞키친</Title>
          </TitleContainer>
          <IntroButton type="button" onClick={() => Router.push("/subscribe")}>구독하러가기</IntroButton>
        </MainTitle>
      </MainIntroContainer>
      <MainScroll>
        <Image src={`/img/main/web/mainScroll${mobile == true ? "_mobile" : "_web"}.png`} width={146} height={134} alt="스크롤 아이콘" />
      </MainScroll>
    </MainIntroWrapper>
  );
}

export default MainIntro;