import styled from 'styled-components'
import Mypage from '../../component/mypage/Mypage';
import { Title, device } from '../../component/common/GlobalComponent';
import { pauseModalState } from 'state/mypage';
import PauseModal from 'component/mypage/main/PauseModal';
import { useRecoilValue } from 'recoil';
const MypageWrapper = styled.div`
`
const MypageLayout = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 142px auto;
    >h1{
        width: 50%;
        margin:0 auto;
    }
    @media ${device.mobileL} {
        margin: 73px auto;
  }
`


function MypageMain() {
    return (
        <MypageWrapper>
            <Mypage></Mypage>
        </MypageWrapper>
    );
}

MypageMain.getLayout = function getLayout(page) {
    return (
        <MypageLayout>
            {page}
        </MypageLayout>
    )
}

export default MypageMain;