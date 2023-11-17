import styled from "styled-components";
import AmountChange from "component/mypage/order/AmountChange";
const AmountChangeMainWrapper = styled.div`

`


function AmountChangeMain({ orderNo }) {
  return (
    <AmountChangeMainWrapper>
      <AmountChange orderNo={orderNo}></AmountChange>
    </AmountChangeMainWrapper>
  );
}

export default AmountChangeMain;


export const getServerSideProps = async (context) => {
  return { props: { orderNo: context.params.orderNo } };
};