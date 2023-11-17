import styled from "styled-components";
import MypageNavigation from "./MypageNavigation";
import { Container, device } from "../common/GlobalComponent";
import MypageMain from "./main/MypageMain";
import { pauseModalState } from "state/mypage";
import PauseModal from "./main/PauseModal";
import { useRecoilValue } from "recoil";
import { withdrawState } from "state/user";
import WithdrawModal from "./user/WithdrawModal";
import { useEffect } from "react";
const MypageWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const MypageContainer = styled(Container)`
  width: 800px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
  }

`


function Mypage() {
  const pauseModalStateInfo = useRecoilValue(pauseModalState);

  return (
    <MypageWrapper>
      <MypageContainer>
        <MypageMain></MypageMain>
        <MypageNavigation></MypageNavigation>
      </MypageContainer>
      {
        pauseModalStateInfo.modalActive === true &&
        <PauseModal></PauseModal>
      }
      
    </MypageWrapper>
  );
}

export default Mypage;