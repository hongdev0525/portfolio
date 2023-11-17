"use client"
import styled from "styled-components"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { commonConfirmState } from "@/state/common"
import { CommonButton } from "./CommonComponent"
import useConfirm from "@/utils/useConfirm/UseConfirm"

const CommonConfirmWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed; 
    top: 0;
    right: 0;  
    bottom: 0;
    left: 0;  
    width: 100%;
    z-index: 99999;
    background-color: rgba(255,255,255,0.8);
  
`
const CommonConfirmContainer = styled.div`
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
    box-shadow: 5px 5px 10px rgba(0,0,0,0,3);
  
`
const CommonConfirmText = styled.p`
  white-space: pre-wrap;
  padding: 30px 0;
`

const CommonConfirmButtonGroup = styled.div`
  display:flex;
  justify-content: flex-end;
  width: 100%;
`

const CommonConfirmButton = styled(CommonButton)`
  width: fit-content;
  margin-left: 16px;
  height: 40px;

`
const CommonConfirmCancelButton = styled(CommonConfirmButton)`
  width: fit-content;
  background-color: #fefefe;
  border:  1px  solid #e5e5e5;
  color:#a9a9a9;
`

function CommonConfirm() {

  const { closeConfirm, confirmStateInfo } = useConfirm();

  const handleConfirmConfirm = () => {
    const callBack = confirmStateInfo?.callback;
    closeConfirm();
    if (callBack) {
      callBack();
    }
  }
  const handleCancelConfirm = () => {
    closeConfirm();
  }
  return (
    <CommonConfirmWrapper>
      <CommonConfirmContainer>
        <CommonConfirmText>
          {confirmStateInfo.text}
        </CommonConfirmText>
        <CommonConfirmButtonGroup>
          <CommonConfirmCancelButton
            onClick={handleCancelConfirm}
          >
            {confirmStateInfo.cancelText && confirmStateInfo.cancelText.length !== 0 ? confirmStateInfo.cancelText : "취소"}
          </CommonConfirmCancelButton>
          <CommonConfirmButton
            onClick={handleConfirmConfirm}
          >
            {confirmStateInfo.confirmText && confirmStateInfo.confirmText.length !== 0 ? confirmStateInfo.confirmText : "확인"}
          </CommonConfirmButton>

        </CommonConfirmButtonGroup>
      </CommonConfirmContainer>
    </CommonConfirmWrapper>
  );
}

export default CommonConfirm;