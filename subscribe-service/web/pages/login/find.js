
import styled from 'styled-components'
import FindUserInfo from '../../component/login/FindUserInfo';
const FindUserInfoWrapper = styled.div`
    display: flex;
    justify-content:center;
    align-items: center;
    width: 100%;
`

function FindUserInfoMain() {
    return (
        <FindUserInfoWrapper>
            <FindUserInfo></FindUserInfo>
        </FindUserInfoWrapper>
    );
}

export default FindUserInfoMain;