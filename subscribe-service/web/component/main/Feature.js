import styled from "styled-components";
import { FeatureContainer, Title, SubTitle, Text, FeatureBtn } from "./CommonComponent"
import Image from "next/image";
import { scrollState } from "state/common";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import Router from "next/router";
import { useState } from "react";
import { device } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";

const Feature01Wrapprer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
  @media ${device.mobileL} {
   margin: 0 24px 32px;
  }
`

const Feature01Container = styled(FeatureContainer)`
  display: flex;
  justify-content: flex-start;
  width: 1600px;
  margin: 0 auto;
  padding:41px 0 41px 200px;
  @media ${device.mobileL} {
    flex-direction: column ;
    align-items: flex-end;
    padding:0;
    width: 327px;
    height: 531px;
  }
`
const ImgContainer = styled.div`
  position: relative;
  width:986px;
  @media ${device.mobileL} {
    width:326px;
    height : 369px;
    &>img{
      position: absolute;
      left:0;
      bottom: 0;
      width: 100%;
      height:369px;
    }
  }
`
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top:94px;
  @media ${device.mobileL} {
    text-align: right;
    padding-right: 28px ;
    padding-top: 37px;
  }
`
const TitleGroup = styled.div`
  margin-bottom: 292px;
  @media ${device.mobileL} {
    text-align: right;
    margin-bottom: 0px;
  }
`
const Vehicle = styled.div`
    transform: translate(0,0) rotate(0deg);
    animation : ${props => { return props.acitive === true ? 'move .8s ease normal' : 'none' }};
@keyframes move {
  0%{
    transform: translate(-100%,0);
  }

  90%{
    transform: translate(0,0) rotate(0deg);
  }
  94%{
    transform: translate(0,0) rotate(4deg);
  }
  98%{
    transform: translate(0,0) rotate(-2deg);
  }
  100%{
    transform: translate(0,0) rotate(0deg);
  }
}
`
function Feature01() {
  const scrollY = useRecoilValue(scrollState).scrollValue;
  const [vehicleActive, setVehicleActive] = useState(false);
  const [imgState, setImgState] = useState(1);

  const [mobile, setMobile] = useState();
  useEffect(() => {
    if (scrollY > 8400) {
      setVehicleActive(true)
    } else {
      setVehicleActive(false)
    }
  }, [scrollY])

  useEffect(() => {
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setImgState(currentState => currentState === 1 ? 2 : 1)
    }, 1000)
    return () => clearInterval(interval);
  }, []);


  return (
    <Feature01Wrapprer>
      <Feature01Container>
        <TitleContainer>
          <TitleGroup>
            <SubTitle>새벽배송</SubTitle>
            <Title>하루 한팩도<br></br>무료 배송!</Title>
            <Text>냉장고에 쌓아두지 말고<br></br>딱! 먹을만큼만 배송받아요</Text>
            <FeatureBtn type="button" onClick={() => Router.push("/subscribe")}>무료배송받기</FeatureBtn>
          </TitleGroup>
          {
            !mobile &&
            <Vehicle acitive={vehicleActive}>
              <Image quality={100} src="/img/main/web/feature01_02.png" width={211} height={131} alt="무료배송차 일러스트"></Image>
            </Vehicle>
          }
        </TitleContainer>
        {!mobile &&
          <ImgContainer>
            <Image quality={100} src={`/img/main/web/feature01_01.png`} width={1182} height={1101} alt="무료배송 일러스트"></Image>
          </ImgContainer>
        }
        {mobile &&
          <ImgContainer>
            <Image quality={100} src={`/img/main/web/m_feature01_0${imgState}.png`} width={1182} height={1101} alt="무료배송 일러스트"></Image>
          </ImgContainer>
        }

      </Feature01Container>
    </Feature01Wrapprer>
  )
}

export default Feature01;