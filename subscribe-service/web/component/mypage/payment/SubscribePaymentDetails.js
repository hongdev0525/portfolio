import styled from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { customAxios } from "public/js/customAxios";
import { useQuery } from "react-query";
import MypageTitle from "../MypageTitle";
import { useEffect, useState } from "react";
import { common } from "public/js/common";
import PaymentInfo from "component/payment/PaymentInfo/PaymentInfo";


const SubscribePayemntDetailsWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px;
  }
`
const SubscribePayemntDetailsContainer = styled.div`
 width: 800px;
  margin-bottom: 40px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    margin-bottom: 0px;
    div{
      margin-bottom: 0px;
    }
  }
`

const HeaderInfo = styled.div`
  font-size: 16px;
  color: #767676;
  font-weight: ${fontWeight("regular")};
  border-bottom: 1px solid #F3F3F7;
  padding-bottom: 12px;
   span{
    font-size: 16px;
    color: #767676;
    font-weight: ${fontWeight("regular")};
  }
`
const Colored = styled.span`
color: #DC5F00 !important;
`


const MypageTitleContainer = styled.div`
  width: 800px;
 margin-bottom: 5px;
 div{
 border-bottom: none;
  }
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px 60px;
    div{
      margin-bottom: 0px;

    }
  }
`
const DetailsInfoBody = styled.div`
  padding: 24px 0;
  border-bottom : 8px solid #F1F1F5;
  h2{
    font-size: 20px;
    font-weight: ${fontWeight("semiBold")};
    margin-bottom: 10px;
  }
  @media ${device.mobileL} {
    h2{
      font-size: 18px;
    }
  }
`

const DetailsBody = styled.div`
  display: flex;
  margin-bottom: 14px;
  p, span{
    display: block;
  font-size: 16px;
  color: #767676;
  font-weight: ${fontWeight("regular")};
  }
  span{
    margin: 0 10px;
  }
  @media ${device.mobileL} {
    flex-direction: column;
    span{
      display: none;
    }
    p{
      font-size: 14px;
      line-height: 18px;
    }
  }
`
const DetailBodyBlock = styled(DetailsBody)`
  display: flex;
  flex-direction: column;
  p{
    
    margin-bottom: 4px;
  }
  @media ${device.mobileL} {
    
    p{
      font-size: 14px;
      line-height: 18px;

    }
  }
`

const PaymentInfoContainer = styled.div`
    width: 596px;
  @media ${device.mobileL} {
      width: 100%;
      padding: 0 24px;
  }
`

function SubscribePayemntDetails({ historyNo }) {

  const [payemntHistoryOfSubscribe, setPayemntHistoryOfSubscribe] = useState(null);
  const [subscribeInfo, setSubscribeInfo] = useState(null);
  const getPaymentHistoryinfoOfSubscribe = async () => {
    return await customAxios({
      method: "GET",
      params: {
        historyNo: historyNo
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/historyinfoofsubscribe`,
    })
  }

  useQuery(`getPaymentHistoryinfoOfSubscribe${historyNo}`, getPaymentHistoryinfoOfSubscribe, {
    onSuccess: (res) => {
      const response = res.data.data;
      setPayemntHistoryOfSubscribe(response[0]);
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })



  const getSubscribeInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: payemntHistoryOfSubscribe.SubsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/info`,
    })
  }


  const { refetch: getSubscribeInfoRefetch } = useQuery(`getSubscribeInfo${historyNo}`, getSubscribeInfo, {
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data.data;
      if (res.status === 200) {
        setSubscribeInfo({
          ...response,
          milesAmount: payemntHistoryOfSubscribe.Amount,
          defaultDiscountPrice: payemntHistoryOfSubscribe.Price,
          totalPrice: payemntHistoryOfSubscribe.Price
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })



  const dowList = (dows) => {
    const tmp = [];
    dows.split(",").map(dow => {
      tmp.push(dow + "요일");
    })
    return tmp.join(",");
  }

  const formattingDate = (date) => {
    const dateInfo = new Date(date);
    const year = dateInfo.getFullYear();
    const month = dateInfo.getMonth() + 1;
    const day = dateInfo.getDate();
    const hour = dateInfo.getHours();
    const minutes = dateInfo.getMinutes();
    return `${year}년 ${month < 10 ? "0" + month : month}월 ${day < 10 ? "0" + day : day}일 ${hour}:${minutes}`
  }


  useEffect(() => {
    if (payemntHistoryOfSubscribe) {
      console.log('payemntHistoryOfSubscribe', payemntHistoryOfSubscribe)
      getSubscribeInfoRefetch();
    }
  }, [payemntHistoryOfSubscribe])


  return (
    <SubscribePayemntDetailsWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage/payment/history`} title={"결제상세내역"} ></MypageTitle>
      </MypageTitleContainer>
      {payemntHistoryOfSubscribe &&
        <SubscribePayemntDetailsContainer>
          <HeaderInfo>
            {payemntHistoryOfSubscribe.PaymentStatus === "paid" ? <Colored>기존주문</Colored> : <span>적립금환불</span>}
          </HeaderInfo>
          <DetailsInfoBody>
            <h2>{payemntHistoryOfSubscribe.PaymentType}</h2>
            <DetailsBody>
              <p>{payemntHistoryOfSubscribe.SubsType === "experience" ? "배송" : "구독"}요일 : {dowList(payemntHistoryOfSubscribe.Dows)}</p> <span>|</span>
              <p>총 상품수량 : {payemntHistoryOfSubscribe.ProductAmount}개</p> <span>|</span>
              {payemntHistoryOfSubscribe.PaymentStatus === "paid" &&
                <>
                  <p>결제금액 : {common.numberCommaFormat(payemntHistoryOfSubscribe.Price)}원</p>
                  <span>|</span>
                  <p>적립금사용 : {common.numberCommaFormat(payemntHistoryOfSubscribe.Amount)}원</p>
                </>
              }
              {payemntHistoryOfSubscribe.PaymentStatus === "refund" &&
                <>
                  <p>환불금액 : {common.numberCommaFormat(payemntHistoryOfSubscribe.Price)}원</p>
                  <span>|</span>
                  <p>적립금환불 : {common.numberCommaFormat(payemntHistoryOfSubscribe.Amount)}원</p>
                </>

              }
            </DetailsBody>
            <DetailBodyBlock>
              <p>결제일시 : {formattingDate(payemntHistoryOfSubscribe.PaymentDate)}</p>
              <p>주문번호 : {payemntHistoryOfSubscribe.ImpUid}</p>
            </DetailBodyBlock>
          </DetailsInfoBody>
        </SubscribePayemntDetailsContainer>
      }
      {subscribeInfo != null &&
        <PaymentInfoContainer>
          <PaymentInfo paymentDetails={subscribeInfo} title={false} experience={payemntHistoryOfSubscribe.SubsType === "experience" ? true : false}></PaymentInfo>
        </PaymentInfoContainer>
      }
    </SubscribePayemntDetailsWrapper>
  );
}

export default SubscribePayemntDetails;