"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { common } from "../../public/js/common";
import { loadingState } from "@/state/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";


const useCustomAxios = () => {
  const router = useRouter();
  const loadingStateInfo = useRecoilValue(loadingState);
  const setLoadingState = useSetRecoilState(loadingState);
  const loginHook = useLoginInfo();

  const customAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER,
  });

  useEffect(() => {

    const interceptRequest = (config) => {
      setLoadingState(prev => {
        return {
          ...prev,
          active: true
        }
      })
      return config;
    }



    const interceptResponse = (response) => {

      if (response.data.message) {
        const jwtExpired = response.data.message === "expired";

        const notNeededLoginList = JSON.parse(
          process.env.NEXT_PUBLIC_WHITELIST_URL
        );
        if (!notNeededLoginList.includes(router.pathname)) {
          if (jwtExpired) {
            // common.setItemWithExpireTime("loggedIn", false, 0);
            loginHook.saveLoginInfo(false, 0);

            document.cookie = "_actk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "_rftk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.replace("/login");
          }
        } else {
          if (jwtExpired) {
            // common.setItemWithExpireTime("loggedIn", false, 0);
            loginHook.saveLoginInfo(false, 0);

            document.cookie = "_actk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "_rftk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          }
        }
      }
      setLoadingState(prev => {
        return {
          ...prev,
          active: false
        }
      })
      return response;
    };

    const interceptError = (error) => {
      setLoadingState(prev => {
        return {
          ...prev,
          active: false
        }
      })
      return Promise.reject(error);
    };

    customAxios.interceptors.request.use(interceptRequest)


    const responseInterceptor = customAxios.interceptors.response.use(
      interceptResponse,
      interceptError
    );

    return () => {
      // 언마운트 시 인터셉터 해제
      customAxios.interceptors.response.eject(responseInterceptor);

    };
  }, [customAxios, router]);

  return customAxios;
};

export default useCustomAxios;

