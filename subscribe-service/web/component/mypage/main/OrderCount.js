import styled from "styled-components";
import { fontWeight, device } from "component/common/GlobalComponent";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";
import { mypageSubscribeInfoState } from "state/mypage";
import { useRecoilValue, useSetRecoilState } from "recoil";

const OrderCountWrapper = styled.div`
  width: 395px;
  height: 171px;
  border: 1px solid #DBDBDB;
  border-radius:5px;
  padding: 30px 50px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  @media ${device.mobileL} {
   width: 100%;
   height: 154px;
   padding: 20px;
   margin-bottom: 8px;
  }
`
const OrderCountContainer = styled.div`
  position: relative;
  @media ${device.mobileL} {
   width : 245px;
   margin: 0 auto;
  }
`

const OrderCountTitle = styled.div`
  font-size: 16px;
  line-height: 23px;
  font-weight: ${fontWeight("regular")};
  color:#999999;
`

const OderCountRange = styled.div`
  position: relative;
  margin-top: 36px;
  height: 16px;
  border-radius: 8px;
  background-color: #F3F3F7;
  :after {
    content: '';
    position: absolute;
    top:0;
    left:0;
    background-color: #DC5F00;
    border-radius: 8px;
    width: ${props => { return props.positon }};
    height: 16px;
  }
  @media ${device.mobileL} {
   margin-top : 30px;
  }
`
const TodayBox = styled(Image)`
  position: absolute;
  left:${props => props.positon};
  top:0;
  transform: translate(-15px,-50%);
  z-index: 2;
`
const TodayBoxLabel = styled.div`
  position: absolute;
  left:${props => props.positon};
  bottom: -40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-26px,0%);
  width: 53px;
  height: 32px;
  background-image: url("/img/mypage/speech_icon.png");
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 5px;
  font-size: 15px;
  line-height: 23px;
  font-weight: ${fontWeight("regular")};
  z-index: 10;
  background-color: #fefefe;
`
const Flag = styled(Image)`
  position: absolute;
  right: -10px;
  top:0;
  transform: translate(0px,-80%);
`
const FlagLabel = styled.div`
  position: absolute;
  right: -5px;
  bottom: -35px;
  transform: translate(0px,0);
`

function OrderCount({ subscribeInfo }) {

  const [mobile, setMobile] = useState(null);
  const totalCount = subscribeInfo.totalOrderCnt;
  const remainCount = totalCount - subscribeInfo.remainOrderCnt;
  let position = null;
  const rangeLength = isMobile ? 245 : 300;
  position = (rangeLength / totalCount) * remainCount + "px";


  useEffect(() => {
    setMobile(isMobile);
  }, [])

  console.log("subscribeInfo", subscribeInfo)

  return (
    <OrderCountWrapper>
      <OrderCountTitle>이만큼 먹었어요!</OrderCountTitle>
      <OrderCountContainer>
        <OderCountRange positon={position}></OderCountRange>
        <TodayBox positon={position} src="/img/mypage/todaybox_icon.png" width={31} height={41} alt="오늘의 박스 아이콘"></TodayBox>
        <TodayBoxLabel positon={position}>{remainCount}개</TodayBoxLabel>
        <Flag positon={position} src="/img/mypage/flag_icon.png" width={25} height={32} alt="오늘의 박스 아이콘"></Flag>
        {remainCount !== totalCount &&
          <FlagLabel>{subscribeInfo.statusCode !== "normal" ? "-" : totalCount} 개</FlagLabel>
        }
      </OrderCountContainer>
    </OrderCountWrapper>
  );
}

export default OrderCount;