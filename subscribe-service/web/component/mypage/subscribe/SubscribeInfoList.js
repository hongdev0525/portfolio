import styled, { css } from "styled-components";
import { device, fontWeight } from "component/common/GlobalComponent";
import { useQuery } from "react-query";
import { customAxios } from "../../../public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mypageSubscribeListState } from "../../../state/mypage";
import { useEffect } from "react";
import Router from "next/router";
import { common } from "public/js/common";
import MypageTitle from "../MypageTitle";

const SubscribeInfoWrapper = styled.div`
display: flex;
  flex-direction: column;
  align-items: center;
  margin  : 142px 0 170px;
  @media ${device.mobileL} {
    padding: 80px 0px;
    margin: 0px 0px 120px;
  }

`
const SubscribeInfoContainer = styled.div`
  width: 800px;
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`

const HeaderInfo = styled.div`
  font-size: 16px;
  color: #767676;
  font-weight: ${fontWeight("regular")};
   span{
    font-size: 16px;
    color: #767676;
    font-weight: ${fontWeight("regular")};
  }
 
`
const Colored = styled.span`
color: #DC5F00 !important;
`


const SubscribeList = styled.ul`
 
`
const SubscribeInfo = styled.li`
     border-bottom : 8px solid #F1F1F5;
      margin-bottom: 22px;
`

const SubscribeInfoBody = styled.div`
  padding: 24px 0 33px;
  h2{
    font-size: 20px;
    font-weight: ${fontWeight("semiBold")};
    margin-bottom: 10px;
  }
  @media ${device.mobileL} {
  padding: 26px 0 37px;

    h2{
      font-size: 18px;
      font-weight: ${fontWeight("semiBold")};
    }
  }
`


const InfoBody = styled.div`
  display: flex;
  margin-bottom: 2px;
  p, span{
    display: block;
  font-size: 16px;
  color: #767676;
  font-weight: ${fontWeight("regular")};
  }
  span{
    margin: 0 10px;
  }
  @media ${device.mobileL} {
    display: flex;
    flex-direction: column;
    span{
        display: none;
    }
    p{
      font-size: 14px;
      line-height: 18px;
    }
  }
`

const InfoLabel = styled.div`
  width: 123px;
  font-size: 16px;
  color:#767676;
  @media ${device.mobileL} {
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
    line-height: 18px;
    margin-bottom: 4px;
  }
`
const InfoDetail = styled.div`
 @media ${device.mobileL} {
    font-size: 14px;
    font-weight: ${fontWeight("regular")};
    line-height: 18px;
  }
`

const SubscribeInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #767676;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F3F7;
  font-weight: ${fontWeight("regular")};

  span{
      font-size: 16px;
    color: #767676;
  font-weight: ${fontWeight("regular")};

  }
`


const CancelButton = styled.button`
  width: fit-content;
  height: 25px;
  border: 1px solid #DBDBDB;
  border-radius:  13px;
  background-color: #fefefe;
  padding: 5px 10px;
  cursor: pointer;
  ${props => props.isCancel == true ?
    css`
    color : #DBDBDB;
    pointer-events: none;
  `
    :
    css`
    `
  }
  @media ${device.mobileL} {
    font-size: 12px;
    font-weight: ${fontWeight("regular")};
  }
`

const MypageTitleContainer = styled.div`
  width: 800px;
  div{
  border-bottom: none;
  }
  @media ${device.mobileL} {
    width: 100%;
    padding: 0 24px;
    div{
      margin-bottom: 0px;
    }
  }
`

function SubscribeInfoList() {
  const mypageSubscirbeList = useRecoilValue(mypageSubscribeListState);
  const setMypageSubscribeInfo = useSetRecoilState(mypageSubscribeListState);

  useQuery("getSubscribeList", () => getSubscribeList(), {
    onSuccess: (res) => {
      const response = res.data;
      console.log('response', response)
      setMypageSubscribeInfo(response.data)
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })
  const getSubscribeList = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/list`,
    })
  }


  function parseProductListByDow(productList) {
    const result = {};
    productList.forEach(product => {
      const dow = product.dow;
      const name = product.name;
      if (!result[dow]) {
        result[dow] = {};
      }
      if (!result[dow][name]) {
        result[dow][name] = 0;
      }
      result[dow][name] += product.amount;
    });

    const dowTextArr = Object.keys(result).map(dow => {
      const products = result[dow];
      const productsText = Object.keys(products).map(name => {
        const amount = products[name];
        return `${name} ${amount}개`;
      }).join(', ');
      return `${dow} - ${productsText}`;
    });

    return dowTextArr.join(' / ');
  }

  const handleSubscribeList = (subsNo) => {
    Router.push(`/mypage/subscribes/${subsNo}`);
  }
  return (
    <SubscribeInfoWrapper>
      <MypageTitleContainer>
        <MypageTitle url={"/mypage"} title={"구독관리"} ></MypageTitle>
      </MypageTitleContainer>
      <SubscribeInfoContainer>
        <SubscribeList>
          {mypageSubscirbeList &&
            mypageSubscirbeList.map((subscribeInfo, index) => {
              console.log('subscribeInfo', subscribeInfo)
              if (subscribeInfo.subsType === "subscribe") {
                return (
                  <SubscribeInfo key={`subscribeList${subscribeInfo.subsNo}`}>
                    <SubscribeInfoHeader>
                      <HeaderInfo>
                        {subscribeInfo.addressLabel} ꞏ {subscribeInfo.statusCode === "normal" ? <Colored>구독중</Colored> : <span>구독해지</span>}
                      </HeaderInfo>
                      <CancelButton onClick={() => { Router.push(`/mypage/subscribe/cancel/${subscribeInfo.subsNo}`) }} isCancel={subscribeInfo.statusCode === "normal" ? false : true} >
                        구독해지
                      </CancelButton>
                    </SubscribeInfoHeader>
                    <SubscribeInfoBody>
                      <InfoBody>
                        <InfoLabel> 구독 메뉴 </InfoLabel> <InfoDetail>{parseProductListByDow(subscribeInfo.product.filter(p => subscribeInfo.dows.split(",").includes(p.dow)))}</InfoDetail>
                      </InfoBody>
                      <InfoBody>
                        <InfoLabel> 구독 시작일</InfoLabel> <InfoDetail> {common.DateFormatting(subscribeInfo.regDate).split(" ")[0]}</InfoDetail>
                      </InfoBody>
                    </SubscribeInfoBody>
                  </SubscribeInfo>
                )
              }
            })
          }
        </SubscribeList>
      </SubscribeInfoContainer>
    </SubscribeInfoWrapper>
  );
}

export default SubscribeInfoList;