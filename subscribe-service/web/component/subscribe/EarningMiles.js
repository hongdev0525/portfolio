import styled from "styled-components";
import { Title } from "./CommonComponent";
import { device } from "../common/GlobalComponent";
import Coupoon from "component/miles/Coupon";
import MilesReg from "component/miles/MilesReg";

const EarningMilesWrapper = styled.div`
  margin-bottom: 50px;
  @media ${device.mobileL} {
    margin-bottom: 60px;
  }
`
const EarningMilesContainer = styled.div`
  margin-top: 20px;
  @media ${device.mobileL} {
    margin-top: 30px;
  }
`


function EarningMiles({ stateKey, subscribePrice = null }) {

  return (
    <EarningMilesWrapper>
      <Title>할인적용</Title>
      <EarningMilesContainer>
        <Coupoon stateKey={stateKey}></Coupoon>
        <MilesReg stateKey={stateKey} subscribePrice={subscribePrice}></MilesReg>
      </EarningMilesContainer>
    </EarningMilesWrapper >
  );
}

export default EarningMiles;