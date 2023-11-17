
import styled from "styled-components";
import Image from "next/image";
import { fontWeight, device } from "component/common/GlobalComponent";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useState } from "react";
import { common } from "public/js/common";
const UserInfoTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: .5px solid #DBDBDB;
  padding-bottom: 19px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
  
`
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  p{
    margin-left: 6px;
  }
  @media ${device.mobileL} {
    margin-bottom: 24px;
    p{
      font-size: 18px;
      font-weight: ${fontWeight("semiBold")};
      margin-left: 8px;
   }
  }
`
const UserDiscountContainer = styled.div`
  display: flex;
  justify-content:  flex-end;
  align-items: center;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: flex-start;
  }
  `
const UserRecommend = styled.div`
  display: flex;
  align-items: center;
  width: 237px;
  font-size: 14px;
  line-height: 20px;
  font-weight: ${fontWeight("regular")};
  h2{
    color : #999999;
  }
  p{
    color : #DC5F00;
    margin: 0 6px;
  font-weight: ${fontWeight("medium")};

  }
  div{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9px;
    width: 80px;
    color : #DC5F00;
    img{
      margin-right: 4px;
    }
  }

  @media ${device.mobileL} {
    font-size: 16px;
    width: 100%;
    margin-bottom: 18px;
    h2{
      color : #999999;
    }
    p{
      color : #DC5F00;
      margin: 0 6px;
    }
    div{
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #DC5F00;
      border-radius: 9px;
      width: 80px;
      color : #DC5F00;
      img{
        margin-right: 4px;
      }
    }
  }
`

const UserMiles = styled.div` 
  display: flex;
  margin-left:16px;
  span{
    display: block;
    width: 160px;
    text-align: right;
  }
  @media ${device.mobileL} {
    display: flex;
    justify-content: space-between;
    margin-left:0px;
    width: 151px;
    margin-bottom: 24px;
    p{
      width: fit-content;
    }
    span{
        display: block;
        width: fit-content;
    }
  }
`

function UserInfoTitle() {
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    return await customAxios({
      method: "get",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/subscribeuserinfo`,
    })
  }

  useQuery('getUserInfo', getUserInfo, {
    onSuccess: (res) => {
      if (res.data.status === "success") {
        setUserInfo(res.data.data);
      }
    },
    onError: (error) => {
      console.error(error);
    }
  })


  const handelShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '현관앞키친 추천인코드 공유',
        text: `추천인 코드는 ${userInfo.recommendCode} 입니다.`,
        url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      });
    } else {
      alert("공유하기가 지원되지 않는 환경 입니다.")
    }
  }

  return (
    <UserInfoTitleContainer>
      {userInfo &&
        <>
          <UserInfo>
            <Image src={`/img/mypage/user_${userInfo.userGender}.png`} width={24} height={24} alt="현키 유저 아이콘 여자" ></Image>
            {/* <Image src={`/img/mypage/user_female.png`} width={24} height={24} alt="현키 유저 아이콘 여자" ></Image> */}
            <p>{userInfo.userName} 님</p>
          </UserInfo>
          <UserDiscountContainer>
            <UserRecommend>
              <h2>추천인코드</h2>
              <p>{userInfo.recommendCode}</p>
              <div onClick={handelShare}>
                <Image src="/img/mypage/share_icon.png" width={10} height={10} alt="공유 아이콘" ></Image>
                복사하기
              </div>
            </UserRecommend>
            <UserMiles>
              <p>적립금</p>
              <span>{userInfo.remainMiles ? common.numberCommaFormat(userInfo.remainMiles) : 0}P</span>
            </UserMiles>
          </UserDiscountContainer>
        </>
      }
    </UserInfoTitleContainer>
  );
}

export default UserInfoTitle;