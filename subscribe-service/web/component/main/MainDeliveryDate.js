import styled from "styled-components";
import { fontWeight } from "../common/CommonComponent";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { device } from "component/common/GlobalComponent";
const DeliveryDateWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 202px 0;
  @media ${device.mobileL} {
    padding: 180px 24px;
  }
`


const Title = styled.h2`
  font-size: 72px;
  line-height: 105px;
  font-weight: ${fontWeight("bold")};
  margin-bottom: 60px;
  @media ${device.mobileL} {
    font-size: 25px;
    line-height: 28px;
    font-weight: ${fontWeight("semiBold")};
    margin-bottom: 14px;
  }

  `
const Subtitle = styled.p`
  font-size: 56px;
  line-height: 78px;
  font-weight: ${fontWeight("semiBold")};
  margin-bottom: 84px;
  @media ${device.mobileL} {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 24px;
  }
`

const Notice = styled.div`
  font-size: 40px;
  line-height: 31px;
  font-weight: ${fontWeight("medium")};
  & > span{
    display: block;
    font-size : 36px;
    font-weight: ${fontWeight("medium")};
    line-height: 50px;
    color:#a9a9a8;
    text-align: center;
    margin-top: 16px;
  }

  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 25px;
    font-weight: ${fontWeight("medium")};
    & img{
      width: 13px;
      height: 11px;
      margin-right: 5px;
    }
    & > span{
      display: block;
      font-size : 12px;
      font-weight: ${fontWeight("medium")};
      line-height: 16.5px;
      margin-top: 2px;
    }
  }
`

const Highlight = styled.span`
  font-weight: ${fontWeight("bold")};
  background-image: url('/img/main/web/highlight.png');
  @media ${device.mobileL} {
    background-size:cover;
  }
`

const Divider = styled.div`
  width: 4px;
  height: 120px;
  background-color: #707070;
  margin: 54px 0;
  @media ${device.mobileL} {
    width: 1px;
    height: 60px;
    margin: 16px 0;
  }
`

const DeliveryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 796px;
  & > span{
    font-size: 64px;
    font-weight: ${fontWeight("regular")};
    line-height: 112px;
    padding-top: 56px;
  }
  @media ${device.mobileL} {
    width: 306px;
    & > span{
      font-size: 25px;
      line-height: 28px;
      padding-top: 33px;
    }
  }
`


const CalendarBox = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 56px;
  width: 140px;
  height: 180px;
  font-size: 72px;
  font-weight: ${fontWeight("bold")};
  color:#DC5F00;
  line-height: 112px;
  background-image: url('/img/main/web/dateCalendar.png');
  background-size: contain;
  background-repeat: no-repeat;
  @media ${device.mobileL} {
      width: 60px;
      height: 73px;
      font-size: 25px;
      line-height: 28px;
      padding-top: 33px;
  }
`




function MainDeliveryDate() {
  const [month, setMonth] = useState([]);
  const [day, setDay] = useState([]);



  const checkHoliday = async () => {
    return await customAxios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/main/holiday`,
    })

  }


  useQuery("checkHoliday", checkHoliday, {
    onSuccess: (res) => {
      const response = res.data.data
      console.log('response :>> ', response);
      setMonth(response.split("-")[1].toString().split(''));
      setDay(response.split("-")[2].toString().split(''));
    },
    onError: (error) => {
      console.error(error)
    }
  })


  return (
    <DeliveryDateWrapper>
      <Subtitle>오늘 구독 신청하면</Subtitle>
      <DeliveryInfo>
        <CalendarBox>{month[0]}</CalendarBox>
        <CalendarBox>{month[1]}</CalendarBox>
        <span>월</span>
        <CalendarBox>{day[0]}</CalendarBox>
        <CalendarBox>{day[1]}</CalendarBox>
        <span>일</span>
      </DeliveryInfo>
      <Divider></Divider>
      <Title>현관앞으로 도착해요!</Title>
      <Notice>
        <p><Image quality={100} src="/img/main/web/deliverydateCheck.png" width={44} height={36} alt="체크아이콘"></Image><u>당일 한정 수량</u>으로 <Highlight>2일전 4시</Highlight>에 주문이 마감돼요</p>
        <span>*금요일,주말신청은 수요일에 받아볼 수 있어요</span>
      </Notice>
    </DeliveryDateWrapper>
  );
}

export default MainDeliveryDate;