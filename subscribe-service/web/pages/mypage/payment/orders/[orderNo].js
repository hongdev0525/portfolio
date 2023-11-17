import styled from "styled-components";
import OrderPayemntDetails from "component/mypage/payment/OrderPaymentDetails";
const OrderPaymentDetailsMainWrapper = styled.div``


function OrderPaymentDetailsMain({ orderNo }) {
  return (
    <OrderPaymentDetailsMainWrapper>
      <OrderPayemntDetails orderNo={orderNo}></OrderPayemntDetails>
    </OrderPaymentDetailsMainWrapper>
  );
}

export default OrderPaymentDetailsMain;


export const getServerSideProps = async (context) => {
  return { props: { orderNo: context.params.orderNo } };
};