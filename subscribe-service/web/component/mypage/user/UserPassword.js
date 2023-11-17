import styled from "styled-components";
import { useQuery } from "react-query";
import { customAxios } from "../../../public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mypageUserPasswordState } from "../../../state/mypage";
import { Button, InputGroup, InputLabel, Input, Notice } from "../../common/GlobalComponent";
import { useEffect } from "react";


const UserPasswordContainer = styled.div`
  `
const PasswordForm = styled.form``

function UserPassword() {
  const regExpPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  const mypageUserPasswordStateInfo = useRecoilValue(mypageUserPasswordState)
  const setMypageUserPasswordState = useSetRecoilState(mypageUserPasswordState)
  const { refetch: setUserPasswordRefetch } = useQuery("setUserPassword", () => setUserPassword(mypageUserPasswordStateInfo), {
    enabled: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data
      if (response.status === "success") {
        alert("비밀번호가 정상적으로 변경되었습니다.")
        location.href = "/mypage"
      } else if (response.error === "wrong password") {
        alert("현재 비밀번호 틀렸습니다. 비밀번호를 올바르게 입력해주세요.")
      } else {
        alert("비밀번호 변경에 실패했습니다.")
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)

    }
  })

  const setUserPassword = async (mypageUserPasswordStateInfo) => {
    return await customAxios({
      method: "POST",
      withCredentials: true,
      data: {
        currentPassword: mypageUserPasswordStateInfo.currentPassword,
        userPassword: mypageUserPasswordStateInfo.userPassword
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/setnewpassword`,
    })
  }

  const handlePasswordInput = (e) => {
    const target = e.currentTarget;


    if (
      target.name === "userPassword"
      && (target.value.length < 8
        || regExpPassword.test(target.value) === false)) {
      setMypageUserPasswordState((oldState) => {
        return {
          ...oldState,
          validation: false
        }
      })
    } else {
      setMypageUserPasswordState((oldState) => {
        return {
          ...oldState,
          validation: true
        }
      })
    }


    setMypageUserPasswordState((oldState) => {
      return {
        ...oldState,
        [target.name]: target.value
      }
    })



  }

  const handleChangePassword = () => {
    if (mypageUserPasswordStateInfo.duplicated === true) {
      alert("현재 비밀번호와 새 비밀번호가 동일합니다. 새 비밀번호를 다시 입력해주세요.");
      return false;
    } else if (
      mypageUserPasswordStateInfo.currentPassword?.length === 0
      || mypageUserPasswordStateInfo.userPassword?.length === 0
      || !mypageUserPasswordStateInfo.currentPassword
      || !mypageUserPasswordStateInfo.userPassword) {
      alert("비밀번호를 입력해주세요.")
    }

    if (mypageUserPasswordStateInfo.validation === false) {
      alert("새 비밀번호를 올바르게 입력해주세요.")
      return false
    }

    setUserPasswordRefetch();
  }
  useEffect(() => {
    if (
      mypageUserPasswordStateInfo.currentPassword === mypageUserPasswordStateInfo.userPassword
      && mypageUserPasswordStateInfo.currentPassword?.length !== 0
      && mypageUserPasswordStateInfo.userPassword?.length !== 0
      && mypageUserPasswordStateInfo.currentPassword
      && mypageUserPasswordStateInfo.userPassword
    ) {
      setMypageUserPasswordState((oldState) => {
        return {
          ...oldState,
          duplicated: true
        }
      })
    } else {
      setMypageUserPasswordState((oldState) => {
        return {
          ...oldState,
          duplicated: false
        }
      })
    }
  }, [mypageUserPasswordStateInfo.currentPassword, mypageUserPasswordStateInfo.userPassword])

  return (
    <UserPasswordContainer>
      <PasswordForm>
        <InputGroup>
          <InputLabel>현재 비밀번호</InputLabel>
          <Input id="currentPassword" name="currentPassword" type="password" onChange={handlePasswordInput} autoComplete="off"></Input>
        </InputGroup>
        <InputGroup>
          <InputLabel>새 비밀번호</InputLabel>
          <Input id="userPassword" name="userPassword" type="password" onChange={handlePasswordInput} autoComplete="off"></Input>
        </InputGroup>
        {mypageUserPasswordStateInfo.duplicated === true && <Notice>*현재 비밀번호와 동일합니다.</Notice>}
        {mypageUserPasswordStateInfo.validation === false && <Notice>*8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요.</Notice>}

        <Button type="button" onClick={handleChangePassword} >비밀번호 변경하기</Button>
      </PasswordForm>
    </UserPasswordContainer>
  );
}

export default UserPassword;