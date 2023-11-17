import styled from "styled-components";
import SubscribeInfoList from "component/mypage/subscribe/SubscribeInfoList";

const SubscribeListMainWrapper = styled.div``

function SubscribeListMain() {
  return (
    <SubscribeListMainWrapper>
      <SubscribeInfoList></SubscribeInfoList>
    </SubscribeListMainWrapper>
  );
}

export default SubscribeListMain;