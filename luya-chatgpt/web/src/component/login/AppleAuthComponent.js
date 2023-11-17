"use client"

import styled from "styled-components"

const AppleAuthContainer = styled.div``

function AppleAuthComponent() {

  useEffect(() => {
    // 성공한 인증 응답을 처리하기 위한 이벤트 리스너 추가
    const successHandler = (event) => {
      console.log(event.detail.data);
    };

    // 인증 실패를 처리하기 위한 이벤트 리스너 추가
    const failureHandler = (event) => {
      console.log(event.detail.error);
    };

    // 이벤트 리스너를 document에 연결
    document.addEventListener('AppleIDSignInOnSuccess', successHandler);
    document.addEventListener('AppleIDSignInOnFailure', failureHandler);

    // 컴포넌트가 unmount될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('AppleIDSignInOnSuccess', successHandler);
      document.removeEventListener('AppleIDSignInOnFailure', failureHandler);
    };
  }, []);  // 빈 dependency 배열을 사용하여 이 effect를 컴포넌트 마운트시에만 실행

  return (
    <AppleAuthContainer>


    </AppleAuthContainer>
  );
}

export default AppleAuthComponent;