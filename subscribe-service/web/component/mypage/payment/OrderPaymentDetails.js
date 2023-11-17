import styled from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import { customAxios } from "public/js/customAxios";
import { useQuery } from "react-query";
import MypageTitle from "../MypageTitle";
import { useState } from "react";
import { common } from "public/js/common";


const OrderPayemntDetailsWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px ;
  }
`
const OrderPayemntDetailsContainer = styled.div`
 width: 800px;
  border-bottom : 8px solid #F1F1F5;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
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

const DetailsInfoBody = styled.div`
  padding: 24px 0;
  h2{
    font-size: 20px;
    font-weight: ${fontWeight("semiBold")};
    margin-bottom: 10px;
  }
  @media ${device.mobileL} {
    font-size: 18px;
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


function OrderPayemntDetails({ orderNo }) {
  const [payemntHistoryOfOrder, setPayemntHistoryOfOrder] = useState(null);
  const [orderInfo, getOrderInfo] = useState(null);

  const getPaymentHistoryInfoOfOrder = async () => {
    return await customAxios({
      method: "GET",
      params: {
        orderNo: orderNo
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/historyinfooforder`,
    })
  }

  useQuery('getPaymentHistoryInfoOfOrder', getPaymentHistoryInfoOfOrder, {
    onSuccess: (res) => {
      const response = res.data.data;
      console.log('response', response)
      setPayemntHistoryOfOrder(response);
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })

  const productList = (products) => {
    if (products) {
      const tmp = [];
      products.replaceAll("-", " ").split(",").map(product => {
        tmp.push(product + "개");
      })
      return tmp.join(",");
    }
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



  const getOrderDetailsInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        orderNo: orderNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/order/initialproductinfo`,
    })
  }


  const { refetch: getOrderDetailsInfoRefetch } = useQuery(`getOrderDetailsInfo${orderNo}`, getOrderDetailsInfo, {
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data.data;
      console.log('response222', response)
      if (res.status === 200) {
        getOrderInfo(response)
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  });




  return (
    <OrderPayemntDetailsWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage/payment/history`} title={"결제상세내역"} ></MypageTitle>
      </MypageTitleContainer>
      <OrderPayemntDetailsContainer>
        {payemntHistoryOfOrder &&
          <>
            <HeaderInfo>
              {payemntHistoryOfOrder.PaymentStatus === "paid" ? <Colored>기존주문</Colored> : <span>적립금환불</span>}
            </HeaderInfo>
            <DetailsInfoBody>
              <h2>{payemntHistoryOfOrder.EventType}</h2>
              <DetailsBody>
                <p>상품 : {productList(payemntHistoryOfOrder.Product)}</p> <span>|</span>
                {payemntHistoryOfOrder.PaymentStatus === "paid" &&
                  <>
                    <p>결제금액 : {common.numberCommaFormat(payemntHistoryOfOrder.Price)}원</p>
                    <span>|</span>
                    <p>적립금사용 : {common.numberCommaFormat(payemntHistoryOfOrder.Amount)}원</p>
                  </>
                }
                {payemntHistoryOfOrder.PaymentStatus === "refund" && <p>환불적립금 : {common.numberCommaFormat(payemntHistoryOfOrder.Amount)}원</p>}
              </DetailsBody>
              <DetailBodyBlock>
                <p>결제일시 : {formattingDate(payemntHistoryOfOrder.RegDate)}</p>
                {payemntHistoryOfOrder.ImpUid &&
                  <p>주문번호 : {payemntHistoryOfOrder.ImpUid}</p>
                }
              </DetailBodyBlock>
            </DetailsInfoBody>
          </>
        }
      </OrderPayemntDetailsContainer>
    </OrderPayemntDetailsWrapper>
  );
}

export default OrderPayemntDetails;