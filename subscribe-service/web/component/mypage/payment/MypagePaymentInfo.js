import styled from "styled-components";
import { fontWeight, device } from "component/common/GlobalComponent";
import Router from "next/router";

const MypagePaymentInfoWrapper = styled.div`
  margin-bottom: 20px;
  @media ${device.mobileL} {
  width: 100%;
  }
`
const MypagePaymentInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  width: 596px;
  height: 100%;
  border:1px solid #DBDBDB;
  border-radius: 10px;
  padding: 34px 30px;
  @media ${device.mobileL} {
    width: 100%;
    height: auto;
    padding: 30px;
}
`

const PaymentInfoContainer = styled.div`
 h2{
    font-size:18px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 14px;
    color:#DC5F00;
  }
  p{
    font-size: 18px;
    font-weight: ${fontWeight('regular')};
    margin-bottom: 4px;
    line-height: 20px;
  }
  @media ${device.mobileL} {
    h2{
    font-size:16px;
    margin-bottom: 10px;
  }
  p{
    font-size: 14px;
    font-weight: ${fontWeight('regular')};
    margin-bottom: 2px;
  }
  }
`

const PaymentInfoButtonGroup = styled.div`
  width: 174px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  @media ${device.mobileL} {
    width: fit-content;

}
`
const PaymentInfoButton = styled.button`
  width: 79px;
  height: 39px;
  border: 1px solid #DBDBDB;
  border-radius: 5px;
  color:#232323;
  font-size: 16px;
  font-weight: ${fontWeight("semiBold")};
  background-color: #fefefe;
  cursor: pointer;
  @media ${device.mobileL} {
    width: fit-content;
    height: 25px;
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
    padding:4px 10px;
  }
  
`


function MypagePaymentInfo({ paymentInfo, subsNo }) {


  return (
    <MypagePaymentInfoWrapper>
      <MypagePaymentInfoContainer>
        <PaymentInfoContainer>
          <h2> {paymentInfo.PaymentName}</h2>
          <p> {paymentInfo.CardName}</p>
        </PaymentInfoContainer>
        <PaymentInfoButtonGroup>
          <PaymentInfoButton onClick={() => { Router.push(`/mypage/payment/modify?subsNo=${subsNo}&paymentNo=${paymentInfo.PaymentNo}`) }}>변경</PaymentInfoButton>
        </PaymentInfoButtonGroup>
      </MypagePaymentInfoContainer>
    </MypagePaymentInfoWrapper>
  );
}

export default MypagePaymentInfo;