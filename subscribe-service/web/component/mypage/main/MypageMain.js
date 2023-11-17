import styled from "styled-components";
import Image from "next/image";
import { fontWeight, device } from "component/common/GlobalComponent";
import UserInfoTitle from "./MainTitle";
import SubscribeSwiper from "./SubscribeSwiper";

const MypageMainWrapper = styled.div`
`

const MypageMainContainer = styled.div`
  padding-bottom: 19px;
  margin-bottom: 20px;
  @media ${device.mobileL} {
    padding-bottom: 0px;
  margin-bottom: 0px;
  }
`



function MypageMain() {
  return (
    <MypageMainWrapper>
      <MypageMainContainer>
        <UserInfoTitle></UserInfoTitle>
        <SubscribeSwiper></SubscribeSwiper>
      </MypageMainContainer>
    </MypageMainWrapper>
  );
}

export default MypageMain;