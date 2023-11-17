import styled from "styled-components";
import { Container ,PageTitle } from "../../../component/common/GlobalComponent";
import SubscribeInfoList from "../../../component/mypage/subscribe/SubscribeInfoList";
const SubscribeManagementWrapper = styled(Container)`
    margin: 85px auto;
  `


function SubscribeManagement() {
  return (
    <SubscribeManagementWrapper>
      <PageTitle>구독관리</PageTitle>
      <SubscribeInfoList></SubscribeInfoList>
    </SubscribeManagementWrapper>
  );
}

export default SubscribeManagement;