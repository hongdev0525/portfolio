"use client"
import styled, { css } from "styled-components"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { BiSolidUserCircle } from "react-icons/bi";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { HiOutlineDocumentText ,HiMenuAlt3 } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";


const HeaderWrapper = styled.div`
  width: 100%;

`

const HeaderContainer = styled.div`
  display: flex ;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 69px;
  background-color: var(--color-set05);
  padding: 10px 20px;

`

const HeaderTitle = styled.div`
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  font-size: 24px;
  font-weight: 800;
  color: #fefefe;
  height: 45px;
`

const Backward = styled.div`
  img{
    opacity: 0.4;
    
  }
`


const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  z-index: 102;

`
const Profile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #fefefe;
  font-weight: 300;
`

const ProfileMenuListContainer = styled.div`
  width: 100%;
  display: flex;
  z-index: 100;

  
`
const ProfileBackground = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 50%;
  height: calc(100vh - 70px);
  background-color: transparent;
  z-index: 999;
`

const ProfileMenuList = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 69px;
  right: 0%;
  transform: translate(150%, 0);
  background-color: #fefefe;
  width: 50%;
  height: auto;
  /* height: calc(100vh - 70px); */
  padding: 15px 20px;
  z-index: 9999;
  transition: all .4s ease;
  border: 1px solid #e5e5e5;

  ${props => props.active === true ?
    css`
    transform: translate(0%, 0);
  `
    :
    css`
      transform: translate(150%, 0);
  `
  }

`

const ProfileMenu = styled.ul`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  /* color: var(--color-set07); */
  font-size: 16px;
  width: 80%;
`

const MenuContainer = styled.li`
   display: flex ;
   justify-content: flex-end;
   align-items: center;
   width: 100%;
    margin-bottom: 18px;
    p{
      margin-right: 4px;
    }
`

const HeaderBackground = styled.div`
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;
  ${props => props.active === true ?
    css`
    transform: translate(0%, 0);
  `
    :
    css`
      transform: translate(150%, 0);
  `
  }
`

function CommonHeader() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const pathName = usePathname();
  const [profileState, setProfileState] = useState(false);
  const loginHook = useLoginInfo();
  




  useEffect(() => {


    const fetchLoginStatus = async () => {
      try {
        const loginInfo = await loginHook.fetchLoginInfo();
        if (loginInfo) {
          setIsLogin(loginInfo);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error fetching login info:", error);
      }
    };
    fetchLoginStatus();

    handelClose();
  }, [pathName])



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
        logOutRefetch();
        // common.setItemWithExpireTime("loggedIn", false, 0);
        router.push("/");
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });



  const handleProfile = () => {
    setProfileState(prev => {
      return !prev
    });
  }

  const handelClose = () => {
    setProfileState(prev => {
      return false
    });
  }




  useEffect(() => {

    return () => {
      setProfileState(prev => {
        return false
      });
    }
  }, [])

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <HeaderTitle onClick={() => { router.push("/") }}>
          <Image priority={true} width={80} height={45} src="/img/logo/logo_text06.png" alt="Luya"></Image>
        </HeaderTitle>
        {isLogin &&
          <ProfileContainer >
            <Profile onClick={handleProfile}>
              <HiMenuAlt3 size={28}></HiMenuAlt3>
            </Profile>
            <ProfileMenuListContainer>
              <ProfileMenuList active={profileState}>
                <AiFillCloseCircle width={10} onClick={handelClose}> </AiFillCloseCircle>
                <ProfileMenu>
                  <MenuContainer onClick={() => { router.push("/mypage") }}> <p>계정정보</p><BiSolidUserCircle width={10}></BiSolidUserCircle></MenuContainer>
                  <MenuContainer onClick={() => { router.push("/advice/list") }}> <p>고민/질문</p><HiOutlineDocumentText width={10}></HiOutlineDocumentText></MenuContainer>
                </ProfileMenu>
              </ProfileMenuList>
            </ProfileMenuListContainer>
          </ProfileContainer>
        }
      </HeaderContainer>
      <HeaderBackground active={profileState} onClick={handelClose}></HeaderBackground>
    </HeaderWrapper >
  );
}

export default CommonHeader;