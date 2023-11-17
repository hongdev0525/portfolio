import { useEffect, useState } from "react";
import styled from "styled-components";
import CancelSubscribe from "component/mypage/subscribe/CancelSubscribe";
const SubscribeCancelMainWrapper = styled.div`

`

function SubscribeCancelMain({ subsNo }) {

  return (
    <SubscribeCancelMainWrapper>
      <CancelSubscribe subsNo={subsNo}></CancelSubscribe>
    </SubscribeCancelMainWrapper>
  );
}

export default SubscribeCancelMain;


export const getServerSideProps = async (context) => {
  return { props: { subsNo: context.params.subsNo } };
};