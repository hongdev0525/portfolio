import styled from "styled-components";
import UserPassword from "./UserPassword";
import { MenuTitle } from "../CommonComponent";
import { useQuery } from "react-query";
import { customAxios } from "../../../public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mypageUserState } from "../../../state/mypage";


const MypageUserContainer = styled.div`

`
const UserInfo = styled.div`
  border:1px solid #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.10);
  padding: 20px;
  margin-bottom: 24px;
`

function MypageUser() {
  const mypageUserStateInfo = useRecoilValue(mypageUserState);
  const setMypageUserState = useSetRecoilState(mypageUserState);
  const { refetch: getUserInfoRefetch } = useQuery('', () => getUserInfo(), {
    // enabled: false,
    onSuccess: (res) => {
      console.log(res);
      setMypageUserState(res.data.data);
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }

  })

  const getUserInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    })
  }
  return (
    <MypageUserContainer>
      <UserInfo>
        <MenuTitle>회원정보</MenuTitle>
        <ul>
          <li>{mypageUserStateInfo.UserEmail}</li>
          <li>{mypageUserStateInfo.UserName}</li>
          <li>{mypageUserStateInfo.UserPhone}</li>
        </ul>
        <UserPassword></UserPassword>
      </UserInfo>
    </MypageUserContainer>
  );
}

export default MypageUser;