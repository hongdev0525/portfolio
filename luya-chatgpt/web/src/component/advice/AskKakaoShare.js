"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import useAlert from "@/utils/useAlert/UseAlert";
import { useMutation } from "react-query";
import useCustomAxios from "../../utils/UseCustomAxios";
import { loadingState } from "@/state/common";
import { useRecoilValue, useSetRecoilState } from "recoil";


const AskKakaoShareWrapper = styled.div`
  width: 100%;
`

const KaKaoShareButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #F7E600;
  padding:  20px;
  color:#3A1D1D ;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  cursor: pointer;
  font-size: 14px;
  img{
    margin-right: 7px;
  }
`
function AskKakaoShare({ shareList }) {
  const axios = useCustomAxios();
  const setLoadingState = useSetRecoilState(loadingState);

  const addShareQuestion = async () => {
    return await axios({
      method: "POST",
      data: shareList,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/share`,
    });
  };

  const addShareQuestionMutation = useMutation(addShareQuestion, {
    retry: false,
    onSuccess: (res) => {
      // 카카오톡 공유 기능 실행 코드
      if (res.data.message === "success") {
        const text = `질문 : ${shareList.question} \n\n답변 : ${shareList.advice}`;
        const url = `${process.env.NEXT_PUBLIC_DOMAIN}/advice/share?adviceToken=${res.data.shareId}`;
        Kakao.Link.sendDefault({
          objectType: 'text',
          text: text.substr(0, 397) + "...",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        });
      }
      setLoadingState(prev => {
        return {
          ...prev,
          active: false
        }
      })
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });


  const handleShareClick = (e) => {
    e.preventDefault();
    if (shareList.advice && shareList.advice.length !== 0) {
      addShareQuestionMutation.mutate();
    }
  };

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY);
    }
  }, []);


  return (
    <AskKakaoShareWrapper>
      <KaKaoShareButton id="kakaotalk-sharing-btn" onClick={handleShareClick}>
        <Image
          src="/img/kakaotalkIcons.png"
          width={24}
          height={24}
          alt="kakaotalk icon"
        ></Image>
        <p>공유하기</p>
      </KaKaoShareButton>
    </AskKakaoShareWrapper>
  );
}

export default AskKakaoShare;

