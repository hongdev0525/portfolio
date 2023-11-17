import { device, fontWeight } from "component/common/GlobalComponent";
import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import KakaoPayButton from "component/payment/KakaoPay";
import KakaoPayMobileButton from "component/payment/KakaoPayMobile";
import CardInput from "component/payment/CardInput";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { addressState } from "state/address";
import { cloneElement, useEffect } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { paymentListState } from "state/payment";
import { ButtonGroup, GroupButton01 } from "component/subscribe/CommonComponent";
import { BrowserView, MobileView } from 'react-device-detect';


const MypagePaymentModfiyWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }
  `
const MypagePaymentModfiyContainer = styled.div`
 width: 596px;
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
 margin-bottom: 40px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    
    div{
      margin-bottom: 0px;

    }
  }
`

const PaymentMethodContainer = styled(ButtonGroup)`
  display: flex;
  width: 100%;
  margin:20px 0 ;
  div{
    width: 50%;
  }

  @media ${device.mobileL} {
    margin-top: 30px;
  }
`


const CardButton = styled(GroupButton01)`

  font-weight: ${fontWeight("regular")};
  border-right: none;
  @media ${device.mobileL} {
    height : 37px;
    font-size:12px;
  }
`
const Kakaopay = styled(KakaoPayButton)`


`

const KakaoPayMobile = styled(KakaoPayMobileButton)`
  font-weight: ${fontWeight("regular")};

`

const CardReg = styled.div`
  margin-top: 30px;
`

function MypagePaymentModfiy({ subsNo }) {
  const setPaymentListState = useSetRecoilState(paymentListState(`paymetModify${subsNo}`));
  const paymentListStateInfo = useRecoilValue(paymentListState(`paymetModify${subsNo}`));
  const updateSubscribePayment = async () => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        paymentNo: paymentListStateInfo.paymentNo,
        subsNo: subsNo
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/payment/updatesubscribepayment`,
    })
  }

  const { refetch: updateSubscribePaymentRefetch } = useQuery(`updateSubscribePayment${subsNo + paymentListStateInfo.paymentNo}`, updateSubscribePayment, {
    enabled: subsNo != null && paymentListStateInfo.paymentNo != null,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data;
      console.log('response', response);
      alert(paymentListStateInfo.paymentNo);
      if (response.status === "success") {
        setPaymentListState((oldState) => {
          return {
            ...oldState,
            paymentNo: null,
            paymentModal: false,
            paymentType: null,
            addPayment: false,
          }
        })
        location.href = `/mypage/payment/${subsNo}`;
      }

    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  const handlePaymentMethod = (paymentType, active) => {
    setPaymentListState((oldState) => {
      return {
        ...oldState,
        paymentModal: active,
        paymentType: paymentType
      }
    })
  }


  useEffect(() => {
    console.log('selectedPayment', paymentListStateInfo)
    if (paymentListStateInfo.paymentNo != null) {
      updateSubscribePaymentRefetch();
    }
  }, [paymentListStateInfo])

  return (
    <MypagePaymentModfiyWrapper>
      <MypageTitleContainer>
        <MypageTitle url={`/mypage/payment/${subsNo}`} title={"결제변경"} ></MypageTitle>
      </MypageTitleContainer>
      <MypagePaymentModfiyContainer>
        {
          (paymentListStateInfo.list?.length === 0 || paymentListStateInfo.addPayment === true) &&
          <PaymentMethodContainer>
            <CardButton active={paymentListStateInfo.paymentType === "Card" ? true : false} onClick={() => handlePaymentMethod("Card", true)}>카드등록하기</CardButton>
            <BrowserView>
              <Kakaopay
                stateKey={`paymetModify${subsNo}`}
                active={paymentListStateInfo.paymentType === "Kakao" ? true : false}
                redirectUrl={`/mypage/payment/modify?subsNo=${subsNo}&paymentNo=${paymentListStateInfo.paymentNo}`}
                failRedirectUrl={"/mypage"}>
              </Kakaopay>
            </BrowserView>
            <MobileView>
              <KakaoPayMobile
                stateKey={`paymetModify${subsNo}`}
                active={paymentListStateInfo.paymentType === "Kakao" ? true : false}
                redirectUrl={`/mypage/payment/modify?subsNo=${subsNo}&paymentNo=${paymentListStateInfo.paymentNo}`}
                failRedirectUrl={"/mypage"}>
              </KakaoPayMobile>
            </MobileView>
          </PaymentMethodContainer>
        }
        {
          paymentListStateInfo.paymentModal === true &&
          <CardReg>
            <CardInput stateKey={`paymetModify${subsNo}`}></CardInput>
          </CardReg>
        }
      </MypagePaymentModfiyContainer>
    </MypagePaymentModfiyWrapper>
  );
}

export default MypagePaymentModfiy;