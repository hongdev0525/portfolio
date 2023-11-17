import styled from "styled-components";
import SubscribePayemntDetails from "component/mypage/payment/SubscribePaymentDetails";
const SubscribePaymentDetailsMainWrapper = styled.div``


function SubscribePaymentDetailsMain({ historyNo }) {
  return (
    <SubscribePaymentDetailsMainWrapper>
      <SubscribePayemntDetails historyNo={historyNo}></SubscribePayemntDetails>
    </SubscribePaymentDetailsMainWrapper>
  );
}

export default SubscribePaymentDetailsMain;


export const getServerSideProps = async (context) => {
  return { props: { historyNo: context.params.historyNo } };
};