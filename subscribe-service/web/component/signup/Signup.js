import styled, { css } from "styled-components";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { MdDangerous, MdCheckCircle } from "react-icons/md";
import { customAxios } from '../../public/js/customAxios.js'
  ;
import AuthPhoneNumber from "./AuthPhoneNumber";
import { MdOutlineClose } from "react-icons/md";
import {
  Input,
  Button,
  Title,
  InputGroup,
  InputWrapper,
  InputContainer,
  InputLabel,
  fontWeight,
} from "../common/GlobalComponent";
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authPhoneState } from '../../state/auth';
import { termsModalState } from "state/signup.js";
import { device } from "../common/GlobalComponent";
import { isMobile } from "react-device-detect";
import Router from "next/router.js";
import TermsAgreement from "./TermsAgreement.js";

const SignupReg = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 793px;
  border-radius: 8px;
  font-weight: bold;
  padding: 80px 0 170px;
  @media ${device.mobileL} {
    width: 327px;
    padding: 80px 0 ;
  }
`;

const SignupContainer = styled.div`
  border-top:1px solid #232323;
  padding: 20px 70px 40px;
  border-bottom: 1px solid #707070;
  @media ${device.mobileL} {
    width: 327px;
    padding: 0 ;
  }
`

const SignupTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 0;
`

const RequireNotice = styled.p`
  text-align: right;
  margin-bottom: 10px;
  font-weight: ${fontWeight("regular")};
  span{
    color:#DC5F00;
  }
`
const SignupInputGroup = styled(InputGroup)`
  display: flex;
  input{
    width: 364px;
    height: 56px;
  }
  @media ${device.mobileL} {
    flex-direction: column;
    width: 327px;
    /* height: 72px; */
    /* margin-bottom: 12px; */
    margin: 16px 0;
    input{
      width: 100%;
    }
  }
  
`
const SignupInputWrapper = styled(InputWrapper)`
  width: auto;

  /* justify-content: flex-end; */
`

const SignupInputLabelContainer = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  @media ${device.mobileL} {
    width: 327px;
    height: 100%;
    /* margin-bottom: 24px; */
  }
`

const SignupInputLabel = styled.label`
    display: block;
    width: 142px;
    span{
      color:#DC5F00;
    }
  @media ${device.mobileL} {
   margin-bottom: 8px;
  }
`


const DaumPost = styled(DaumPostcode)`
  position: absolute;
  min-height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NoticeInfoContainer = styled.div`
  margin-bottom: 30px;

`

const NoticeInfo = styled.p`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: normal;
  text-align: left;
  color: #DC5F00;
  margin: 0 0 16px 0;
  margin-left: 150px;
  svg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  @media ${device.mobileL} {
    margin-left: 5px;
  }
`;

const CheckInfo = styled(NoticeInfo)`
  color: blueviolet;
`;

const DeleteInput = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

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

const SignupRegButton = styled(Button)`
  font-size: 16px;
  font-weight: ${fontWeight("bold")};
  width:364px;
  height: 56px;
  border-radius: 10px;
  margin:0 auto;
  @media ${device.mobileL} {
    width: 100%;
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
`



function Signup() {
  const [addressModal, setAddressModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [agreement, setAgreement] = useState({
    totalAgreement: false,
    termsAndConditions: false,
    privacyPolicy: false,
    marketing: false,
  });
  const [formData, setFromData] = useState({});
  const authState = useRecoilValue(authPhoneState)

  const [focusInput, setFoucsInput] = useState(null);
  const [mobile, setMobile] = useState(null);
  const termsModal = useRecoilValue(termsModalState);
  const setTermsModal = useSetRecoilState(termsModalState);
  const { refetch: idDuplicationCheckRefetch } = useQuery(['idDuplicationCheck', userEmail], () => idDuplicationCheck({ userEmail }), {
    enabled: false,
    onSuccess: (res) => {
      if (res.status === 200 && res.data.status === "Not exist") {
        setFromData({
          ...formData,
          "userEmail": {
            value: formData["userEmail"].value,
            validation: formData["userEmail"].validation,
            duplication: false,
          },
        });
        setUserEmail("");
      } else if (res.data.status === "exist") {
        setFromData({
          ...formData,
          "userEmail": {
            value: formData["userEmail"].value,
            validation: formData["userEmail"].validation,
            duplication: true,
          },
        });
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })

  const idDuplicationCheck = async (target) => {
    return await customAxios({
      method: "GET",
      params: { userEmail: target.userEmail },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/searchid`,
    })
  }


  const validationCheck = (target) => {
    const regExpEmail =
      /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
    const regExpKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    const regExpPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    const regExpSpecialCharacter =
      /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const regExpNumber = /[^0-9]/gi;
    const regExpId = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{4,20}$/;
    const regEmoji =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

    const value = target.value;
    const tmp = {
      value: value,
      validation: false,
    };

    switch (target.name) {
      case "id":
        if (regExpSpecialCharacter.test(value) || regEmoji.test(value)) {
          tmp.value = target.value.replace(regExpSpecialCharacter, "");
          // tmp.value = target.value.replace(regEmoji, "");
          tmp.validation = false;
        } else {
          tmp.validation =
            value.length < 4 || regExpId.test(value) === false ? false : true;
        }
        break;
      case "password":
        tmp.validation =
          value.length < 8 || regExpPassword.test(value) === false
            ? false
            : true;
        break;
      case "email":
        tmp.validation = regExpEmail.test(value) ? true : false;
        break;
      case "birthday":
        const birthYear = value.substr(0, 4);
        const birthMonth = value.substr(4, 2);
        const birtDAy = value.substr(6, 2);
        tmp.validation =
          !regExpNumber.test(value) && value.length === 8 ? true : false;

        if (value.length >= 8) {
          tmp.value = value.slice(0, 8);
          tmp.validation = true;
        }
        if (
          birthYear < 1900 ||
          birthMonth > 12 ||
          birthMonth < 1 ||
          birtDAy < 1 ||
          birtDAy > 31
        ) {
          tmp.validation = false;
        }
        break;
      default:
        tmp.validation = true;
    }
    return tmp;
  };
  const focusOutValidation = async (e) => {
    const target = e.currentTarget;
    if (target.name === "email") {
      setUserEmail(target.value);
    }
  };
  const handlePostcodeModal = () => {
    setAddressModal(true);
  };
  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const inputData = validationCheck(target);
    if (target.type !== "radio") {
      setFromData({
        ...formData,
        [target.id]: inputData,
      });
    } else {
      setFromData({
        ...formData,
        [target.name]: inputData,
      });
    }
  };
  const onCompletePostcodeMadal = (data) => {
    setFromData({
      ...formData,
      userAddress: { value: data.address, validation: true },
    });
    setAddressModal(false);
  };

  const handleSubmitFormData = async () => {
    if (authState.phoneNumber !== null) {
      formData["userPhone"] =
        { value: authState.phoneNumber, validation: true }
    }
    const signupData = {};
    for (let i = 0; i < inputProps.length; i++) {
      const element = inputProps[i];
      if (!formData[element.id] || formData[element.id]?.validation === false) {
        if (element.id === "userPhone" && authState.authDone === false) {
          alert("핸드폰 인증을 해주세요.");
        } else {
          alert(`${element.title} 정보를 정확히 입력해주세요.`);
        }
        return false;
      }
    }


    Object.keys(formData).forEach((key) => {
      signupData[key] = formData[key].value;
    });


    if (!signupData["userGender"]) {
      alert("성별을 선택 해주세요.");
      return false
    }

    if (agreement.totalAgreement === true) {
      signupData["termsAndConditionsAgreement"] = true;
      signupData["privacyPolicyAgreement"] = true;
      signupData["marketingAgreement"] = true;
    } else {
      if (agreement.termsAndConditions === false || agreement.privacyPolicyAgreement === false) {
        alert("필수이용약관에 동의해주세요.");
        return false;
      } else {
        signupData["termsAndConditionsAgreement"] = true;
        signupData["privacyPolicyAgreement"] = true;
        signupData["marketingAgreement"] = false;
      }
    }


    signupData['userType'] = "회원"

    await customAxios({
      method: "POST",
      data: signupData,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/create`,
    }).then((res) => {
      if (res.status === 200 && res.data.status === "success") {
        alert("회원가입이 완료되었습니다.");
        window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}/login`;
      } else if (res.data.status === "already") {
        alert("이미 가입된 회원정보입니다.");
      }
    });

  };

  const handleFocusInput = (index) => {
    setFoucsInput(index);
  };

  const handleDeleteInput = (id) => {
    let tmp = Object.entries(formData);
    if (formData[id]) {
      tmp = tmp.filter(([key, value]) => {
        return key !== id;
      });
    }
    setFromData(Object.fromEntries(tmp));
    setFoucsInput(null);
  };
  const handleAgreement = (e) => {
    const id = e.currentTarget.id;
    let tmp = agreement;
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
          ...agreement,
          [id]: !agreement[id],
          totalAgreement: false,
        }
      } else {
        tmp = {
          ...agreement,
          [id]: !agreement[id],
        }
        if (tmp.termsAndConditions == true && tmp.privacyPolicy === true && tmp.marketing === true) {
          tmp = {
            ...agreement,
            totalAgreement: true,
            [id]: !agreement[id],
          }
        }
      }

    }
    setAgreement(tmp);
  }

  const checkPassword = () => {

  }

  const handleShowTemrs = (agreementType) => {
    setTermsModal((oldState) => {
      return {
        ...oldState,
        type: agreementType,
        scrollY: window.scrollY
      }
    }
    )
    window.scroll({top : 0, behavior:"smooth"})
  }

  useEffect(() => {
    console.log('isExistPhoneNumber', authState.isExistPhoneNumber)

  }, [authState.isExistPhoneNumber])

  useEffect(() => {
    setMobile(isMobile);
  }, [])

  let inputProps = [
    {
      index: 0,
      name: "email",
      title: "이메일",
      id: "userEmail",
      type: "email",
      placeholder: "email@example.com",
      onChange: handleInputChange,
      warn: "이메일을 정확하게 입력해주세요.",
      button: {
        enabled: true,
        text: "중복확인",
        status: "enable",
        buttontype: "outline",
        onClick: idDuplicationCheckRefetch
      }
    },
    {
      index: 1,
      name: "password",
      title: "비밀번호",
      id: "userPassword",
      type: "password",
      placeholder: "8~16자리 / 영문 대소문자, 숫자, 특수문자 조합",
      onChange: handleInputChange,
      check: "사용 가능한 패스워드입니다!",
      maxLength: "16",
      warn: "8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요.",
    },

    // {
    //   index: 3,
    //   name: "passwordConfirm",
    //   title: "비밀번호 확인",
    //   id: "userPasswordConfirm",
    //   type: "password",
    //   placeholder: "8~16자리 / 영문 대소문자, 숫자, 특수문자 조합",
    //   onChange: handleInputChange,
    //   onBlur: checkPassword,
    //   maxLength: "16",
    //   warn: "8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요.",
    // },
    {
      index: 2,
      name: "name",
      title: "이름",
      id: "userName",
      type: "text",
      placeholder: "이름을 입력해 주세요",
      onChange: handleInputChange,
    },
    {
      index: 3,
      name: "birthday",
      title: "생년월일",
      id: "birthday",
      type: "number",
      placeholder: "YYYY / MM / DD",
      onChange: handleInputChange,
      warn: "생년월일을 정확하게 입력해주세요.",

    },
    {
      index: 4,
      name: "phone",
      title: "핸드폰",
      id: "userPhone",
      type: "number",
      placeholder: "숫자만 입력해주세요",
      onChange: handleInputChange,
      warn: "인증번호를 정확하게 입력해주세요.",

    },
  ];

  return (
    <SignupReg>
      <SignupWrapper>
        <SignupTitle>회원가입</SignupTitle>
        <RequireNotice><span>*</span>필수입력사항</RequireNotice>
        <SignupContainer>
          {inputProps &&
            inputProps.map((props, index) => {
              return (
                <div key={`signupInput${props.index}`}>
                  <SignupInputGroup >
                    {props.title && (
                      <SignupInputLabelContainer>
                        <SignupInputLabel htmlFor={props.name}>{props.title}<span>*</span></SignupInputLabel>
                      </SignupInputLabelContainer>
                    )}
                    {props.name !== "phone" && (
                      <SignupInputWrapper>
                        <InputContainer>
                          <Input
                            value={formData[props.id]?.value || ""}
                            {...props}
                            onFocus={() => handleFocusInput(index)}
                          ></Input>
                          {focusInput === index && (
                            <DeleteInput>
                              <MdOutlineClose
                                onClick={() => handleDeleteInput(props.id)}
                              ></MdOutlineClose>
                            </DeleteInput>
                          )}
                        </InputContainer>
                        {props.button && props.button.status === "enable" && (
                          <SignupButton
                            type="button"
                            buttontype={props.button.buttontype}
                            onClick={props.button.onClick}
                            ref={props.button.ref ? props.button.ref : null}
                          >
                            {props.button.text}
                          </SignupButton>
                        )}

                      </SignupInputWrapper>
                    )}
                    {props.name === "phone" && (
                      <AuthPhoneNumber
                        duplicate={true}
                      ></AuthPhoneNumber>
                    )}
                  </SignupInputGroup>
                  <NoticeInfoContainer>


                    {formData[props.id] &&
                      formData[props.id].validation === false &&
                      props.warn && (
                        <NoticeInfo>
                          <MdDangerous></MdDangerous>
                          {props.warn}
                        </NoticeInfo>
                      )}

                    {props.name === "password" &&
                      formData[props.id]?.validation === true &&
                      !formData[props.id]?.duplication && (
                        <CheckInfo>
                          <MdCheckCircle> </MdCheckCircle>
                          {props.check}
                        </CheckInfo>
                      )}
                    {formData[props.id]?.duplication &&
                      formData[props.id].validation === true &&
                      formData[props.id]?.duplication === true && (
                        <NoticeInfo>
                          <MdDangerous></MdDangerous>아이디가 중복되었습니다.
                        </NoticeInfo>
                      )}
                    {props.name === "email" &&
                      formData[props.id]?.validation === true &&
                      formData[props.id]?.duplication === false && (
                        <CheckInfo>
                          <MdCheckCircle></MdCheckCircle>사용가능한 아이디입니다.
                        </CheckInfo>
                      )}
                  </NoticeInfoContainer>
                </div>
              );
            })}
          <SignupInputGroup>
            <SignupInputLabel >성별</SignupInputLabel>
            <SignupInputWrapper>
              <FlexInputContainer>
                <Input id="male" name="userGender" type="radio" value="male" onChange={handleInputChange} />
                <InputLabel htmlFor="male">남자</InputLabel>
                <Input id="female" name="userGender" type="radio" value="female" onChange={handleInputChange} />
                <InputLabel htmlFor="female">여자</InputLabel>
              </FlexInputContainer>
            </SignupInputWrapper>
          </SignupInputGroup>
        </SignupContainer>
        <TermsWrapper>
          <TermsTitle>
            이용약관동의
            <span>*</span>
          </TermsTitle>
          <TermsContainer>
            <FlexInputWrapper>
              <FlexInputContainer>
                <Input id="totalAgreement" type="checkbox" onChange={(e) => handleAgreement(e)} checked={agreement.totalAgreement} />
                <TermsInputLabel htmlFor="male">전체 약관동의</TermsInputLabel>
              </FlexInputContainer>
            </FlexInputWrapper>
            <FlexInputWrapper>
              <FlexInputContainer>
                <Input id="termsAndConditions" name="agreement" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={agreement.termsAndConditions} />
                <TermsInputLabel htmlFor="female" >이용약관 동의 <span>(필수)</span></TermsInputLabel>
              </FlexInputContainer>
              <ShowTermsAndConditions onClick={() => handleShowTemrs("privacy")}>{mobile ? "" : "약관보기"} &gt;</ShowTermsAndConditions>
            </FlexInputWrapper>
            <FlexInputWrapper>
              <FlexInputContainer>
                <Input id="privacyPolicy" name="agreement" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={agreement.privacyPolicy} />
                <TermsInputLabel htmlFor="female">개인정보처리방침 동의 <span>(필수)</span></TermsInputLabel>
              </FlexInputContainer>
              <ShowTermsAndConditions onClick={() => handleShowTemrs("terms")}>{mobile ? "" : "약관보기"} &gt;</ShowTermsAndConditions>
            </FlexInputWrapper>
            <FlexInputWrapper>
              <FlexInputContainer>
                <Input id="marketing" name="agreement" type="checkbox" value="1" onChange={(e) => handleAgreement(e)} checked={agreement.marketing} />
                <TermsInputLabel htmlFor="female">마케팅 정보이용 동의 <span>(선택)</span> </TermsInputLabel>
              </FlexInputContainer>
            </FlexInputWrapper>
          </TermsContainer>
        </TermsWrapper>
        <SignupRegButton type="button" onClick={handleSubmitFormData}>
          가입하기
        </SignupRegButton>
        {addressModal === true && (
          <div>
            <DaumPost onComplete={onCompletePostcodeMadal}></DaumPost>
          </div>
        )}
      </SignupWrapper>
    </SignupReg>
  );
}

export default Signup;
