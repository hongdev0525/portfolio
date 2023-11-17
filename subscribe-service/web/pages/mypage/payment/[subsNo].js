import styled from "styled-components";
import { Container } from "../../../component/common/GlobalComponent";
import MypagePayment from "component/mypage/payment/MypagePayment";

const PaymentManagementWrapper = styled(Container)`
    margin: 85px auto;
`

function PaymentManagement({subsNo}) {

  return (
    <PaymentManagementWrapper>
      <MypagePayment subsNo={subsNo}></MypagePayment>
    </PaymentManagementWrapper>
  );
}

export default PaymentManagement;

export const getServerSideProps = async (context) => {
  return { props: { subsNo: context.params.subsNo } };
};