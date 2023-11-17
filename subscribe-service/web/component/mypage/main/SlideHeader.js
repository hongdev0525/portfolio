import { fontWeight, device } from "component/common/GlobalComponent";
import styled, { css } from "styled-components";
import Router from "next/router";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useEffect, useState } from "react";


const SlideHeaderWrapper = styled.div``
const SlideHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media ${device.mobileL} {
    align-items: flex-start;
    flex-direction: column;
  }
`

const AddressName = styled.div`

@media ${device.mobileL} {
    font-size: 18px;
    line-height: 29px;
    font-weight: ${fontWeight("semiBold")};
  }
`


const Notice = styled.div`
  margin: 20px 0;
  >p{
    font-size: 14px;
    line-height: 16px;
    font-weight: ${fontWeight('regular')};
    color:#999999;
  }
  @media ${device.mobileL} {
    margin: 12px 0 24px;
    u{
      display: none;
    }
  }
`

const NoticeText = styled.div`
  font-size: 18px;
  line-height: 28px;
  font-weight: ${fontWeight("regular")};
  margin-bottom: 5px;
  span{
    color:#DC5F00;
    font-weight: ${fontWeight("semiBold")};
  }
`

const SubscribeButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 354px;
  @media ${device.mobileL} {
    width: 100%;
    margin-bottom: 16px;
    
  }
`
const SubscribeButtonGroupFlexEnd = styled(SubscribeButtonGroup)`
  justify-content: flex-end;
  button{
    min-width: 116px;
    width: fit-content;
    height: 43px;
  }
`
const SubscribeButton = styled.button`
  width: fit-content;
  height: 43px;
  background-color: #fefefe;
  color:#767676;
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  border: 1px solid #DBDBDB;
  border-radius: 30px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
  padding: 12px 16px;
  cursor: pointer;
  @media ${device.mobileL} {
    font-size: 14px;
    width: fit-content;
    height: 39px;
    margin-bottom: 14px;
  }
`

const SubscribeTitleContainer = styled.div`
  display: flex;
  align-items: center;
`
const Status = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fefefe;
  border-radius: 11px;
  padding: 2px 9px;
  width: fit-content;
  margin-left: 6px;
  ${props => {
    return props.status === "normal" ?
      css`
      border:  1px solid #DC5F00;
      color: #DC5F00;
    `
      :
      css`
      border:  1px solid #DBDBDB;
      color: #DBDBDB;
      `
  }}
`
function SlideHeader({ subsNo, statusCode, regDate }) {
  const [addressInfo, setAddressInfo] = useState(null);

  const getAddressInfoWithSubsNo = async () => {
    return await customAxios({
      method: "get",
      withCredentials: true,
      params: {
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/address/infowithsubsno`,
    })
  }

  useQuery(['getAddressInfoWithSubsNo', subsNo], getAddressInfoWithSubsNo, {
    enabled: subsNo != null,
    onSuccess: (res) => {
      if (res.status === 200) {
        setAddressInfo(res.data.data[0]);
      }
    },
    onError: (error) => {
      console.error(error);
    }
  })


  function calculateMonthDiff(date) {
    const today = new Date();
    const diffInMonths = (today.getFullYear() - date.getFullYear()) * 12 +
      (today.getMonth() - date.getMonth()) + 1;
    return diffInMonths;
  }

  useEffect(() => {
    console.log('addressInfo', addressInfo)
  }, [addressInfo])


  useEffect(() => {
    console.log('firstadsfadsfads')
  }, [])
  return (
    <SlideHeaderWrapper>
      {statusCode &&
        <SubscribeTitleContainer>
          {addressInfo &&
            <AddressName>{addressInfo.AddressLabel}</AddressName>
          }
          <Status status={statusCode}> {statusCode === "normal" ? "구독중" : "구독해지"} </Status>
        </SubscribeTitleContainer>
      }
      <SlideHeaderContainer>
        <Notice>
          <NoticeText>식사 준비 시간을  <u>하루 2시간씩</u> 아낄 수 있어요!</NoticeText>
          <p>현키와 {calculateMonthDiff(new Date(regDate)) ? calculateMonthDiff(new Date(regDate)) : 0}개월 동안 함께 식사했어요</p>
        </Notice>
        {subsNo && statusCode === "normal" &&
          <SubscribeButtonGroup>
            <SubscribeButton onClick={() => { Router.push(`/mypage/subscribe/${subsNo}`) }}>전체 구독 변경</SubscribeButton>
            <SubscribeButton onClick={() => { Router.push(`/mypage/address/${subsNo}`) }}>주소 변경</SubscribeButton>
            <SubscribeButton onClick={() => { Router.push(`/mypage/payment/${subsNo}`) }}>결제수단 변경</SubscribeButton>
          </SubscribeButtonGroup>
        }
        {
          !subsNo &&
          <SubscribeButtonGroupFlexEnd>
            <SubscribeButton onClick={() => { Router.push(`/subscribe`) }}>구독하기</SubscribeButton>
          </SubscribeButtonGroupFlexEnd>
        }
        {statusCode === "cancel" &&
          <SubscribeButtonGroupFlexEnd>
            <SubscribeButton onClick={() => { Router.push(`/subscribe`) }}>다시 배송받기</SubscribeButton>
          </SubscribeButtonGroupFlexEnd>
        }
      </SlideHeaderContainer>
    </SlideHeaderWrapper>
  );
}

export default SlideHeader;