import { useEffect } from 'react';
import styled from 'styled-components'
import { Input, InputLabel, InputGroup, Button, Title } from '../common/GlobalComponent';
const TemporaryPaymentButtonWrapper = styled.div`
`
function TemporaryPaymentButton() {

  const requestPay = () => {
    IMP.init("imp81502857");

    IMP.request_pay({ // param
      pg: "nice",
      pay_method: "card",
      merchant_uid: `TEST_ORD_${new Date()}`,
      name: "노르웨이 회전 의자",
      amount: 10000,
      buyer_email: "gildong@gmail.com",
      buyer_name: "홍길동",
      buyer_tel: "010-4242-4242",
      buyer_addr: "서울특별시 강남구 신사동",
      buyer_postcode: "01181"
    }, rsp => {
      console.log(rsp);
      if (rsp.success) {
        console.log("rsp", rsp)

      } else {
        console.log("Filed to pay")
      }
    });
  }

  

  return (
    <TemporaryPaymentButtonWrapper>
      <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
      <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>
      <Button type="button" onClick={requestPay}>
        결제하기(단건구매)
      </Button>
    </TemporaryPaymentButtonWrapper>
  );
}

export default TemporaryPaymentButton;