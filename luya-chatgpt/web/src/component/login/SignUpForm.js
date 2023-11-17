"use client";
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '@/state/userState';
import { CommonButton, CommonInput } from '../common/CommonComponent';
import { authPhoneState } from '@/state/auth';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import useAlert from '@/utils/useAlert/UseAlert';
import useCustomAxios from '@/utils/UseCustomAxios';
import AuthPhoneNumber from './AuthPhoneNumber';
import styled from 'styled-components';

const SignUpFormContainer = styled.div`
  padding-top: 30px;
`;

const SignUpLabel = styled.label`
  display: block;
  margin-bottom: 18px;

  p {
    margin-bottom: 12px;
  }
`;

const SignUpInput = styled(CommonInput)`
 
`;

const IdInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const IdDuplicationButton = styled(CommonButton)`
   width:auto;
  height:50px;
  border-radius: 5px;
  margin-left: 12px;
  font-size: 14px;
  cursor: pointer;
`
const GenderContainer = styled.div`
  display: flex;
  input[type='radio'] {
    margin-right: 8px;
  }
  label {
    margin-right: 8px;
  }

  input[type='radio'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-right: 6px;
    outline: none;
    cursor: pointer;
  }

  input[type='radio']:checked {
    background-color: var(--color-set05);
  }
  
`;

const SingUpButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`

const Notice = styled.p`
  width: 320px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  color:var(--color-set05);
`



const SignUpForm = () => {
  const axios = useCustomAxios();
  const alertHook = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: { value: '', validation: '' },
    email: { value: '', validation: '', duplication: '' },
    // birthday: { value: '', validation: '' },
    gender: { value: '', validation: '' },
    phoneNumber: { value: '', validation: '' },
    password: { value: '', validation: '' },
    passwordConfirm: { value: '', validation: '' },
  });
  const authPhoneStateInfo = useRecoilValue(authPhoneState);
  const [user, setUser] = useRecoilState(userState);
  const [passwordAlert, setPasswordAlert] = useState('');
  const [passwordConfirmAlert, setPasswordConfirmAlert] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');


  // 서버에서 아이디 중복 확인을 하는 함수
  const checkIdDuplicate = async (id) => {
    const email = formData.email.value;
    return await axios({
      method: "GET",
      withCredentials: true,
      params: { email },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/checkId`,
    })
  }

  const { refetch: checkIdDuplicateRefetch } = useQuery('checkIdDuplicate', checkIdDuplicate, {
    enabled: false,
    onSuccess: (res) => {
      if (res.data.status === "Not exist") {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setFormData((prevFormData) => ({
          ...prevFormData,
          "email": { ...prevFormData["email"], duplication: false },
        }));
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
      }
    },
    onError: (error) => {
      alertHook.alert("아이디 중복확인에 실패했습니다. 다시 시도해주세요.", () => router.replace('/signup'));
      console.error('중복확인 실패:', error);
    },
  });





  const signup = async () => {
    return await axios({
      method: "POST",
      withCredentials: true,
      data: formData,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/signup/create`,
    })
  }


  const { refetch: signupRefetch } = useQuery('signup', signup, {
    enabled: false,
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "not found") {
        alertHook.alert("아이디가 존재하지 않습니다.", () => router.replace('/signup'));
      } else if (
        data.status === "fail" &&
        data.error === "Wrong password"
      ) {
        alertHook.alert("비밀번호가 일치하지 않습니다.", () => router.replace('/signup'));
      } else {
        setFormData({
          name: { value: '', validation: '' },
          email: { value: '', validation: '' },
          // birthday: { value: '', validation: '' },
          gender: { value: '', validation: '' },
          phoneNumber: { value: '', validation: '' },
          password: { value: '', validation: '' },
          passwordConfirm: { value: '', validation: '' },
        });
        alertHook.alert("가입이 완료되었습니다.", () => {
          router.replace('/login');
        })
      }

    },
    onError: (error) => {
      alertHook.alert("회원가입에 실패했습니다. 다시 시도해주세요.", () => router.replace('/signup'));
      console.error('회원가입 실패:', error);
    },
  });



  const handleChange = (e) => {
    const { name, value } = e.target;

    const validations = {
      password: {
        required: '비밀번호를 입력해주세요.',
        pattern: {
          value: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
          message: '비밀번호는 최소 8자리, 영문자, 숫자, 특수문자를 포함해야 합니다.',
        },
      },
      passwordConfirm: {
        required: '비밀번호 확인을 입력해주세요.',
        sameAs: {
          value: formData.password.value,
          message: '비밀번호가 일치하지 않습니다.',
        }
      },
    };

    if (name === 'password') {
      const passwordValidation = validations[name];
      if (passwordValidation.required && !value) {
        setPasswordAlert(passwordValidation.required);
      } else if (passwordValidation.pattern && !passwordValidation.pattern.value.test(value)) {
        setPasswordAlert(passwordValidation.pattern.message);
      } else {
        setPasswordAlert('');
      }
    }

    // Perform validation on-the-fly for the passwordConfirm field
    if (name === 'passwordConfirm') {
      const passwordConfirmValidation = validations[name];
      if (passwordConfirmValidation.required && !value) {
        setPasswordConfirmAlert(passwordConfirmValidation.required);
      } else if (passwordConfirmValidation.sameAs && value !== formData.password.value) {
        setPasswordConfirmAlert(passwordConfirmValidation.sameAs.message);
      } else {
        setPasswordConfirmAlert('');
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value },
    }));

  };

  // 아이디 중복 확인
  const handleIdCheck = async (e) => {
    e.preventDefault();
    if (!formData.email.value) {
      setIdCheckMessage('아이디를 입력해주세요.');
      return;
    }
    checkIdDuplicateRefetch();

  }



  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    const validations = {
      name: {
        required: '이름을 입력해주세요.',
      },
      email: {
        required: '이메일을 입력해주세요.',
        duplication: '이미 존재하는 아이디(이메일)입니다.',
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: '올바른 이메일 형식이 아닙니다.',
        },
      },
      password: {
        required: '비밀번호를 입력해주세요.',
        pattern: {
          value: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
          message: '비밀번호는 최소 8자리, 대문자, 소문자, 숫자를 포함해야 합니다.',
        },
      },
      passwordConfirm: {
        required: '비밀번호 확인을 입력해주세요.',
        sameAs: {
          value: formData.password.value,
          message: '비밀번호가 일치하지 않습니다.',
        }
      },
      // birthday: {
      //   required: '생년월일을 입력해주세요.',
      // },
      gender: {
        required: '성별을 선택해주세요.',
      },
      phoneNumber: {
        required: '핸드폰 번호를 입력해주세요.',
      }
    };

    for (const key in formData) {
      const fieldValue = formData[key];
      const validation = validations[key];
      if (validation.required && !fieldValue.value) {
        alertHook.alert(validation.required);
        return;
      }
      if (validation.pattern && !validation.pattern.value.test(fieldValue.value)) {
        alertHook.alert(validation.pattern.message);
        return;
      }
      if (validation.duplication && validation.duplication === true) {
        alertHook.alert(validation.duplication);
        return;
      }
      if (validation.sameAs && fieldValue.value !== validation.sameAs.value) {
        alertHook.alert(validation.sameAs.message);
        return;
      }
    }

    setUser(formData);
    signupRefetch();
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumber: { value: authPhoneStateInfo.phoneNumber, validation: authPhoneStateInfo.authDone },
    }));
  }, [authPhoneStateInfo])

  useEffect(()=>{
    console.log('formData', formData)

  },[formData])


  return (
    <SignUpFormContainer>
      <form onSubmit={handleSubmit}>
        <SignUpLabel>
          <p>성함</p>
          <SignUpInput
            type="text"
            name="name"
            value={formData.name.value}
            onChange={handleChange}
            placeholder="성함을 입력해주세요"

          />
        </SignUpLabel>
        <SignUpLabel>
          <p>아이디(이메일)</p>
          <IdInputContainer>
            <SignUpInput
              type="email"
              name="email"
              value={formData.email.value}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
            />
            <IdDuplicationButton onClick={handleIdCheck}>중복 확인</IdDuplicationButton>
          </IdInputContainer>
          {idCheckMessage && <Notice>{idCheckMessage}</Notice>}
        </SignUpLabel>
        <SignUpLabel>
          <p>비밀번호</p>
          <SignUpInput
            type="password"
            name="password"
            value={formData.password.value}
            onChange={handleChange}
            placeholder="비밀번호을 입력해주세요"
          />
          {passwordAlert && <Notice>{passwordAlert}</Notice>}
        </SignUpLabel>
        <SignUpLabel>
          <p>비밀번호 확인</p>
          <SignUpInput
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm.value}
            onChange={handleChange}
            placeholder="비밀번호을 다시 입력해주세요"
          />
          {passwordConfirmAlert && <Notice>{passwordConfirmAlert}</Notice>}
        </SignUpLabel>
        {/* <SignUpLabel>
          <p>생년월일</p>
          <SignUpInput
            type="date"
            name="birthday"
            value={formData.birthday.value}
            onChange={handleChange}
            placeholder="생년월일을 입력해주세요"
          />
        </SignUpLabel> */}
        <SignUpLabel>
          <p>핸드폰 번호</p>
          <AuthPhoneNumber></AuthPhoneNumber>
        </SignUpLabel>
        <SignUpLabel>
          <p>성별</p>
        </SignUpLabel>
        <GenderContainer>
          <SignUpLabel>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender.value === 'male'}
              onChange={handleChange}
            />
            남성
          </SignUpLabel>
          <SignUpLabel>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender.value === 'female'}
              onChange={handleChange}
            />
            여성
          </SignUpLabel>
          <SignUpLabel>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender.value === 'other'}
              onChange={handleChange}
            />
            기타
          </SignUpLabel>
        </GenderContainer>
        <SingUpButtonContainer>
          <CommonButton type="submit">가입하기</CommonButton>
        </SingUpButtonContainer>
      </form>
    </SignUpFormContainer>
  );
};

export default SignUpForm;
