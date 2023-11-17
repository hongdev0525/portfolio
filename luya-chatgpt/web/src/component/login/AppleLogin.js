"use client"
import styled from "styled-components"
import { CommonWrapper } from "../common/CommonComponent"
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation, useQuery } from 'react-query';
import { useEffect, useState } from "react";
import useCustomAxios from "@/utils/UseCustomAxios";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";
import useAlert from "@/utils/useAlert/UseAlert";
import { useRouter } from "next/navigation";

const AppleLoginWrapper = styled.div`
  
`
const AppleLoginContainer = styled.div`
  
`

function AppleLogin() {
  const axios = useCustomAxios();
  const [loginInfo, setLoginInfo] = useState(null);
  const loginHook = useLoginInfo();
  const router = useRouter();
  const alertHook = useAlert();

  const login = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      params: loginInfo,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/applelogin`,
    });

  };

  const { mutate } = useMutation(() => login(), {
    enabled: false,
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "success") {
        loginHook.saveLoginInfo(true, 12960000);
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


  useEffect(() => {
    AppleID.auth.init({
      clientId: 'kr.co.luya.signup',
      scope: 'name email',
      redirectURI: 'https://luya.co.kr/signup/apple',
      state: 'signin',	//csrf, php의 openssl_random_pseudo_bytes
      usePopup: true	// or false defaults to false
    });
  }, [])

  useEffect(() => {
    // 성공한 인증 응답을 처리하기 위한 이벤트 리스너 추가
    const successHandler = (event) => {
      console.log('event', event)
      setLoginInfo(event.detail);
      if (loginInfo) {
        mutate();
      }
    };

    // 인증 실패를 처리하기 위한 이벤트 리스너 추가
    const failureHandler = (event) => {
      console.log('event', event)
      console.log(event.detail.error);
    };


    // 이벤트 리스너를 document에 연결
    document.addEventListener('AppleIDSignInOnSuccess', successHandler);
    document.addEventListener('AppleIDSignInOnFailure', failureHandler);

    // 컴포넌트가 unmount될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('AppleIDSignInOnSuccess', successHandler);
      document.removeEventListener('AppleIDSignInOnFailure', failureHandler);
    };
  }, []);  // 빈 dependency 배열을 사용하여 이 effect를 컴포넌트 마운트시에만 실행

  useEffect(() => {
    if (loginInfo) {
      mutate();
    }
  }, [loginInfo]);


  return (
    <AppleLoginWrapper>
      <AppleLoginContainer>
        <div
          id="appleid-signin"
          data-mode="center-align"
          data-type="sign-in"
          data-color="black"
          data-border="false"
          data-border-radius="14"
          data-width="230"
          data-height="40"
        ></div>
      </AppleLoginContainer>
    </AppleLoginWrapper>
  );
}

export default AppleLogin;