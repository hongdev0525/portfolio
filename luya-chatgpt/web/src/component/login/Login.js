"use client"
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { CommonButton, CommonInput } from '../common/CommonComponent';
import { useRouter } from 'next/navigation';
import useCustomAxios from "../../utils/UseCustomAxios";
import useAlert from '@/utils/useAlert/UseAlert';
import { common } from '../../../public/js/common';
import Image from 'next/image';
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";
import AppleLogin from './AppleLogin';


const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 30px 0;
`;

const LoginTitle = styled.h2`
  text-align: center;
  span{
    display: block;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    color:var(--color-set07);
  }
  div{
    margin-bottom: 8px;
  }
  p{
    font-size: 16px;
    font-weight: 400;
    color:var(--color-set07);
    margin-bottom: 24px;

  }

`;

const ImageContainer = styled.div`
  margin-bottom: 24px;
`

const LoginForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  /* gap: 1rem; */
  max-width: 300px;
  width: 100%;
`;

const Input = styled(CommonInput)`
  margin-bottom: 12px;
`;

const LoginButton = styled(CommonButton)`
 font-size:16px;
 height: 40px;
 border-radius: 5px;
 margin-top: 24px;
 /* margin:24px 0; */
 margin-bottom: 12px;


`;
const SignUpButton = styled.div`
  text-decoration: underline;
  text-align: right;
  font-size:16px;
  height: 40px;
 margin-top: 12px;


`;

const KakaoLogin = styled(CommonButton)`
 display:flex;
 justify-content: center;
 align-items: center;
 color : #000000;
 background : #FEE500;
 border : none;
 font-size:16px;
 height: 40px;
 /* margin-bottom: 24px; */
 margin-bottom: 12px;

 border-radius: 5px;
 img{
  margin-right: 12px;
 }
`
const Login = () => {
  const axios = useCustomAxios();
  const router = useRouter();
  const alertHook = useAlert();
  const [useremail, setuseremail] = useState('');
  const [password, setPassword] = useState('');
  const loginHook = useLoginInfo();
  const [deviceType, setDeviceType] = useState(null);


  const login = async () => {
    return await axios({
      method: "POST",
      withCredentials: true,
      data: { USER_EMAIL: useremail, USER_PASSWORD: password },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login`,
    });
  };

  const { refetch: loginRefetch } = useQuery('login', login, {
    enabled: false,
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "not found") {
        alertHook.alert("아이디가 존재하지 않습니다.", () =>
          router.replace('/login')
        );
      } else if (data.status === "fail" && data.error === "Wrong password") {
        alertHook.alert("비밀번호가 일치하지 않습니다.", () =>
          router.replace('/login')
        );
      } else {
        loginHook.saveLoginInfo(true, 12960000);
        // common.setItemWithExpireTime("loggedIn", true, 12960000);
        router.replace("/");
      }
    },
    onError: (error) => {
      // 로그인 실패 시 에러 처리
      alertHook.alert("로그인에 실패했습니다. 다시 시도해주세요.", () =>
        router.replace('/login')
      );
      console.error('로그인 실패:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginRefetch();
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };


  const handleKakaoLogin = (e) => {
    e.stopPropagation();
    // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_DOMAIN + "/login/kakaologin"}`
    // location.href = KAKAO_AUTH_URL;
    Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_DOMAIN + "/login/kakaologin",
    });
  }

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes('android')) {
      setDeviceType('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setDeviceType('ios');
    } else {
      setDeviceType('web');
    }

  }, [])


  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>
          <span>로그인</span>
          {/* <ImageContainer>
          <Image width={200} height={110} src="/img/logo/logo_text05.png" alt="루야"></Image>
        </ImageContainer> */}

          <div>당신의 신앙 생활은 언제나!</div>
          <p>할렐Luya! 루야는 당신의 신앙 생활을 돕습니다.</p>
        </LoginTitle>

        <Input
          type="email"
          placeholder="이메일"
          value={useremail}
          onChange={(e) => setuseremail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handlePasswordKeyPress}
        />
        <LoginButton type="submit">로그인</LoginButton>

        <KakaoLogin
          type='button'
          onClick={handleKakaoLogin}
        >
          <Image width={20} height={20} src="/img/kakaoLogin.png" alt="카카오 로그인"></Image>
          카카오로 시작하기
        </KakaoLogin>
        {deviceType && deviceType !== 'android' &&
          <AppleLogin></AppleLogin>
        }
        <SignUpButton onClick={() => router.push("/signup")}>
          회원가입
        </SignUpButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
