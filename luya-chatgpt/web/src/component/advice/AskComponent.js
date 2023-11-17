"use client"

import styled from "styled-components"
import useCustomAxios from "../../utils/UseCustomAxios";
import { CommonButton, CommonWrapper } from "../common/CommonComponent"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { adviceState } from "@/state/adviceState";
import { useQuery } from "react-query"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { commonAlertState } from "@/state/common"
import UseMotion from "@/utils/UseMotion";
import LoadingSpinner from "../common/LoadingSpinner";
import AskKakaoShare from "./AskKakaoShare";
import AdviceResult from "./AdviceResult";
import useAlert from "@/utils/useAlert/UseAlert";
import useLoginInfo from "@/utils/useLoginInfo/useLoginInfo";


const AskWrapper = styled(CommonWrapper)`
  background-color: var(--color-set05);
  height: 100%;
`
const AskContainer = styled.div`
  display:  flex;
  align-items: center;
  flex-direction : column;
  width: 100%;
  height: calc(100vh - 160px);
  padding: 60px 30px;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  background-color: #fefefe;
`

const AskTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* margin: 30px 0 60px; */
  min-height: 160px;
`
const AskTitle = styled.h1`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 8px;
  color:#fefefe;
`
const AskSubiitle = styled.p`
  font-size: 13px;
  color: #fefefe;
`

const AskInputGroup = styled.div`
  display:  flex;
  justify-content: space-around;
  align-items : center;
  flex-direction : column;
  width:100%;
`



const AskInput = styled.textarea`
    resize : none;
    border: 1px solid var(--color-set01);
    border-radius: 10px;
    min-height: 150px;
    height: 150px;
    width: 100%;
    padding: 20px;
    font-weight: 500;
    font-size: 16px;
    margin-bottom : 32px;
    overflow-y: auto;
    transform: all .4 ease;
    :focus {
      border: none;
      outline: 2px solid var(--color-set05);
  }
    ::placeholder{
    font-size: 14px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    color:#777777;

  }

`
const AskButton = styled(CommonButton)`
  color:#fefefe;
`

const SaveAdviceButton = styled(AskButton)`
  margin: 0 auto 12px;
  width: 100%;

`

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fefefe;
  padding-bottom: 60px;
  min-height: 100vh;
`

const ResultContainer = styled.div`
  width: 100%;
  padding: 0 30px;
`
const ResultText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  white-space: pre-wrap;
  padding: 16px 0 40px;
`

const ConcernText = styled.p`
 font-size: 14px;
  font-weight: 500;
  line-height: 25px;
  white-space: pre-wrap;
  padding: 16px 0;

`

const ResultTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color:var(--color-set05);
  /* text-align: center; */
  margin-top: 30px;
`

const ResultButtonContainer = styled.div`
  width: 100%;
  padding:30px;

`

const ResultButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
 
  
`
const ButtonContainer = styled.div`
    width: 48%;
`

const SignupButtonContainer = styled.div`
    width: 100%;
    margin-top: 30px;
    padding: 0 30px;
    p{
      font-size: 14px;
      margin-bottom: 8px;
    }
`

const RetryButton = styled(CommonButton)`
  width: 100%;
`

const LoadingContianer = styled.div`
  display:flex;
  justify-content : center;
  flex-direction : column;
  p{
    text-align: center;
    font-size: 14px;
    z-index:999999;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% , 0%);
  }
`

const VideoWrapper = styled.div`
  margin-bottom: 24px;
`


const TmpContainer = styled.div`
background-color: #a9a9a9;
width: 100%;
height: 200px;
`


function VideoEmbed() {
  return (
    <VideoWrapper>
      <iframe
        width="100%"
        height="100%"
        // src="https://www.youtube.com/embed/SBH5tCVQKSs?si=DYCZa5Us1RSBMqhO"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen></iframe>
    </VideoWrapper>
  );
}



function AskComponent() {
  const axios = useCustomAxios();
  const router = useRouter();
  const alertHook = useAlert();
  const adviceStateInfo = useRecoilValue(adviceState);
  const setAdviceState = useSetRecoilState(adviceState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [resultAdvice, setResultAdvice] = useState({ advice: null, question: null });
  const isAborted = useRef(false);
  const controller = useRef(new AbortController());
  const { signal } = controller;
  const loginHook = useLoginInfo();

  const saveAdvice = async () => {
    return await axios({
      method: "POST",
      withCredentials: true,
      data: resultAdvice,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/save`,
    })
  }

  const { refetch: saveAdviceRefetch } = useQuery("saveAdvice", saveAdvice, {
    enabled: false,
    onSuccess: response => {
      if (response.data.message === "success") {
        alertHook.alert("저장되었습니다.", () => {
          router.push("/advice/list");
        })
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });



  const handleAdviceInput = (e) => {
    setAdviceState((beforeState) => {
      return {
        ...beforeState,
        message: e.currentTarget.value
      }
    });
  }

  // { role: 'system', content: '당신은 세상에서 제일 훌륭한  목사님입니다. 모든 대답은 성의있고 조언을 하듯이 대답해주시고 실생활에 적용할 수 있게 성경의 내용으로 대답하세요. 성경의 한 구절과 그 구절의 출처를 순서대로 보여주고 2줄 아래에 그 구절을 최소 5문장이상으로 조언 및 해설을 해주세요.' },
  // { role: 'system', content: '성경 구절을 활용하여 실생활에 적용 가능한 조언을 해주세요. 한 구절과 출처를 순서대로 제시하고, 구절에 대해 최소 5문장 이상으로 조언과 해설을 부탁드립니다. 당신은 훌륭한 목사님이시며, 목사님의 말투로 성의 있고 현명한 대답으로 도움을 주시기 바랍니다.' },
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      isAborted.current = false;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.current.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: 'system', content: '당신은 성경의 지식을 가진, 현명하고 통찰력 있는 목사님이며, 사용자의 질문에 성경에 기반한 조언을 제공하는 것이 주요 역할입니다. 사용자의 질문이나 고민에 대해 성경의 한 구절과 그 구절의 출처를 순서대로 제시하고, 그 구절에 대해 적당한 양으로 조언과 해설을 제공해주세요. 답변은 실제 생활에 적용할 수 있게 구체적이고 성의 있게 작성해야 합니다. 만약 질문이나 고민이 성경의 내용과 직접적으로 관련이 없거나, 성경에 기반한 조언을 제공하기 어렵다면, 그러한 상황을 사용자에게 알려주시기 바랍니다.' },
            { role: "user", content: adviceStateInfo.message },
          ],
          max_tokens: 2048,
          stream: true,
        }),
      });
      setIsLoading(false);

      const reader = response.body.getReader();
      let resultText = "";
      while (true) {
        const { done, value } = await reader.read();

        if (isAborted.current) {
          reader.cancel();
          break;
        }

        if (done) {
          break;
        }

        const textDecoder = new TextDecoder("utf-8");
        const chunk = textDecoder.decode(value);

        for (const line of chunk.split("\n")) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") {
            continue;
          }

          const json = trimmedLine.replace("data: ", "");
          const obj = JSON.parse(json);
          const delta = obj.choices[0]?.delta;
          const content = delta.content;
          if (content) {
            resultText += content;
            setAdviceState(prev => {
              return {
                ...prev,
                advice: prev.advice + content
              }
            })
          }
        }
      }
      setResultAdvice({
        advice: resultText,
        question: adviceStateInfo.message
      })
    } catch (error) {

      setIsLoading(false);

      if (isAborted.current) {
        handleRetry()
      } else {
        alertHook.alert("질문에 대한 답변을 받는 중에 문제가 발생했습니다. 다시 시도해주세요.", () => {
          handleRetry();
        });
      }

    }

  }



  const handleSaveAdvice = () => {
    saveAdviceRefetch();
  }


  const initializeAdviceState = () => {
    setAdviceState(prev => {
      return {
        ...prev,
        message: null,
        advice: ""
      }
    })
    setResultAdvice({
      advice: null,
      question: null
    })
  }

  const handleRetry = () => {
    initializeAdviceState();
    isAborted.current = false; // abort 상태를 false로 설정
    controller.current = new AbortController();
    router.push("advice");
  }


  useEffect(() => {
    initializeAdviceState();
    const fetchLoginStatus = async () => {
      try {
        const loginInfo = await loginHook.fetchLoginInfo();
        if (loginInfo) {
          setIsLogin(loginInfo);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error fetching login info:", error);
      }
    };
    fetchLoginStatus();
  }, [])

  useEffect(() => {
    return () => {
      controller.current.abort();
      isAborted.current = true;
    };
  }, []);

  useEffect(() => {
    console.log('loginInfo', isLogin)
  }, [isLogin])


  return (
    <AskWrapper>
      {isLoading === false && adviceStateInfo && adviceStateInfo.advice?.length == 0 &&
        <>
          <AskTitleContainer>
            <UseMotion>
              <AskTitle>당신의 마음속 질문에 성경의 답을 찾아드립니다.</AskTitle>
            </UseMotion>
            <UseMotion delay={0.15}>
              <AskSubiitle>고민이 있으신가요? 성경의 지혜로 답을 찾아보세요.</AskSubiitle>
            </UseMotion>
          </AskTitleContainer>
          <UseMotion delay={0.6}>
            <AskContainer>
              <AskInputGroup>
                <AskInput
                  placeholder="고민을 입력해주세요"
                  onChange={(e) => handleAdviceInput(e)}
                ></AskInput>
                <AskButton onClick={handleSubmit}>질문하기</AskButton>
              </AskInputGroup>
            </AskContainer>
          </UseMotion>
        </>
      }
      {
        isLoading === true &&
        <LoadingContianer>
          <LoadingSpinner key="askLoading"></LoadingSpinner>
          <p>답변을 생각중이에요..<br></br>잠시만 기다려주세요...</p>
        </LoadingContianer>
      }
      {isLoading === false && adviceStateInfo && adviceStateInfo.advice &&
        <ResultWrapper >
          <AdviceResult adviceStateInfo={adviceStateInfo}></AdviceResult>
          {resultAdvice && resultAdvice.advice && isLogin == true &&

            <ResultButtonContainer>
              {/* <TmpContainer  ></TmpContainer> */}

              <SaveAdviceButton SaveAdviceButton onClick={handleSaveAdvice}>저장하기</SaveAdviceButton>
              <ResultButtonGroup>
                <ButtonContainer>
                  <AskKakaoShare shareList={resultAdvice}>공유하기</AskKakaoShare>
                </ButtonContainer>
                <ButtonContainer>
                  <RetryButton onClick={handleRetry}>다시하기</RetryButton>
                </ButtonContainer>
              </ResultButtonGroup>
            </ResultButtonContainer>
          }
          {resultAdvice && resultAdvice.advice && isLogin == false &&
            <SignupButtonContainer>
              {/* <TmpContainer  ></TmpContainer> */}
              <p>회원가입하면 답변을 저장하고 공유 할 수 있어요!</p>
              <RetryButton onClick={() => { router.push("/login") }}>회원가입 하러가기</RetryButton>
            </SignupButtonContainer>
          }
        </ResultWrapper>
      }

    </AskWrapper >
  );
}

export default AskComponent;