import styled from "styled-components";
import PaymentHistory from "component/mypage/payment/PaymentHistory";
const PaymentHistoryManagementWrapper = styled.div`
`

function PaymentHistoryManagement() {
  return (
    <PaymentHistoryManagementWrapper>
      <PaymentHistory></PaymentHistory>
    </PaymentHistoryManagementWrapper>
  );
}

export default PaymentHistoryManagement;

