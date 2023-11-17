import { useEffect, useState } from "react";
import styled from "styled-components";
import MypageSubscribe from "../../../component/mypage/subscribe/MypageSubscribe";
import SubscribeChange from "component/mypage/subscribe/SubscribeChange";
const SubscribeDetailsWrapper = styled.div`

`

function SubscribeDetails({ subsNo }) {

  return (
    <SubscribeDetailsWrapper>
      <SubscribeChange subsNo={subsNo}></SubscribeChange>
    </SubscribeDetailsWrapper>
  );
}

export default SubscribeDetails;


export const getServerSideProps = async (context) => {
  return { props: { subsNo: context.params.subsNo } };
};