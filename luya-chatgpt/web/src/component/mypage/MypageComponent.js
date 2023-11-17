"use client"
import styled from "styled-components"
import { CommonButton, CommonWrapper } from "../common/CommonComponent";
import { useQuery } from "react-query";
import useCustomAxios from "@/utils/UseCustomAxios";
import { useRouter } from "next/navigation";
import { common } from "../../../public/js/common";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";
import useConfirm from "@/utils/useConfirm/UseConfirm";
import useAlert from "@/utils/useAlert/UseAlert";
import { useState } from "react";


// import MypageMenuList from "./MypageMenuList";
const MypageWrapper = styled(CommonWrapper)`
`
const MypageContainer = styled.div`
  width: 100%;
  padding: 20px 20px 60px;
  h2{
    text-align: center;
  }
`

const MypageTitle = styled.div`
  font-size:18px;
  margin-bottom: 8px;
  color:var(--color-set07);
`
const MypageGroup = styled.div`
  margin-bottom: 24px;
`

const MenuContainer = styled.div`
  display: flex ;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  padding:  20px;
  background-color: var(--color-set02);
  font-size: 18px;
`

const LogoutButton = styled.div`
  margin: 12px 0 ;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  color:var(--color-set07);

`
function MypageComponent() {
  const axios = useCustomAxios();
  const router = useRouter();
  const loginHook = useLoginInfo();
  const confrimHook = useConfirm();
  const alertHook = useAlert();

  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    })
  }

  const { refetch: getUserInfoRefetch } = useQuery(`getUserInfo`, getUserInfo, {
    onSuccess: res => {
      if (res.data.status === "success") {
        setUserInfo(res.data);
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })




  const logOut = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/logout`,
    })
  }

  const { refetch: logOutRefetch } = useQuery("logOut", logOut, {
    enabled: false,
    onSuccess: response => {
      if (response.data.status === "success") {
        loginHook.saveLoginInfo(false, 0);

        document.cookie = "_actk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "_rftk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        // common.setItemWithExpireTime("loggedIn", false, 0);
        router.push("/");
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });


  const deleteId = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/delete`,
    })
  }

  const { refetch: deleteIdRefetch } = useQuery("deleteId", deleteId, {
    enabled: false,
    onSuccess: response => {
      if (response.data.status === "success") {
        alertHook.alert("정상적으로 탈퇴되었습니다.", () => {
          loginHook.saveLoginInfo(false, 0);
          router.replace("/login");
        })
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });

  const handleDeleteId = () => {
    confrimHook.confirm('정말로 탈퇴하시겠습니까?', () => { deleteIdRefetch() })
  }
  const handleLogOut = () => {
    logOutRefetch();
  }
  return (
    <MypageWrapper>
      <MypageContainer>
        <MypageGroup>
          <MypageTitle>계정정보</MypageTitle>
          {userInfo?.userEmail &&
            <MenuContainer>
              {userInfo.userEmail}
            </MenuContainer>
          }
        </MypageGroup>
        <MypageGroup>
          <MypageTitle>설정</MypageTitle>
          <LogoutButton onClick={handleLogOut}>
            로그아웃
          </LogoutButton>
          <LogoutButton onClick={handleDeleteId}>
            계정탈퇴
          </LogoutButton>
        </MypageGroup>
      </MypageContainer>
    </MypageWrapper>
  );
}

export default MypageComponent;