import styled, { css } from 'styled-components'

import { customAxios } from '../../public/js/customAxios';
import AuthPhoneNumber from '../signup/AuthPhoneNumber';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Button, InputLabel, Input, fontWeight } from '../common/GlobalComponent';
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { authPhoneState } from '../../state/auth';
import { useQuery } from 'react-query'
import FindAuth from './FindAuth';
import { device } from '../common/GlobalComponent';

const FindUserInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:80px 0 150px;
    @media ${device.mobileL} {
      background-color: #fefefe;
      width: 100%;
      padding: 80px 24px 150px;
  }
`
const FindUserTitle = styled.div`
    font-size: 28px;
    line-height: 56px;
    font-weight: ${fontWeight("medium")};
    margin-bottom: 24px;
    @media ${device.mobileL} {
      font-size: 20px;
      font-weight: ${fontWeight("regular")};
  }
`

const FindUserInfoContainer = styled.div`
    width: 460px;
    height: auto;
    border-radius: 10px;
    box-shadow:  0 0 30px rgba(0,0,0,.05);
    padding:40px 48px;
    @media ${device.mobileL} {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-shadow:  none;
    padding:0px;
  }
`
const TabGroup = styled.ul`
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #DBDBDB;
    padding-bottom: -1px;
    ::after{
        content: "";
        position: absolute;
        bottom: -2px;
        width: 50%;
        height: 3px;
        left :0 ;
        background-color: #232323;
        transition: transform .3s ease;
       ${props => {
        return props.active === "idTab" ?
            css`
                transform: translate(0,0);
            `
            :
            css`
                transform: translate(100%,0);
            `
    }};
      
    }
`
const Tab = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 50%;
    /* border-bottom: ${props => {
        return props.active === props.id ? "3px solid #232323" : "none"
    }}; */
    padding: 16px 10px;
    cursor: pointer;
   
`
const FindWrapper = styled.div`
    border-top: none;
    padding-top: 60px;
    display: ${props => {
        return props.active === true ? "block" : "none"
    }};
`

const FindContainer = styled.div`
    margin-bottom: 30px;
    :last-of-type{
    margin-bottom: 40px;
    }
`


const AuthNoiceContainer = styled.div`
  margin-bottom: 32px;
`
const AuthNoice = styled.p`
  font-size: 16px;
  line-height: 22px;
  font-weight: ${fontWeight("regular")};
  text-align: center;
`

const FindButton = styled.button`

    width: 364px;
    height: 56px;
    border-radius: 12px;
    border:none;
    font-size: 16px;
    font-weight: ${fontWeight("semiBold")};
    background-color: #DC5F00;
    color:#fefefe;
    cursor: pointer;
    a{
        color:#fefefe;
    }
    @media ${device.mobileL} {
    width: 327px;
    font-weight: ${fontWeight("medium")};
  }

`


const Notice = styled.div`
    color:#DC5F00;
    padding-top: 5px;
    @media ${device.mobileL} {
        font-size: 14px;
  }
`
const IdInfo = styled.div`
    text-align: center;
    p{
        font-size: 18px;
        font-weight: ${fontWeight("medium")};
        margin-bottom: 20px;
    }
    span{
        display: block;
        margin-bottom: 40px;
        font-size: 15px;
        font-weight: ${fontWeight("regular")};

    }

`
const FindInput = styled.input`
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
    width: ${props => props.inAuth === true ? "261px" : "327px"};
     box-shadow:  none;
     padding:0px 24px;
    height: 48px;
     ::placeholder{
        font-size: 14px;
    }
  }
`

function FindUserInfo() {
    const authState = useRecoilValue(authPhoneState)
    const setAuthState = useSetRecoilState(authPhoneState)
    const [tabActive, setTabActive] = useState("idTab");
    const [idCheck, setIdCheck] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [userInfo, setUserInfo] = useState({
        userID: null,
        userEmail: null,
        userPhone: null,
    })
    const [newPassword, setNewPassword] = useState({
        password: null,
        confirmPassword: null,
    })
    const [passwordValidation, setPasswordValidation] = useState({
        validation: null,
        same: null,
    });
    const userPhone = authState.phoneNumber;
    const { refetch: idCheckRefechForPassword } = useQuery(['checkIDExistForPassword', userInfo], () => checkIDExistForPassword({ userInfo }), {
        enabled: false,
        onSuccess: (res) => {
            if (res.status === 200 && res.data.status === "Not exist") {
                alert("존재하지 않는 아이디(이메일)입니다.")
            } else if (res.data.status === "exist") {
                requestAuthPhone()
            }
        },
        onError: (error) => {
            console.error("Error Occured : ", error)
        }
    })
    const { refetch: idCheckRefechForID } = useQuery(['checkIDExistForID', userPhone], () => checkIDExistForID({ userPhone }), {
        enabled: false,
        onSuccess: (res) => {
            console.log(res);
            if (authState.authDone === true) {
                if (res.data.status === "exist") {
                    setUserInfo({
                        ...userInfo,
                        userID: res.data.data[0].UserEmail
                    })
                } else {
                    setUserInfo({
                        ...userInfo,
                        userID: null
                    })
                }
            }
        },
        onError: (error) => {
            console.error("Error Occured : ", error)
        }
    })
    const { refetch: newPasswordRefetch } = useQuery(['sumitNewPassword', newPassword, userInfo], () => sumitNewPassword({ newPassword, userInfo }), {
        enabled: false,
        onSuccess: (res) => {
            if (res.data.status === "success") {
                alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.")
                Router.push("/login")
            } else {
                alert("비밀번호 변경에 실패했습니다. 고객센터로 문의주세요.")
            }
        },
        onError: (error) => {
            alert("비밀번호 변경에 실패했습니다. 고객센터로 문의주세요.")
        }
    })

    const checkIDExistForPassword = async (obj) => {
        return await customAxios({
            method: "GET",
            params: { userEmail: obj.userInfo.userEmail },
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/searchid`,
        })
    }
    const checkIDExistForID = async (obj) => {
        return await customAxios({
            method: "GET",
            params: { userPhone: authState.phoneNumber },
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/searchid`,
        })
    }
    const sumitNewPassword = async (obj) => {

        return await customAxios({
            method: "POST",
            data: { ...obj.userInfo, userPassword: obj.newPassword.password },
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/setpassword`,
        })
    }
    const handleTab = (e) => {
        setTabActive(e.currentTarget.id);
        setAuthState({
            inAuth: false,
            authDone: false,
            authNumber: null,
            phoneNumber: null,
        })
        setUserInfo({
            ...userInfo,
            userID: null
        })
    }


    const handlePasswordValidation = (e) => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;
        const regExpPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

        if (value.length === 0) {
            setNewPassword({
                ...newPassword,
                [e.currentTarget.id]: value
            })
            setPasswordValidation({ ...passwordValidation, validation: null, same: null });
        }

        if (name === "password") {
            if (value.length < 8 || regExpPassword.test(value) === false) {
                setPasswordValidation({ ...passwordValidation, validation: false });
            } else {
                setPasswordValidation({ ...passwordValidation, validation: true });
            }
            setNewPassword({
                ...newPassword,
                [e.currentTarget.id]: value
            })
        } else {
            if (newPassword.password !== value) {
                setPasswordValidation({ ...passwordValidation, same: false });
            } else if (name === "confirmPassword") {
                setPasswordValidation({ ...passwordValidation, same: true });
            }
            setNewPassword({
                ...newPassword,
                [e.currentTarget.id]: value
            })
        }
    }

    useEffect(() => {
        console.log("newPassword", newPassword)
    }, [newPassword])

    useEffect(() => {
        if (authState.authDone === true) {
            idCheckRefechForID();
        }
        return () => {
        }
    }, [authState.authDone])


    useEffect(() => {
        Router.events.on("beforeHistoryChange", (path) => {
            setAuthState({
                inAuth: false,
                authDone: false,
                authNumber: null,
                phoneNumber: null,
            })
            setUserInfo({
                ...userInfo,
                userID: null
            })
        });
        Router.events.on("routeChangeComplete", (path) => {
            setAuthState({
                inAuth: false,
                authDone: false,
                authNumber: null,
                phoneNumber: null,
            })
            setUserInfo({
                ...userInfo,
                userID: null
            })
        });
        return () => {

        }
    }, [])

    const requestAuthPhone = async () => {

        if (authState.phoneNumber) {
            // authRequest();
            await customAxios({
                method: "GET",
                params: { userPhone: authState.phoneNumber, userName: authState.userName, userEmail: authState.userEmail },
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
    const handleAuthPhone = async () => {
        if (authState.authNumber) {
            await customAxios({
                method: "GET",
                params: { userAuth: authState.authNumber, userPhone: authState.phoneNumber },
                url: `${process.env.NEXT_PUBLIC_API_SERVER}/authphone/verify`,
            }).then((res) => {
                if (res.data.status === "success") {
                    alert("인증이 완료되었습니다.");
                    setAuthState((oldAuth) => {
                        return {
                            ...oldAuth,
                            inAuth: false,
                            authDone: true,
                            authNumber: null,
                        }
                    })
                } else if (res.data.status === "fail") {
                    alert("인증번호가 일치하지않습니다.");
                }
            });
        } else {
            alert("인증번호를 입력해주세요.");
        }
    };

    return (
        <FindUserInfoWrapper>
            <FindUserTitle>계정찾기</FindUserTitle>
            <FindUserInfoContainer >
                <TabGroup active={tabActive}>
                    <Tab id="idTab" onClick={handleTab} >아이디 찾기</Tab>
                    <Tab id="passwordTab" onClick={handleTab}>비밀번호 찾기</Tab>
                </TabGroup>
                <FindWrapper active={tabActive === "idTab" ? true : false}>
                    {authState.authDone === false &&
                        <>
                            <AuthNoiceContainer>
                                <AuthNoice>아이디를 잃어버리셨나요?</AuthNoice>
                                <AuthNoice>하단의 정보를 상세히 입력해주세요</AuthNoice>
                            </AuthNoiceContainer>
                            <FindAuth></FindAuth>
                        </>
                    }
                    {
                        authState.authDone === true && userInfo.userID && userInfo.userID?.length !== 0 &&
                        <IdInfo>
                            <p>{userInfo.userID}</p>
                            <span>고객님의 아이디(계정)을 찾았습니다.</span>
                            <FindButton><Link href="/login">로그인 하기</Link></FindButton>
                        </IdInfo>
                    }
                    {authState.authDone === true && !userInfo.userID &&
                        <IdInfo>
                            <span>귀하의 정보로 가입된 아이디(이메일)이 없습니다.</span>
                            <FindButton><Link href="/signup">회원가입 하기</Link></FindButton>
                        </IdInfo>
                    }
                    {authState.inAuth === false && authState.authDone == false &&
                        <FindButton type='button' onClick={requestAuthPhone}>인증번호 요청하기</FindButton>
                    }
                    {authState.inAuth === true && authState.authDone == false &&
                        <FindButton type='button' onClick={handleAuthPhone}>인증하기</FindButton>
                    }
                </FindWrapper>
                <FindWrapper active={tabActive === "passwordTab" ? true : false}>
                    {authState.authDone === false &&
                        <>
                            <AuthNoiceContainer>
                                <AuthNoice>비밀번호를 잃어버리셨나요?</AuthNoice>
                                <AuthNoice>하단의 정보를 상세히 입력해주세요</AuthNoice>
                            </AuthNoiceContainer>
                            <FindAuth findType={"password"}></FindAuth>
                        </>
                    }

                    {
                        authState.authDone === true &&
                        <>
                            <AuthNoiceContainer>
                                <AuthNoice>비밀번호를 재설정하세요</AuthNoice>
                            </AuthNoiceContainer>
                            <FindContainer>
                                <FindInput type="password" id="password" name="password" placeholder="비밀번호" onChange={handlePasswordValidation}  ></FindInput>
                                {passwordValidation.validation === false && newPassword.password.length !== 0 && <Notice>최소8자리 / 영문 대소문자, 숫자, 특수문자 조합</Notice>}
                            </FindContainer>
                            <FindContainer>
                                <FindInput type="password" id="confirmPassword" name="confirmPassword" placeholder="비밀번호 재입력" onChange={handlePasswordValidation}  ></FindInput>
                                {passwordValidation.same === false && newPassword.password.length !== 0 && <Notice>비밀번호가 일치하지 않습니다</Notice>}
                            </FindContainer>
                            <FindButton onClick={() => newPasswordRefetch()}>비밀번호 변경하기</FindButton>
                        </>
                    }
                    {authState.inAuth === false && authState.authDone == false &&
                        <FindButton type='button' onClick={idCheckRefechForPassword}>인증번호 요청하기</FindButton>
                    }
                    {authState.inAuth === true && authState.authDone == false &&
                        <FindButton type='button' onClick={handleAuthPhone}>인증하기</FindButton>
                    }
                </FindWrapper>
            </FindUserInfoContainer >
        </FindUserInfoWrapper>
    );
}

export default FindUserInfo;
