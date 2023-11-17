import styled from "styled-components";
import MypagePaymentModfiy from "component/mypage/payment/MypagePaymentModfiy";
const PaymentModifyManagementWrapper = styled.div`
`

function PaymentModifyManagement({ subsNo, paymentNo }) {
  return (
    <PaymentModifyManagementWrapper>
      <MypagePaymentModfiy subsNo={subsNo} paymentNo={paymentNo}></MypagePaymentModfiy>
    </PaymentModifyManagementWrapper>
  );
}

export default PaymentModifyManagement;


export const getServerSideProps = async (context) => {
  const { query } = context;
  const { subsNo, paymentNo } = query;

  if (!subsNo || !paymentNo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      subsNo: subsNo,
      paymentNo: paymentNo,
    },
  };
};