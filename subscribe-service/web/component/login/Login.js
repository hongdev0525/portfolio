import styled from "styled-components";
import { customAxios } from "../../public/js/customAxios";
import { Title, Input, NoticeInfo, Button } from "../common/MemberComponent";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Router from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import { device, fontWeight } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { common } from "public/js/common";
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;
const LoginGroup = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 460px;
  margin-top: 24px;
  margin-bottom: 170px;
  padding: 40px 48px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media ${device.mobileL} {
    box-shadow: none;
    width: 100%;
    padding: 0 24px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 43px;
  margin-bottom: 40px;
  gap: 16px;
  @media ${device.mobileL} {
    margin-top: 20px;
      button{
      width:100%;
      font-size: 16px;
      font-weight: ${fontWeight("medium")};
      line-height: 28px;
      gap: 11px;
      border-radius: 5px;
    }
  }
`;

const LoginInputContainer = styled.div`
  width: 100%;
`;

const LoginInputGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 16px;
  @media ${device.mobileL} {
    margin-bottom: 10px;
     input{
      width: 100%;
      background-color: #F3F3F7;
      border: none;
      padding: 0 12px;
      margin-bottom: 0px;
     }
     input::placeholder{
      font-size: 14px;
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

const AccountGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const MaintainLogin = styled.div`
  display: flex;
  align-items: center;
`;
const CheckInputOff = styled.div`
  display: flex;
  width: 19px;
  height: 19px;
  border-radius: 100%;
  border: 1px solid #bababa;
`;
const CheckLabel = styled.label`
  display: flex;
  margin-left: 6px;
  font-size: 16px;
  font-weight: normal;
`;

const FindAccount = styled.div`
  font-size: 16px;
  font-weight: normal;
  color: #767676;
  cursor: pointer;
  @media ${device.mobileL} {
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
    color:#767676;
    padding: 30px 0;
    border-bottom: 1px solid #DBDBDB;
    span{
      display: block;
      color:#DBDBDB;
      margin:0 10px;
    }
  }
`;



const LoginTitle = styled(Title)`

@media ${device.mobileL} {
   font-size:20px;
   line-height: 28px;
   font-weight: ${fontWeight("regular")};
  }
`

const KakaoNotice = styled.p`
  font-size:14px;
  line-height: 28px;
  font-weight: ${fontWeight("regular")};
  margin: 30px auto;
`

const KakaologinButton = styled(Image)`
  object-fit: cover;
`
function Login() {
  const router = useRouter();
  const [emailValidation, setEmailValidation] = useState(); //초기값은 undefined
  const [loginInfo, setLoginInfo] = useState({});
  const [loginStatus, setLoginStatus] = useState(false);
  const [mobile, setMobile] = useState(null);
  const loginRef = useRef(null);
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
            common.setItemWithExpireTime("loggedIn", true, 12960000)
            location.replace("/");
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
  const requestLogin = async (loginInfo) => {
    return await customAxios({
      method: "POST",
      data: loginInfo,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login`,
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

  const handleRouting = (path) => {
    Router.push(path);
  };

  const CheckInput = () => {
    setLoginStatus(!loginStatus);
  };

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_DOMAIN + "/login/kakaologin"}`
    location.href = KAKAO_AUTH_URL;
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  useEffect(() => {
    setMobile(isMobile);
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(`${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}`);
      console.log(window.Kakao.isInitialized());
    }
  }, [])


  return (
    <LoginContainer>
      <LoginTitle>로그인</LoginTitle>
      {!mobile &&

        <LoginGroup>
          <LoginInputContainer>
            <LoginInputGroup>
              <Input
                id="userEmail"
                type="email"
                name="email"
                placeholder="이메일을 입력하세요"
                onBlur={(e) => validationCheck(e)}
                onChange={handleInputData}
                ref={loginRef}
                onKeyDown={handleKeyDown}
              ></Input>
              {emailValidation === false && (
                <NoticeInfo>이메일을 정확히 입력해주세요</NoticeInfo>
              )}
            </LoginInputGroup>
            <LoginInputGroup>
              <Input
                id="userPassword"
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                onChange={handleInputData}
                ref={loginRef}
                onKeyDown={handleKeyDown}
              ></Input>
            </LoginInputGroup>
          </LoginInputContainer>
          <AccountGroup>
            <MaintainLogin>
              {/* {loginStatus ? (
              <MdCheckCircle
                size={19}
                onClick={() => CheckInput()}
                background-color="#DC5F00"
              ></MdCheckCircle>
            ) : (
              <CheckInputOff onClick={() => CheckInput()}></CheckInputOff>
            )}

            <CheckLabel onClick={() => CheckInput()}>
              로그인 상태유지
            </CheckLabel> */}
            </MaintainLogin>
            <FindAccount onClick={() => handleRouting("/login/find")}>
              아이디/비밀번호 찾기
            </FindAccount>

          </AccountGroup>
          <ButtonGroup>
            <Button
              onClick={() => handleLogin()}
              color="#ffffff"
              background="#dc5f00"
              border="none"
            >
              로그인 하기
            </Button>
            <Button
              onClick={handleKakaoLogin}
              color="#000000"
              background="#FEE500"
              border="none">
              카카오로 시작하기
            </Button>
          </ButtonGroup>
          <Button
            onClick={() => handleRouting("/signup")}
            color="#000000"
            background="#ffffff"
            border="1px solid #DBDBDB"
          >
            회원가입 하기
          </Button>
        </LoginGroup>
      }
      {mobile &&
        <LoginGroup>
          <LoginInputContainer>
            <LoginInputGroup>
              <Input
                id="userEmail"
                type="email"
                name="email"
                placeholder="이메일을 입력하세요"
                onBlur={(e) => validationCheck(e)}
                onChange={handleInputData}
              ></Input>
              {emailValidation === false && (
                <NoticeInfo>이메일을 정확히 입력해주세요</NoticeInfo>
              )}
            </LoginInputGroup>
            <LoginInputGroup>
              <Input
                id="userPassword"
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                onChange={handleInputData}
              ></Input>
            </LoginInputGroup>
          </LoginInputContainer>
          <ButtonGroup>
            <Button
              onClick={() => handleLogin()}
              color="#ffffff"
              background="#dc5f00"
              border="none"
            >
              로그인
            </Button>
            <Button
              onClick={() => handleRouting("/signup")}
              color="#000000"
              background="#ffffff"
              border="1px solid #DBDBDB"
            >
              회원가입 하기
            </Button>
            <FindAccount onClick={() => handleRouting("/login/find")}>
              아이디찾기 <span>|</span> 비밀번호 찾기
            </FindAccount>
            <KakaoNotice>카카오로 간편하게 시작하세요</KakaoNotice>
            <Button
              onClick={handleKakaoLogin}
              color="#000000"
              background="#FEE500"
              border="none">
              카카오로 시작하기
            </Button>
          </ButtonGroup>

        </LoginGroup>
      }
    </LoginContainer>
  );
}

export default Login;
