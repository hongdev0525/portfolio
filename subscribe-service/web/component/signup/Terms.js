import { useState } from "react";
import styled from "styled-components";
import { fontWeight, device, InputLabel, InputWrapper, InputContainer, Input } from "component/common/GlobalComponent";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { termsModalState, termsState } from "state/signup.js";
import TermsAgreement from "./TermsAgreement";

const FlexInputWrapper = styled(InputWrapper)`
  width:100%;
  margin-bottom: 20px;
  justify-content: space-between;
`

const SignupButton = styled.button`
  width:137px;
  height:56px;
  border-radius: 5px;
  margin-left: 12px;
  cursor: pointer;
    ${props => {

    switch (props.buttontype) {
      case "outline":
        return css`
      background-color: #fefefe;
      border:1px solid #DC5F00;
      color:#DC5F00;
    `
      case "primary":
        return css`
        background-color: #fefefe;
        border:1px solid #DBDBDB;
        color:#DBDBDB;
      `
      case "negative":
        return css`
      background-color: #DC5F00;
      border:1px solid #DC5F00;
      color:#fefefe;
    `
      default:
        return css`
        background-color: #fefefe;
        border:1px solid #DBDBDB;
        color:#DBDBDB;
      `
    };
  }
  }


  @media ${device.mobileL} {
      width: 100px;
      input{
        width: auto;
      }
  }
`


const FlexInputContainer = styled(InputContainer)`
  display:flex;
  align-items: center;
  width:auto;
  margin-right: 6px;
  & > label{
    display:block;
    margin-block-end: 0;
    margin-right: 48px;
  }
  & > input{
    width: 20px;
    height:20px;
    margin-right: 6px;
    cursor: pointer;
  }
`
const ShowTermsAndConditions = styled.h3`
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  color:#DC5F00;
  cursor: pointer;
`


const TermsWrapper = styled.div`
  display: flex;
  padding: 40px 70px;
  border-bottom: 1px solid #DBDBDB;
  margin-bottom: 40px;
  @media ${device.mobileL} {
    padding: 20px 0;
    flex-direction: column;
  }
`
const TermsTitle = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: ${fontWeight("semiBold")};
  width: 142px;
  span{
    color:#DC5F00;
  }
  @media ${device.mobileL} {
   margin-bottom: 16px;
  }
`


const TermsContainer = styled.div`
  width: 513px;
  @media ${device.mobileL} {
    width: 100%;
  }
`

const TermsInputLabel = styled(InputLabel)`
  font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    font-size: 14px;
  }
`


const TermsInputContainer = styled.div`
  position:relative;
  height: 25px;
  width: 25px;
  margin-right: 6px;
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
  }
`
const TermsInput = styled.input`
  position: absolute;
  opacity: 0;
  height: 25px;
  width: 25px;
  border:1px solid #DC5F00;
  z-index: 10;
  cursor: pointer;
  ~span:after{
    display: block;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  :checked ~ span{
    background-color: #DC5F00;
  }
  :checked ~ span:after{
    display: block;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
    ~span:after{
      left:6px;
      top: 2px;
    }
    :checked ~ span:after{
      left: 6px;
      top: 2px;
    }
  }

`
const CheckMark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  transition: all .4s ease;
  border-radius: 50%;
  :after{
    content: "";
    position: absolute;
    /* display: none; */
  }
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
  }
`

function Terms() {
  const [mobile, setMobile] = useState(null);
  const termsModal = useRecoilValue(termsModalState);
  const termsStateInfo = useRecoilValue(termsState);
  const setTermsState = useSetRecoilState(termsState);
  const setTermsModal = useSetRecoilState(termsModalState);
  const [agreement, setAgreement] = useState({
    totalAgreement: false,
    termsAndConditions: false,
    privacyPolicy: false,
    marketing: false,
  });




  const handleShowTemrs = (agreementType) => {
    setTermsModal((oldState) => {
      return {
        ...oldState,
        type: agreementType,
        scrollY: window.scrollY
      }
    }
    )
    window.scroll({ top: 0, behavior: "smooth" })
  }


  const handleAgreement = (e) => {
    const id = e.currentTarget.id;
    let tmp = termsStateInfo;
    if (id === "totalAgreement") {
      const checked = e.target.checked;
      tmp = {
        totalAgreement: checked,
        termsAndConditions: checked,
        privacyPolicy: checked,
        marketing: checked,
      }
    } else {
      if (e.currentTarget.checked === false) {
        tmp = {
          ...termsStateInfo,
          [id]: !termsStateInfo[id],
          totalAgreement: false,
        }
      } else {
        tmp = {
          ...termsStateInfo,
          [id]: !termsStateInfo[id],
        }
        if (tmp.termsAndConditions == true && tmp.privacyPolicy === true && tmp.marketing === true) {
          tmp = {
            ...termsStateInfo,
            totalAgreement: true,
            [id]: !termsStateInfo[id],
          }
        }
      }

    }
    setTermsState(tmp);
  }


  useEffect(() => {
    setMobile(isMobile);
  }, [])

  return (
    <TermsWrapper>
      <TermsTitle>
        이용약관동의
        <span>*</span>
      </TermsTitle>
      <TermsContainer>
        <FlexInputWrapper>
          <FlexInputContainer>
            <TermsInputContainer>

              <TermsInput name="totalAgreement" id="totalAgreement" type="checkbox" onChange={(e) => handleAgreement(e)} checked={termsStateInfo.totalAgreement} />
              <CheckMark></CheckMark>
            </TermsInputContainer>
            <TermsInputLabel htmlFor="totalAgreement">전체 약관동의</TermsInputLabel>
          </FlexInputContainer>
        </FlexInputWrapper>
        <FlexInputWrapper>
          <FlexInputContainer>
            <TermsInputContainer>

              <TermsInput id="termsAndConditions" name="termsAndConditions" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={termsStateInfo.termsAndConditions} />
              <CheckMark></CheckMark>
            </TermsInputContainer>
            <TermsInputLabel htmlFor="termsAndConditions" >이용약관 동의 <span>(필수)</span></TermsInputLabel>
          </FlexInputContainer>
          <ShowTermsAndConditions onClick={() => handleShowTemrs("privacy")}>{mobile ? "" : "약관보기"} &gt;</ShowTermsAndConditions>
        </FlexInputWrapper>
        <FlexInputWrapper>
          <FlexInputContainer>
            <TermsInputContainer>
              <TermsInput id="privacyPolicy" name="privacyPolicy" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={termsStateInfo.privacyPolicy} />
              <CheckMark></CheckMark>
            </TermsInputContainer>
            <TermsInputLabel htmlFor="privacyPolicy">개인정보처리방침 동의 <span>(필수)</span></TermsInputLabel>
          </FlexInputContainer>
          <ShowTermsAndConditions onClick={() => handleShowTemrs("terms")}>{mobile ? "" : "약관보기"} &gt;</ShowTermsAndConditions>
        </FlexInputWrapper>
        <FlexInputWrapper>
          <FlexInputContainer>
            <TermsInputContainer>
              <TermsInput id="marketing" name="marketing" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={termsStateInfo.marketing} />
              <CheckMark></CheckMark>
            </TermsInputContainer>
            <TermsInputLabel htmlFor="marketing">마케팅 정보이용 동의 <span>(선택)</span> </TermsInputLabel>
          </FlexInputContainer>
        </FlexInputWrapper>
      </TermsContainer>
      <TermsAgreement agreementType={termsModal.type}></TermsAgreement>
    </TermsWrapper>);
}

export default Terms;