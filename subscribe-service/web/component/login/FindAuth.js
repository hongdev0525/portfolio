import styled from "styled-components";
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { authPhoneState } from '../../state/auth.js'
import { fontWeight, device } from "component/common/GlobalComponent.js";
import Timer from "component/common/Timer.js";
import { useEffect } from "react";
import { customAxios } from "public/js/customAxios.js";
const FindAuthWrapper = styled.div`
  margin-bottom: 42px;
`
const FindAuthContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    @media ${device.mobileL} {
      width: 100%;
      justify-content: center;
  }
  
`

const InputContainer = styled.div`
    position: relative;
    width: 100%;
    div{
      position: absolute;
      right:15px;
      top:50%;
      transform: translate(0,-50%);
      color:#DC5F00;
      font-weight: ${fontWeight("regular")};
      p{
        color:#DC5F00;
        margin-right: 10px;
      }
    }
    @media ${device.mobileL} {
      display: flex;
      justify-content: space-between;
      div{
      right:20px;
    }
  }

`
const FindAuthInput = styled.input`
  width: ${props => props.inAuth === true ? "261px" : "100%"};
  border: none;
  border-bottom: 1px solid #DBDBDB;
  height: 56px;
  padding: 0 10px;
  outline:none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  ::placeholder{
    font-size: 16px;
    color:#767676;
    font-weight: ${fontWeight("regular")};
  }
  :focus{
    border-bottom: 1px solid #232323;
  }
  @media ${device.mobileL} {
    width: ${props => props.inAuth === true ? "226px" : "327px"};
    box-shadow:  none;
    background-color :  #F3F3F7;
    border-bottom: none;
    height: 48px;
    ::placeholder{
      font-size: 14px;
      color:#767676;
      font-weight: ${fontWeight("regular")};
    }
  }
`

const AuthButton = styled.button`
  width: 91px;
  height: 56px;
  background-color: #fefefe;
  border-radius: 5px;
  border: 1px solid #DBDBDB;
  font-size: 16px;
  font-weight: ${fontWeight("regular")};
  color:#767676;
  margin-left: 12px;
  cursor: pointer;
  @media ${device.mobileL} {
    margin-left: 0px;
    width: 100px;
    justify-content: center;
  }
`

function FindAuth({ findType }) {
  const setAuthState = useSetRecoilState(authPhoneState);
  const authState = useRecoilValue(authPhoneState);

  const handlePhoneInputChange = (e) => {
    console.log('first', e.currentTarget.name)
    setAuthState((oldState) => {
      return {
        ...oldState,
        [e.currentTarget.name]: e.currentTarget.value
      }
    })
  }

  const requestAuthPhone = async () => {

    if (authState.phoneNumber) {
      // authRequest();
      await customAxios({
        method: "GET",
        params: { userPhone: authState.phoneNumber, userName: authState.userName },
        url: `${process.env.NEXT_PUBLIC_API_SERVER}/authphone/sendcodewithname`,
      }).then(res => {
        if (res.data.status === "not exist") {
          alert("회원정보가 존재하지 않습니다.");
          setAuthState((oldAuth) => {
            return {
              ...oldAuth,
              inAuth: false,
              authDone: false,
              authNumber: null,
              phoneNumber: authState.phoneNumber
            }
          })
        } else if (res.data.status === "success") {
          setAuthState((oldAuth) => {
            return {
              ...oldAuth,
              inAuth: true,
            }
          })
        }

      });
    } else {
      alert("핸드폰번호를 올바르게 입력해주세요.");
      return false;
    }
  }

  useEffect(() => {
    console.log('authState', authState)

  }, [authState])

  return (
    <FindAuthWrapper>
      <FindAuthContainer>
        {findType === "password" ?
          <FindAuthInput type="text" name="userEmail" placeholder="이메일을 입력해주세요" onChange={handlePhoneInputChange}></FindAuthInput>
          :
          <FindAuthInput type="text" name="userName" placeholder="이름을 입해주세요" onChange={handlePhoneInputChange}></FindAuthInput>
        }
      </FindAuthContainer>
      <FindAuthContainer>
        {authState.inAuth === false && authState.authDone === false &&
          <InputContainer >
            <FindAuthInput name="phoneNumber" type="number" placeholder="휴대폰 번호를 입력해주세요 (-제외)" onChange={handlePhoneInputChange}></FindAuthInput>
          </InputContainer>
        }
        {authState.inAuth === true &&
          <>
            <InputContainer >
              <FindAuthInput name="authNumber" inAuth={authState.inAuth} type="number" placeholder="인증번호를 입력해주세요" onChange={handlePhoneInputChange}></FindAuthInput>
              <Timer hoursMinSecs={{ hours: 0, minutes: 3, seconds: 0 }}></Timer>
            </InputContainer>
            <AuthButton onClick={requestAuthPhone}>재발송</AuthButton>
          </>
        }
      </FindAuthContainer>
    </FindAuthWrapper >
  );
}

export default FindAuth;