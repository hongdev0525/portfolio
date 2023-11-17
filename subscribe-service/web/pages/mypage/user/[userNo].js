import UserInfo from "component/mypage/user/UserInfo";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { withdrawState } from "state/user";


const UserInfoMainWrapper = styled.div`
`



function UserInfoMain() {
  const withdrawStateInfo = useRecoilValue(withdrawState);

  return (
    <UserInfoMainWrapper>
      <UserInfo></UserInfo>
 
    </UserInfoMainWrapper>
  );
}

export default UserInfoMain;