import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Router from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import { device, fontWeight, Input } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { customAxios } from "public/js/customAxios";
const ConfirmUserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 164px 0 170px;
  @media ${device.mobileL} {
    margin: 73px 0 120px;
  }
`
const ConfirmUserContainer = styled.div`
  width: 793px;
  margin-bottom: 60px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    margin-bottom: 24px;
  }
`

const ConfirmTitleWrapper = styled.div`
  display: flex ;
  flex-direction: column;
  margin-bottom: 60px;
  @media ${device.mobileL} {
      margin-bottom: 0px;
  }
`
const ConfirmTitleContainer = styled.div`
  display: flex;
  text-align: center;
  @media ${device.mobileL} {
      align-items: center;
      margin-bottom: 24px;
  }
`
const ConfirmTitle = styled.div`
    font-size: 28px;
    line-height: 33px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 12px;
    @media ${device.mobileL} {
      width: 100%;
      font-size: 20px;
      font-weight: ${fontWeight("regular")};
  }
`
const ConfirmSubtitle = styled.div`
    font-size: 16px;
    font-weight: ${fontWeight("regular")};
    color:#767676;
    margin-left: 164px;
    @media ${device.mobileL} {
      margin-left: 0px;
      margin-bottom: 26px;
  }
`
const LoginInputGroup = styled.div`
display: flex;
margin-bottom: 16px;
@media ${device.mobileL} {
  flex-direction: column;
  margin-bottom: 10px;
   input{
    width: 100%;
    font-size: 16px;
    background-color: #F3F3F7;
    border: none;
    padding: 0 12px;
    margin-bottom: 0px;
   }
   input::placeholder{
    font-size: 16px;
    line-height: 28px;
    font-weight: ${fontWeight("regular")};
    color: #999999
   }
   p{
    margin-top:4px;
    padding-left:12px;
   }
}
`;

const LoginLabel = styled.label`
  display: flex ;
  align-items: center ;
  width: fit-content;
  width: 211px;
  padding-left: 70px;
  @media ${device.mobileL} {
    padding-left: 0px;
    margin-bottom: 4px;
  }
`
const LoginInput = styled(Input)`
    width:364px;
    height: 56px;
`

const BackwardImageContainer = styled.div`
  margin-right: 312px;
  img{
    cursor: pointer;
  }
  @media ${device.mobileL} {
    margin-right: 0px;
    img{
      width: 28px;
      height: 28px;
    } 
  }
`

const ConfirmUserButton = styled.button`
    width: 364px;
    height: 56px;
    background-color: #DC5F00;
    border-radius: 12px;
    color:#fefefe;
    font-size: 16px;
    font-weight: ${fontWeight("bold")};
    outline: none;
    cursor: pointer;
    border:none;
`



function ConfirmUser() {
  const [loginInfo, setLoginInfo] = useState({});
  const [emailValidation, setEmailValidation] = useState(); //초기값은 undefined


  const getUserInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    });
  };


  const requestLogin = async (loginInfo) => {
    return await customAxios({
      method: "POST",
      data: loginInfo,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login`,
    });
  };

  useQuery('getUserInfo', getUserInfo, {
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      console.log('res', res)
      setLoginInfo({
        userEmail: res.data.data.UserEmail,
        userNo: res.data.data.UserNo
      });
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })



  const { refetch: requestLoginRefetch } = useQuery(
    ["requestLogin", loginInfo],
    () => requestLogin(loginInfo),
    {
      enabled: false,
      onSuccess: (res) => {
        if (res.status === 200) {
          const data = res.data;
          if (data.status === "not found") {
            alert("회원정보가 없습니다.");
          } else if (
            data.status === "fail" &&
            data.error === "Wrong password"
          ) {
            alert("비밀번호가 일치하지 않습니다.");
          } else {
            Router.push(`/mypage/user/${loginInfo.userNo}`);
          }
        } else {
          console.error(res);
        }
      },
      onError: (error) => {
        alert("로그인에 실패했습니다.");
        console.error("Error Occured : ", error);
      },
    }
  );


  const validationCheck = (e) => {
    const regExpEmail =
      /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
    const value = e.target.value;
    const tmp = {
      value: value,
      validation: false, //초기값을 알기위함인가?
    };
    if (!regExpEmail.test(value)) {
      setEmailValidation(false);
    } else {
      setEmailValidation(true);
    }
    return tmp;
  };

  const handleInputData = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = () => {
    if (Object.keys(loginInfo).length === 0) {
      //object.keys - 주어진 객체의 속성 이름들을 배열로 반환
      alert("로그인정보를 입력해주세요.");
      return false;
    } else {
      if (!loginInfo.userEmail || loginInfo.userEmail?.length === 0) {
        alert("아이디를 입력해주세요.");
      } else if (
        !loginInfo.userPassword ||
        loginInfo.userPassword?.length === 0
      ) {
        alert("비밀번호를 입력해주세요.");
      } else {
        requestLoginRefetch();
      }
    }
  };

  useEffect(() => {
    console.log('loginInfo', loginInfo)
  }, [loginInfo])

  return (
    <ConfirmUserWrapper>
      <ConfirmUserContainer>
        <ConfirmTitleWrapper>
          <ConfirmTitleContainer>
            <BackwardImageContainer>
              <Image
                src="/img/mypage/backward_icon.png"
                width={34} height={34}
                alt="뒤로가기 아이콘"
                onClick={() => { Router.push("/mypage") }}
              ></Image>
            </BackwardImageContainer>
            <ConfirmTitle>회원관리</ConfirmTitle>
          </ConfirmTitleContainer>
          <ConfirmSubtitle>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해주세요</ConfirmSubtitle>
        </ConfirmTitleWrapper>
        <LoginInputGroup>
          <LoginLabel htmlFor="email">아이디</LoginLabel>
          <LoginInput
            id="userEmail"
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={loginInfo.userEmail || ""}
            onBlur={(e) => validationCheck(e)}
            onChange={handleInputData}
          ></LoginInput>
          {emailValidation === false && (
            <NoticeInfo>이메일을 정확히 입력해주세요</NoticeInfo>
          )}
        </LoginInputGroup>
        <LoginInputGroup>
          <LoginLabel htmlFor="email">비밀번호</LoginLabel>
          <LoginInput
            id="userPassword"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            onChange={handleInputData}
          ></LoginInput>
        </LoginInputGroup>
      </ConfirmUserContainer>
      <ConfirmUserButton type="button" onClick={handleLogin}>확인</ConfirmUserButton>
    </ConfirmUserWrapper>
  );
}

export default ConfirmUser;