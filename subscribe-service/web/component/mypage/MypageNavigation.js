import styled from "styled-components";
import { MdArrowForwardIos } from "react-icons/md";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
const MypageNavigationWrapper = styled.div`
`
const NavigationMenuList = styled.ul`
  display: flex;
  justify-content:space-around;
  align-items: center;
  flex-direction: column;
  border-radius: 5px;
  padding: 20px;
  
  & li:last-child{
    border: none;
    margin-bottom: 0;
  }
`
const Menu = styled.li`
  display: flex;
  justify-content: space-between;
  align-items:center;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  border-bottom :  1px solid #e5e5e5;
  cursor: pointer;
  svg{
    width: 18px;
    height: 18px;
  }
`
const Label = styled.h3`
`

const LinkTo = styled.div``

function MypageNavigation() {
  const [userNo, setUserNo] = useState(null);
  const getUserNo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    });
  };

  useQuery('getUserNo', getUserNo, {
    onSuccess: (res) => {
      setUserNo(res.data.data?.UserNo);
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })



  const handleMypageMenu = (url) => {
    Router.push(url)
  }
  return (
    <MypageNavigationWrapper>
      <NavigationMenuList>
        <Menu onClick={() => handleMypageMenu(`/mypage/user/${userNo}`)}><Label>회원관리</Label><MdArrowForwardIos ></MdArrowForwardIos></Menu>
        <Menu onClick={() => handleMypageMenu(`/mypage/subscribe/list`)}><Label>구독관리</Label><MdArrowForwardIos ></MdArrowForwardIos></Menu>
        <Menu onClick={() => handleMypageMenu("/mypage/payment/history")}><Label>결제/취소내역</Label><MdArrowForwardIos ></MdArrowForwardIos></Menu>
      </NavigationMenuList>
    </MypageNavigationWrapper>
  );
}

export default MypageNavigation;