"use client"
import { useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import useCustomAxios from "@/utils/UseCustomAxios";
import { useState } from "react";
import { Oval } from 'react-loader-spinner'
import { common } from "public/js/common";
import LoadingSpinner from "@/component/common/LoadingSpinner";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";

const KakaologinRedirectWrapper = styled.div`
  
`




function KakaologinRedirect() {
  const axios = useCustomAxios();
  const [code, setCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const loginHook = useLoginInfo();

  const getUserInfo = () => {
    return axios({
      baseURl: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      url: "https://kapi.kakao.com/v2/user/me",
      method: "GET",
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        "Authorization": `Bearer ${accessToken}`,
      },
    })
  }


  const getAccessToken = () => {
    return axios({
      baseURl: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      url: "https://kauth.kakao.com/oauth/token",
      method: "POST",
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        grant_type: "authorization_code",
        client_id: `${process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY}`,
        redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN + "/login/kakaologin"}`,
        code: `${code}`
      }
    })
  }
  const requestKakaoLogin = () => {
    return axios({
      baseURl: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/kakaologin`,
      withCredentials: true,
      method: "POST",
      data: {
        userInfo: userInfo
      }
    })
  }

  const { refetch: requestKakaoLoginRefetch } = useQuery(['requestKakaoLogin', userInfo], requestKakaoLogin, {
    retry: false,
    enabled: userInfo != null,
    onSuccess: (res) => {
      if (res.data.status === "success") {
        loginHook.saveLoginInfo(true, 12960000);

        // common.setItemWithExpireTime("loggedIn",true, 12960000 )
        location.replace("/");
      } else if (res.data.status === "not exist") {
        location.replace("/");
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const { refetch: getUserInfoRefetch } = useQuery(['getUserInfo', accessToken], getUserInfo, {
    retry: false,
    enabled: accessToken != null,
    onSuccess: (res) => {
      setUserInfo(res.data)
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const { refetch: getAccessTokenRefetch } = useQuery(['getAccessToken', code], getAccessToken, {
    retry: false,
    enabled: code != null,
    onSuccess: (res) => {
      const accessToken = res.data.access_token
      setAccessToken(accessToken);
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  useEffect(() => {

    let params = (new URL(document.location)).searchParams;
    let code = params.get('code');
    if (code) {
      setCode(code);
    }
  }, []);

  return (
    <KakaologinRedirectWrapper>
      <LoadingSpinner></LoadingSpinner>
    </KakaologinRedirectWrapper>
  );
}

export default KakaologinRedirect;