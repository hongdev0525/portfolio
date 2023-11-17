"use client"

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AdviceResult from "./AdviceResult";
import styled from "styled-components"
import useCustomAxios from "@/utils/UseCustomAxios";
import AskKakaoShare from "./AskKakaoShare";
import { useRouter } from "next/navigation";
import useAlert from "@/utils/useAlert/UseAlert";
import { CommonButton, CommonWrapper } from "../common/CommonComponent";
import Image from "next/image";

const AdviceInfoComponentWarpper = styled(CommonWrapper)`
  padding-bottom: 60px;
`

const ButtonGroup = styled.div`
    display: flex;
  justify-content: space-between;
  /* justify-content: center; */
  padding: 0 30px;
  width: 100%;
`



const ButtonContainer = styled.div`
  width: 49%;
`


const ShareButton = styled(CommonButton)`  
    display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #F7E600;
  padding:  20px;
  color:#3A1D1D ;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  cursor: pointer;
  img{
    margin-right: 7px;
  }
`
const DeleteButton = styled(CommonButton)`  
    width: 100%;
    background-color: #fefefe;
    border:1px solid #e5e5e5;
    color:#a9a9a9;
`

function AdviceInfoComponent({ id }) {
  const axios = useCustomAxios();
  const router = useRouter();
  const alertHook = useAlert();
  const [adviceInfo, setAdviceInfo] = useState({ advice: null, question: null });
  const [adviceToken, setAdviceToken] = useState(null);
  // 고민/질문 획득
  const getAdviceInfo = async () => {
    return await axios({
      method: "GET",
      params: { adviceNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/info`,
    })
  }

  const { refetch: getAdviceInfoRefetch } = useQuery(['getAdviceInfo', id], getAdviceInfo, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setAdviceInfo({
          message: res.data.adviceInfo.QUESTION,
          advice: res.data.adviceInfo.ADVICE_TXT
        });
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  // 공유 토큰 획득
  const getAdviceToken = async () => {
    return await axios({
      method: "GET",
      params: { adviceNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/token`,
    })
  }

  const { refetch: getAdviceTokenRefetch } = useQuery(['getAdviceToken', id], getAdviceToken, {
    onSuccess: res => {
      if (res.data.message === "success") {
        setAdviceToken(res.data.adviceToken);
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })

  // 고민/질문 획득
  const deleteAdvice = async () => {
    return await axios({
      method: "POST",
      data: { adviceNo: id },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/delete`,
    })
  }

  const { refetch: deleteAdviceRefetch } = useQuery('deleteAdvice', deleteAdvice, {
    enabled: false,
    onSuccess: res => {
      if (res.data.message === "success") {
        alertHook.alert("고민/질문이 삭제되었습니다.", () => {
          router.push("/advice/list");
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })

  const handleShare = () => {
    if (adviceToken) {
      const text = `질문 : ${adviceInfo.message} \n\n답변 : ${adviceInfo.advice}`;
      const url = `${process.env.NEXT_PUBLIC_DOMAIN}/advice/share?adviceToken=${adviceToken}`;
      Kakao.Link.sendDefault({
        objectType: 'text',
        text: text.substr(0, 397) + "...",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      });
    }
  }

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY);
    }
  }, [])

  return (
    <AdviceInfoComponentWarpper>
      {adviceInfo &&
        <>
          <AdviceResult adviceStateInfo={adviceInfo}></AdviceResult>
          <ButtonGroup>
            <ButtonContainer>
              <ShareButton onClick={handleShare} >
                <Image
                  src="/img/kakaotalkIcons.png"
                  width={24}
                  height={24}
                  alt="kakaotalk icon"
                ></Image>
                <p>
                  공유하기
                </p>
              </ShareButton>
            </ButtonContainer>
            <ButtonContainer>
              <DeleteButton onClick={deleteAdviceRefetch}>삭제하기</DeleteButton>
            </ButtonContainer>
          </ButtonGroup>
        </>
      }
    </AdviceInfoComponentWarpper>
  );
}

export default AdviceInfoComponent;