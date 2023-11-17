"use client"
import styled from "styled-components"
import { alertState } from "@/utils/useAlert/alertState"
import { CommonButton } from "./CommonComponent"
import useAlert from "@/utils/useAlert/UseAlert"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"
const CommonAlertWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;  // 변경된 부분
    top: 0;
    right: 0;  // 추가된 부분
    bottom: 0;
    left: 0;  // 추가된 부분
    width: 100%;
    z-index: 99999;
    background-color: rgba(255,255,255,0.8);
  
`
const CommonAlertContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 320px;
    min-height: 150px;
    background-color: #fefefe;
    border: 1px solid var(--color-set05);
    border-radius: 5px;
    padding: 30px 20px;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);

  
`
const CommonAlertText = styled.p`
  white-space: pre-wrap;
  padding: 30px 0;
`

const CommonAlertButton = styled(CommonButton)``

function CommonAlert() {
  const { closeAlert, alertStateInfo } = useAlert();

  const handleAlertConfirm = () => {
    const callBack = alertStateInfo?.callback;
    if (callBack) {
      callBack();
    }
    closeAlert();
  }


  return (
    <CommonAlertWrapper>
      <CommonAlertContainer>
        <CommonAlertText>
          {alertStateInfo.text}
        </CommonAlertText>
        <CommonAlertButton
          onClick={handleAlertConfirm}
        >
          확인
        </CommonAlertButton>
      </CommonAlertContainer>
    </CommonAlertWrapper>
  );
}

export default CommonAlert;