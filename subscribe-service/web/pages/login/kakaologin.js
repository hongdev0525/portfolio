import { useEffect } from "react";
import Router from "next/router";
import styled from "styled-components";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { commonState } from "state/common";
import { Oval } from 'react-loader-spinner'
import { common } from "public/js/common";
const KakaologinRedirectWrapper = styled.div`
  
`

const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    position: fixed;
    top:0;
    left:0;
    height: 100vh;
    width: 100vw;
    background-color: #fcfcfc;
    z-index: 99999;
`



function KakaologinRedirect() {
  const [code, setCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const commonStateInfo = useRecoilValue(commonState);



  const getUserInfo = () => {
    return customAxios({
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
    return customAxios({
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
    return customAxios({
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
        common.setItemWithExpireTime("loggedIn", true, 12960000)
        location.replace("/");
      } else if (res.data.status === "not exist") {
        location.href = "/signup/simple"
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
      console.log('res :>> ', res);
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
      console.log('res :>> ', res);
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
      {/* 카카오로그인 */}
      <Loading>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="#DC5F00"
          secondaryColor="#a9a9a8"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
          strokeWidth="2"
          strokeWidthSecondary="4"
        />
      </Loading>
    </KakaologinRedirectWrapper>
  );
}

export default KakaologinRedirect;