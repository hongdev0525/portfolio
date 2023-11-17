import Router from "next/router";
import styled from "styled-components";
import MypageTitle from "../MypageTitle";
import { device, fontWeight } from "component/common/GlobalComponent";
import { useEffect, useState } from "react";
import { MypageButton } from "../CommonComponent";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { common } from "public/js/common";

const WithdrawUserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 142px 0px;
  height: 100%;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 24px 120px;
  }
`
const WithdrawContainer = styled.div`
  width: 793px;
  @media ${device.mobileL} {
   width: 100%;
  }
`
const WithdrawNotice = styled.div`
  padding: 60px 0 18px;
  font-size: 18px;
  font-weight: ${fontWeight("regular")};
  h2{
    font-size: 28px;
    font-weight: ${fontWeight("Medium")};
    margin-bottom: 20px;
  }
  span{
    display: block;
    margin-bottom: 56px;
  }
  ul{
margin-bottom: 72px;
    li{
      margin-bottom: 28px;
      white-space: nowrap;
    }
  }
  @media ${device.mobileL} {
   padding:0px;
   h2{
      font-size: 20px;
      font-weight: ${fontWeight("regular")};
      margin-bottom: 20px;
    }
    span{
      display: block;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 56px;
    }
    ul{
        margin-bottom: 60px;
        li{
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 28px;
          white-space: normal;

        }
    }
  }
`




const InputContainer = styled.div`
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
  @media ${device.mobileL} {
   margin-bottom: 20px;
  }
`


const AgreementContainer = styled.div`
  position:relative;
  height: 25px;
  width: 25px;
  margin-right: 6px;
  @media ${device.mobileL} {
    height: 20px;
    width: 20px;
  }
`
const Agreement = styled.input`
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

const AgreementLabel = styled.label`
  font-weight: ${fontWeight("regular")};
  cursor: pointer;
  @media ${device.mobileL} {
    font-size: 14px;
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


function WithdrawUser() {
  const [userNo, setUserNo] = useState(null);
  const [agreementCheck, setAgreementCheck] = useState(false);

  const requestLogout = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/logout`,
    })
  }

  const { refetch: withdrawLogoutRefetch } = useQuery('withdrawLogout', requestLogout, {
    enabled: false,
    onSuccess: (res) => {
      common.setItemWithExpireTime("loggedIn", false, 0);
      location.replace("/mypage/user/withdraw/done");

    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  });


  const withrawUser = async () => {
    return await customAxios({
      method: "POST",
      data: {
        userNo: userNo
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/withdraw`,
    });
  }

  const { refetch: withrawUserRefetch } = useQuery('withrawUser', withrawUser, {
    enabled: false,
    retry: false,
    onSuccess: (res) => {
      const response = res.data
      console.log(response)
      if (response.status === "exist") {
        alert("구독이 남아있어 회원탈퇴가 불가능합니다.")
      } else {
        withdrawLogoutRefetch();
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })

  const handleAgreementWithdraw = () => {
    setAgreementCheck(!agreementCheck);
  }

  const handleWithdrawUser = () => {
    if (agreementCheck === false) {
      alert("위 내용에 동의해주세요.")
      return false
    } else {
      if (userNo != null) {
        withrawUserRefetch();
      }
    }
  }




  useEffect(() => {
    setUserNo(Router.query.userNo)
  }, [])

  return (
    <WithdrawUserWrapper>
      <WithdrawContainer>
        <MypageTitle url={`/mypage/user/${userNo}`} title="탈퇴하기"></MypageTitle>
        <WithdrawNotice>
          <h2>회원 탈퇴 전 꼭 확인해주세요! </h2>
          <span>회원 탈퇴 시 모든 정보가 삭제되니 아래 유의 사항을 확인하시고 신중하게 결정해주세요.</span>
          <ul>
            <li>- 서비스 이용내역에 대한 정보는 이용약관과 관련 법률에 의해 일정기간 보관 후 자동 파기되며 복구 할 수 없습니다.</li>
            <li>- 현재 보유 중인 현키 포인트는 모두 소멸되며 복구할 수 없습니다.</li>
          </ul>
          <InputContainer>
            <AgreementContainer>
              <Agreement
                id="termsAndConditions"
                name="termsAndConditions"
                type="checkbox"
                value="1"
                checked={agreementCheck}
                onChange={handleAgreementWithdraw}
              />
              <CheckMark></CheckMark>
            </AgreementContainer>
            <AgreementLabel htmlFor="termsAndConditions" >위 내용을 숙지하고 동의합니다.</AgreementLabel>
          </InputContainer>
        </WithdrawNotice>
        <MypageButton type="button" onClick={handleWithdrawUser}>탈퇴하기</MypageButton>
      </WithdrawContainer>
    </WithdrawUserWrapper>
  );
}

export default WithdrawUser;