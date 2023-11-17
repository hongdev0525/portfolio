import styled from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import { customAxios } from "public/js/customAxios";
import { useQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { paymentHistoryState } from "state/payment";
import { useEffect } from "react";
import MypageTitle from "../MypageTitle";
import { common } from "public/js/common";
import Router from "next/router";

const PaymentHistoryWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px ;
  }
`

const PaymentHistoryContainer = styled.div`
 width: 800px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`

const PaymentHistoryList = styled.ul`
  
`
const PaymentHistoryInfo = styled.li`
  border-bottom : 8px solid #F1F1F5;
  margin-bottom: 22px;
`
const PaymentHistoryInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #767676;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F3F7;
  font-weight: ${fontWeight("regular")};

  span{
      font-size: 16px;
    color: #767676;
  font-weight: ${fontWeight("regular")};

  }
`
const HeaderInfo = styled.div`
  font-size: 16px;
  color: #767676;
  font-weight: ${fontWeight("regular")};
   span{
    font-size: 16px;
    color: #767676;
    font-weight: ${fontWeight("regular")};
  }
 
`
const Colored = styled.span`
color: #DC5F00 !important;
`

const DetailsButton = styled.button`
  width: fit-content;
  height: 25px;
  border: 1px solid #DBDBDB;
  border-radius:  13px;
  background-color: #fefefe;
  padding: 5px 10px;
  cursor: pointer;
  @media ${device.mobileL} {
    font-size: 12px;
    font-weight: ${fontWeight("regular")};
  }
`


const PaymentHistoryInfoBody = styled.div`
  padding: 24px 0 33px;
  h2{
    font-size: 20px;
    font-weight: ${fontWeight("semiBold")};
    margin-bottom: 10px;
  }
  @media ${device.mobileL} {
  padding: 26px 0 37px;

    h2{
      font-size: 18px;
      font-weight: ${fontWeight("semiBold")};
    }
  }
`

const HistoryInfoBody = styled.div`
  display: flex;
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
    display: flex;
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

function PaymentHistory() {

  const paymentHistoryStateInfo = useRecoilValue(paymentHistoryState);
  const setPaymentHistoryState = useSetRecoilState(paymentHistoryState);

  const getPaymentHistoryListOfOrder = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/historyoforder`,
    })
  }

  useQuery('getPaymentHistoryListOfOrder', getPaymentHistoryListOfOrder, {
    onSuccess: (res) => {
      console.log('res', res)
      const response = res.data.data;
      console.log('response', response);
      setPaymentHistoryState((oldState) => {
        return {
          ...oldState,
          orderList: response
        }
      });

    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })
  const getPaymentHistoryListOfSubscribe = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/historylistofsubscribe`,
    })
  }

  useQuery('getPaymentHistoryListOfSubscribe', getPaymentHistoryListOfSubscribe, {
    onSuccess: (res) => {
      console.log('res', res)
      const response = res.data.data;
      console.log('response', response);
      setPaymentHistoryState((oldState) => {
        return {
          ...oldState,
          subscribeList: response
        }
      });

    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })

  const dowList = (dows) => {
    const tmp = [];
    dows.split(",").map(dow => {
      tmp.push(dow + "요일");
    })
    return tmp.join(",");
  }

  const productList = (products) => {
    if (products) {
      const tmp = [];
      products.replaceAll("-", " ").split(",").map(product => {
        tmp.push(product + "개");
      })
      return tmp.join(",");
    }
  }

  return (
    <PaymentHistoryWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage`} title={"결제/취소내역"} ></MypageTitle>
      </MypageTitleContainer>
      <PaymentHistoryContainer>
        <PaymentHistoryList>
          {paymentHistoryStateInfo && paymentHistoryStateInfo.subscribeList &&
            paymentHistoryStateInfo.subscribeList.map((paymentHistory) => {
              console.log('paymentHistory', paymentHistory)
              return (<PaymentHistoryInfo key={`${paymentHistory.HistoryNo}`}>
                <PaymentHistoryInfoHeader>
                  <HeaderInfo>
                    {common.DateFormatting(paymentHistory.PaymentDate).split(" ")[0]}({common.getDayOfWeek(paymentHistory.PaymentDate)})  &middot;  {paymentHistory.PaymentStatus === "paid" ? <Colored>기존주문</Colored> : <span>환불</span>}
                  </HeaderInfo>
                  <DetailsButton onClick={() => { Router.push(`/mypage/payment/subscribe/${paymentHistory.HistoryNo}`) }}>
                    결제상세
                  </DetailsButton>
                </PaymentHistoryInfoHeader>
                <PaymentHistoryInfoBody>
                  <h2>{paymentHistory.PaymentType}</h2>
                  <HistoryInfoBody>
                    <p>구독요일 : {dowList(paymentHistory.Dows)}</p> <span>|</span>
                    <p>총 상품수량 : {paymentHistory.ProductAmount}개</p> <span>|</span>
                    {paymentHistory.PaymentStatus === "paid" &&
                      <>
                        <p>결제금액 : {common.numberCommaFormat(paymentHistory.Price)}원</p>
                        <span>|</span>
                        <p>적립금사용 : {common.numberCommaFormat(paymentHistory.Amount ? paymentHistory.Amount : 0)}원</p>
                      </>
                    }
                    {paymentHistory.PaymentStatus === "refund" &&
                      <>
                        <p>환불금액 : {common.numberCommaFormat(paymentHistory.Price)}원</p>
                        <span>|</span>
                        <p>적립금환불 : {common.numberCommaFormat(paymentHistory.Amount ? paymentHistory.Amount : 0)}원</p>
                      </>

                    }
                  </HistoryInfoBody>
                </PaymentHistoryInfoBody>
              </PaymentHistoryInfo>)
            })
          }
          {paymentHistoryStateInfo && paymentHistoryStateInfo.orderList &&
            paymentHistoryStateInfo.orderList.map((orderList) => {

              return (<PaymentHistoryInfo key={orderList.OrderNo}>
                <PaymentHistoryInfoHeader>
                  <HeaderInfo>
                    {common.DateFormatting(orderList.RegDate).split(" ")[0]}({common.getDayOfWeek(orderList.PaymentDate)}) ꞏ {orderList.PaymentStatus === "paid" ? <Colored>기존주문</Colored> : <span>적립금환불</span>}
                  </HeaderInfo>
                  <DetailsButton onClick={() => { Router.push(`/mypage/payment/orders/${orderList.OrderNo}`) }}>
                    결제상세
                  </DetailsButton>
                </PaymentHistoryInfoHeader>
                <PaymentHistoryInfoBody>
                  <h2>{orderList.EventType}</h2>
                  <HistoryInfoBody>
                    <p>상품 : {productList(orderList.Product)}</p> <span>|</span>
                    {orderList.PaymentStatus === "paid" &&
                      <>
                        <p>결제금액 : {common.numberCommaFormat(orderList.Price)}원</p>
                        <span>|</span>
                        <p>적립금사용 : {common.numberCommaFormat(orderList.Amount ? orderList.Amount : 0)}원</p>
                      </>
                    }
                    {orderList.PaymentStatus === "refund" && <p>환불적립금 : {common.numberCommaFormat(orderList.Amount)}원</p>}
                  </HistoryInfoBody>
                </PaymentHistoryInfoBody>
              </PaymentHistoryInfo>)
            })
          }
        </PaymentHistoryList>

      </PaymentHistoryContainer>

    </PaymentHistoryWrapper>
  );
}

export default PaymentHistory;