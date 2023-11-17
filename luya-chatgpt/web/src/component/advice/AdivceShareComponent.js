"use client"
import styled from "styled-components"
import AdivceResult from "./AdviceResult"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery } from "react-query";
import useCustomAxios from "@/utils/UseCustomAxios"
import { useRouter } from "next/navigation"
import { CommonButton } from "../common/CommonComponent"

const AdviceShareWarpper = styled.div`
`
const AdviceShareContainer = styled.div`
padding-bottom: 60px;
  
`
const AdivceShareTitle = styled.div`
  padding: 30px 30px 0;
  color:var(--color-set07);
  span{
    font-size: 18px;
    color:#232323;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

function AdviceShare() {
  const axios = useCustomAxios();
  const router = useRouter();
  const searchParams = useSearchParams();
  const adviceToken = searchParams.get("adviceToken");
  const [sharedInfo, setSharedInfo] = useState({});


  const getSharedAdvice = async () => {
    return await axios({
      method: "GET",
      params: { adviceToken: adviceToken },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/share/advice`,
    })
  }


  useQuery(`getSharedAdvice${adviceToken}`, getSharedAdvice, {
    onSuccess: res => {

      if (res.data.message === "success") {
        const { adviceInfo, userName } = res.data;
        setSharedInfo({
          adviceInfo: { message: adviceInfo.QUESTION, advice: adviceInfo.ADVICE_TXT },
          userName: userName
        })
      }
    },
    onError: error => {
      console.error("Error Occured : ", error)
    }
  })


  return (
    <AdviceShareWarpper>
      {sharedInfo.adviceInfo &&
        <AdviceShareContainer>
          <AdivceShareTitle><span>{sharedInfo.userName}</span>님께서 고민/질문을 공유하셨어요!</AdivceShareTitle>
          <AdivceResult adviceStateInfo={sharedInfo.adviceInfo}></AdivceResult>
          <ButtonContainer>
            <CommonButton type="button" onClick={() => router.push("/advice")}>
              나도 질문해보기
            </CommonButton>
          </ButtonContainer>
        </AdviceShareContainer>
      }
    </AdviceShareWarpper>
  );
}

export default AdviceShare;