import styled, { css } from "styled-components";
import { fontWeight, device } from "component/common/GlobalComponent";
import Image from "next/image";
import Router from "next/router";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import AuthPhoneNumber from "component/signup/AuthPhoneNumber";
import WithdrawModal from "./WithdrawModal";
import { common } from "public/js/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authPhoneState } from "state/auth";
import { isMobile } from "react-device-detect";
import { withdrawState } from "state/user";
import MypageTitle from "../MypageTitle";

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 142px 0px;
  height: 100%;
  @media ${device.mobileL} {
    padding-top: 80px;
    margin: 0px 24px ;
  }

`
const UserInfoContainer = styled.div`
  width: 793px;
  @media ${device.mobileL} {
   width: 100%;
  }

`

const UserInfoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 67px;
  @media ${device.mobileL} {
   margin-bottom: 38px;
  }
`



const UserInfoInputGroupWrapper = styled.div`
  padding: 20px 68px 40px;
  border-bottom: 1px solid #707070;
  @media ${device.mobileL} {
    border:none;
    padding: 0;
  }
`
const UserInfoInputGroupContainer = styled.div`
  margin-bottom: 30px;
  @media ${device.mobileL} {
    margin-bottom: 20px;
  }
`

const UserInfoInputGroup = styled.div`
  display: flex;
  @media ${device.mobileL} {
   flex-direction: column;
  }
`

const UserInfoInputLabelContainer = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  @media ${device.mobileL} {
    height: 100%;
    margin-bottom: 8px;
  }
`

const UserInfoInputLabel = styled.label`
  font-size: 16px;
  line-height: 22px;
  font-weight: ${fontWeight("semiBold")};
  width: 142px;
  span{
    color:#DC5F00;
  }
  @media ${device.mobileL} {
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
  }
`

const UserInfoInputWrapper = styled.div`
  width: 100%;
  
`
const UserInfoInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media ${device.mobileL} {
    margin-bottom: 0px;
  }
`

const UserInfoInput = styled.input`
  width: ${props => props.wide === true ? "100%" : "364px"};
  height: 48px;
  border: 1px solid #DBDBDB;
  border-radius: 5px;
  padding: 0 10px;
  outline-color: #DC5F00;
  ::placeholder{
    font-size: 16px;
    font-weight: ${fontWeight("regular")};
  }
  ${props => {
    return props.readOnly === true ?
      css`
        background-color : #F1F1F5;
        outline: none;
        `
      :
      ''
  }}

@media ${device.mobileL} {
  font-size: 14px;
    width: ${props => props.wide === true ? "100%" : "100%"};
    ::placeholder{
      font-size: 14px;
      font-weight: ${fontWeight("regular")};
    }
}
`

const UserInfoRadioContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap:wrap;
  label{
    margin-right:48px;
  }
  @media ${device.mobileL} {
      font-size: 14px;
   }
`

const UserInfoRadio = styled.input`
    width: 20px;
    height: 20px;
    border: 1px solid  #BABABA;
    border-radius: 50%;
    margin-right: 6px;
    appearance: none;
    vertical-align: middle;
    cursor: pointer;
    :checked{
      position: relative;
      background-color: #DC5F00;
      border: none;
    }
    :checked::after{
      content: '';
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 12px;
      height: 12px;
      background-color: #DC5F00;
      border: 2px solid #fefefe;
      border-radius: 50%;
    }
   
`

const UserInfoButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 364px;
  margin: 40px  auto 0;
  @media ${device.mobileL} {
      width: 100%;
      align-items: flex-end;
      flex-direction: column;
   }
`

const UserInfoButton = styled.button`
  width: 177px;
  height: 56px;
  font-size: 16px;
  font-weight: ${fontWeight("bold")};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  ${props => {
    return props.buttonType !== "outline" ?
      css`
    background-color: #DC5F00;
    color:#fefefe;
  `
      :
      css`
    background-color: #fefefe;
    color:##767676;
    border: 1px solid #767676;
  `}
  }

@media ${device.mobileL} {
  font-size:14px;
  ${props => {
    return props.buttonType !== "outline" ?
      css`
      background-color: #DC5F00;
      color:#fefefe;
      width: 100%;
      font-size: ${fontWeight("medium")};
    `
      :
      css`
      background-color: #fefefe;
      color:#767676;
      border: none;
      width:fit-content ;
      height:fit-content;
      margin-bottom:10px;
      font-size: ${fontWeight("regular")};
    `}
  }
}

`




const UserInfoInputNotice = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  color:#DC5F00;
  margin-top: 4px;
  padding-left: 10px;
  @media ${device.mobileL} {
      font-size:14px;
      padding-left: 10px;
  }
`



function UserInfo() {
  const [formData, setFromData] = useState({});
  const authPhoneStateInfo = useRecoilValue(authPhoneState);
  const [mobile, setMobile] = useState(null);
  const withdrawStateInfo = useRecoilValue(withdrawState);
  const setWithdrawState = useSetRecoilState(withdrawState)



  const getSubscribeList = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        statusCode: "normal"
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/list`,
    });
  };


  const updateUserInfo = async () => {
    let signupData = {};

    Object.keys(formData).forEach((key) => {
      console.log('key', key)
      signupData[key] = formData[key].value;
    });


    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: signupData,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/update`,
    });
  };
  const getUserInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    });
  };

  const { refetch: getSubscribeListRefetch } = useQuery("mypageUserInfo_getSubscribeList", getSubscribeList, {
    enabled: false,

    onSuccess: (res) => {
      const response = res.data
      if (response.data.length !== 0) {
        setWithdrawState((oldState) => {
          return {
            ...oldState,
            modalActive: true,
          }
        });
      } else {
        Router.push(`/mypage/user/withdraw/${Router.query.userNo}`)
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })


  const { refetch: updateUserInfoRefetch } = useQuery("updateUserInfo", updateUserInfo, {
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data
      if (response.status === "fail") {
        alert("현재 비밀번호가 틀렸습니다.");
      } else {
        alert("정상적으로 변경되었습니다.");
        location.href = `/mypage/user/${Router.query.userNo}`
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })


  useQuery('getUserInfo', getUserInfo, {
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    onSuccess: (res) => {
      console.log('res.data.data', res.data.data)
      setFromData({
        ...formData,
        userNo: { value: res.data.data.UserNo, validation: true },
        userEmail: { value: res.data.data.UserEmail, validation: true },
        userName: { value: res.data.data.UserName, validation: true },
        userGender: { value: res.data.data.UserGender, validation: true },
        birthDay: { value: res.data.data.BirthDay.split(" ")[0].replace(/[^0-9]/g, ""), validation: true },
        userType: { value: res.data.data.UserType }
      });
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })
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

    if (value.length === 0) {
      return { value: value, validation: null };
    }
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
      case "recommendCode":
        tmp.validation = null;
        break;
      default:
        tmp.validation = true;
    }
    return tmp;
  };

  const handleInputChange = (e) => {
    const target = e.currentTarget;
    const inputData = validationCheck(target);

    if (target.name === "confirmpassword") {
      const check = target.value === formData.userPassword.value
      setFromData({
        ...formData,
        userPassword: {
          ...formData.userPassword,
          same: check,
        },
      });
    } else if (target.name === "password") {
      if (formData.userType.value == "회원") {
        const check = target.value === formData.nowPassword.value
        setFromData({
          ...formData,
          userPassword: {
            ...inputData,
            sameBefore: check,
          },
        });
      } else {
        setFromData({
          ...formData,
          userPassword: {
            ...inputData,
            sameBefore: false,
          },
        });
      }

    } else if (target.type !== "radio") {
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


  const handleUpdateUserInfo = () => {

    updateUserInfoRefetch()
  }

  const handleWithdrawal = () => {
    getSubscribeListRefetch();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }


  useEffect(() => {
    if (authPhoneStateInfo.authDone === true && authPhoneStateInfo.phoneNumber) {
      setFromData({
        ...formData,
        userPhone: {
          value: authPhoneStateInfo.phoneNumber,
          validation: true,
        },
      });
    }
  }, [authPhoneStateInfo])

  useEffect(() => {
    setMobile(isMobile)
  }, [])



  return (
    <UserInfoWrapper>
      <UserInfoContainer>
        <MypageTitle url={"/mypage"} title={"회원정보수정"} ></MypageTitle>
        <UserInfoInputGroupWrapper>
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="email">아이디</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoInputWrapper>
                <UserInfoInputContainer>
                  <UserInfoInput
                    name="email"
                    title="이메일"
                    id="userEmail"
                    type="email"
                    onChange={handleInputChange}
                    value={formData.userEmail?.value || ""}
                    readOnly
                  ></UserInfoInput>
                </UserInfoInputContainer>
              </UserInfoInputWrapper>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
          {formData.userType?.value === "회원" &&
            <UserInfoInputGroupContainer>
              <UserInfoInputGroup>
                <UserInfoInputLabelContainer>
                  <UserInfoInputLabel htmlFor="nowPassword">현재 비밀번호</UserInfoInputLabel>
                </UserInfoInputLabelContainer>
                <UserInfoInputWrapper>
                  <UserInfoInputContainer>
                    <UserInfoInput
                      name="nowPassword"
                      title="비밀번호"
                      id="nowPassword"
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      onChange={handleInputChange}
                    ></UserInfoInput>
                  </UserInfoInputContainer>
                  {/* {formData.Password?.validation === false &&
                  <UserInfoInputNotice>* 8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요</UserInfoInputNotice>
                } */}
                </UserInfoInputWrapper>
              </UserInfoInputGroup>
            </UserInfoInputGroupContainer>
          }
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="password">새 비밀번호</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoInputWrapper>
                <UserInfoInputContainer>
                  <UserInfoInput
                    name="password"
                    title="비밀번호"
                    id="userPassword"
                    type="password"
                    placeholder="새 비밀번호를 입력해 주세요"
                    onChange={handleInputChange}
                  ></UserInfoInput>
                </UserInfoInputContainer>
                {formData.userPassword?.sameBefore === true &&
                  <UserInfoInputNotice>* 현재 비밀번호와 동일합니다.</UserInfoInputNotice>
                }
                {formData.userPassword?.validation === false &&
                  <UserInfoInputNotice>* 8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요</UserInfoInputNotice>
                }
              </UserInfoInputWrapper>

            </UserInfoInputGroup>

          </UserInfoInputGroupContainer>

          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="confirmpassword">새 비밀번호 확인</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoInputWrapper>
                <UserInfoInputContainer>
                  <UserInfoInput
                    name="confirmpassword"
                    title="비밀번호"
                    id="userConfirmPassword"
                    type="password"
                    placeholder="새 비밀번호를 다시 입력해 주세요"
                    onChange={handleInputChange}
                  ></UserInfoInput>
                </UserInfoInputContainer>
                {formData.userPassword?.same === false && formData.userPassword?.sameBefore === false &&
                  <UserInfoInputNotice>동일한 비밀번호를 입력해주세요</UserInfoInputNotice>
                }
              </UserInfoInputWrapper>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="name">이름</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoInput
                name="name"
                title="이름"
                id="userName"
                type="text"
                placeholder="이름을 입력해 주세요"
                value={formData.userName?.value || ""}
                readOnly
              ></UserInfoInput>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="phone">휴대폰</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <AuthPhoneNumber duplicate={true} text={"다른번호 인증"}></AuthPhoneNumber>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel>성별</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoRadioContainer>
                <UserInfoRadio
                  id="male"
                  name="userGender"
                  type="radio"
                  value="male"
                  onChange={handleInputChange}
                  checked={formData.userGender?.value === "male" ? true : false}
                />
                <label htmlFor="male">남자</label>
                <UserInfoRadio
                  id="female"
                  name="userGender"
                  type="radio"
                  value="female"
                  onChange={handleInputChange}
                  checked={formData.userGender?.value === "female" ? true : false}
                />
                <label htmlFor="female">여자</label>
              </UserInfoRadioContainer>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
          <UserInfoInputGroupContainer>
            <UserInfoInputGroup>
              <UserInfoInputLabelContainer>
                <UserInfoInputLabel htmlFor="name">생년월일</UserInfoInputLabel>
              </UserInfoInputLabelContainer>
              <UserInfoInput
                name="birthday"
                title="생년월일"
                id="birthday"
                type="number"
                placeholder="YYYY / MM / DD"
                value={formData.birthDay?.value || ""}
                readOnly
              ></UserInfoInput>
            </UserInfoInputGroup>
          </UserInfoInputGroupContainer>
        </UserInfoInputGroupWrapper>
      </UserInfoContainer>
      <UserInfoButtonGroup>
        <UserInfoButton buttonType={"outline"} onClick={handleWithdrawal}>탈퇴하기{mobile ? `>` : ""}</UserInfoButton>
        <UserInfoButton onClick={handleUpdateUserInfo}>정보수정</UserInfoButton>
      </UserInfoButtonGroup>
      {
        withdrawStateInfo.modalActive === true &&
        <WithdrawModal></WithdrawModal>
      }
    </UserInfoWrapper>
  );
}

export default UserInfo;