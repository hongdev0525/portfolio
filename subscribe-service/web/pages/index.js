
import styled from "styled-components";
import Main from "component/main/Main";
import { device } from "component/common/GlobalComponent";

const MainIndexWrapper = styled.div`
   @media ${device.mobileL} {
    padding-top:0px;
  }
`

export default function MainIndex() {
  return (
    <MainIndexWrapper>
      <Main></Main>
    </MainIndexWrapper>
  )
}



