import styled from "styled-components";
import { fontWeight } from "component/common/CommonComponent";
import { Title } from "../../subscribe/CommonComponent";
import { device } from "../../common/GlobalComponent";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { refundState } from "state/subscribe";
import { useEffect } from "react";
import { common } from "public/js/common";


const RefundInfoWrapper = styled.div`
  margin-bottom: 40px;
`
const RefundInfoContainer = styled.div`
  width: 100%;
  background-color: #fefefe;
  border: 1px solid #DC5F00;  
  padding: 12px 40px  52px;
  border-radius: 10px;
  margin-top: 20px;
  @media ${device.mobileL} {
    width: 100%;
    padding:20px;
    margin-top: 30px;
  }
`
const RefundInfoList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const RefundInfoGroupContainer = styled.li`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 30px 0 ;
    border-bottom: 0.5px solid #A9A9A8;
    @media ${device.mobileL} {
    padding:20px 0 ;
  }
`

const RefundInfoGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media ${device.mobileL} {
    margin-bottom: 8px;
  }
`


const RefundInfoLabel = styled.p`
    font-size: 18px;
    line-height: 39px;
    font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    font-size: 12px;
    line-height: 16px;
    font-weight: ${fontWeight("regular")};
    flex-basis: 20%;
  }
`
const RefundInfoDetails = styled.div`
    display: flex;
    font-size: 18px;
    line-height: 39px;
    font-weight: ${fontWeight("regular")};
    p{
      padding-left: 10px;
      span{
      font-weight: ${fontWeight("semiBold")};
    }
    }

    @media ${device.mobileL} {
    font-size: 12px;
    line-height: 14px;
    font-weight: ${fontWeight("bold")};
    p{
      padding-left: 4px;
      white-space: nowrap;
    }
    span{
      font-weight: ${fontWeight("regular")};
    }
  }
`
const RefundDetailsGroupContainer = styled.div`
display: flex;
  flex-direction: column;
  align-items: flex-end;
 @media ${device.mobileL} {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
 }
`
const RefundDetailsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 305px;
  font-size:18px;
  line-height: 33px;
  font-weight: ${fontWeight("semiBold")};
  span, p{
  color: #DC5F00;
  }
  p{
  }
  @media ${device.mobileL} {
    justify-content: flex-end;
    width: 100%;
    font-size: 12px;
    p{
      text-align: right;
      flex-basis: 30%;
    }
    span{
      text-align: right;
      flex-basis: 30%;
    }
  }
`

const TotalInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  text-align: right;
  font-size:20px;
  line-height: 33px;
  font-weight: ${fontWeight("semiBold")};
  margin-top: 30px;
  color:#DC5F00;
  & span{
      font-size:18px;
      line-height: 33px;
      font-weight: ${fontWeight("semiBold")};
      margin-right: 22px;
      color:#DC5F00;

  }
  & h2{
    font-size: 24px;
      font-weight: ${fontWeight("bold")};
      color:#DC5F00;
  }

  @media ${device.mobileL} {
    text-align: right;
    font-size:12px;
    line-height: 12px;
    font-weight: ${fontWeight("bold")};
    margin-top: 15px;
    color:#DC5F00;
    & span{
        font-size:12px;
        line-height: 13px;
        font-weight: ${fontWeight("semiBold")};
        margin-right: 22px;
        color:#DC5F00;

    }
    & h2{
      font-size:16px;
    }


  }
`




function RefundInfo({ subsNo, stateKey, refundType }) {
  const refundStateInfo = useRecoilValue(refundState(stateKey));
  const setRefundStateInfo = useSetRecoilState(refundState(stateKey));

  const getRefundInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo,
        refundType: refundType
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/refundinfo`,
    })
  }

  useQuery(`RefundInfo${subsNo}`, getRefundInfo, {
    onSuccess: (res) => {
      const response = res.data;
      if (response.status === "success") {
        setRefundStateInfo((oldState) => {
          return {
            ...oldState,
            list: res.data.data
          }
        })
      }
    },
    onError: (error) => {
      console.error(error);
    }
  })

  // useEffect(() => {
  //   console.log('refundStateInfo', refundStateInfo)
  // }, [refundStateInfo])


  return (
    <RefundInfoWrapper>
      <Title>환불 정보</Title>
      <RefundInfoContainer>
        <RefundInfoList>
          {refundStateInfo.list.NextDeliveryDate &&
            <RefundInfoGroupContainer>
              <RefundInfoGroup>
                <RefundInfoLabel>마지막 배송일</RefundInfoLabel>
                <RefundInfoDetails>
                  <p>{common.DateFormatting(refundStateInfo.list.NextDeliveryDate).split(" ")[0]}</p>
                </RefundInfoDetails>
              </RefundInfoGroup>
            </RefundInfoGroupContainer>
          }
          <RefundInfoGroupContainer>
            <RefundInfoGroup>
              <RefundInfoLabel>결제금액</RefundInfoLabel>
              <RefundInfoDetails>
                {common.numberCommaFormat(refundStateInfo.list.TotalPrice)}원
              </RefundInfoDetails>
            </RefundInfoGroup>
            <RefundInfoGroup>
              <RefundInfoLabel>이용내역</RefundInfoLabel>
              <RefundInfoDetails>
                {refundStateInfo.list.Tags &&
                  refundStateInfo.list.Tags.map((tag, index) => {
                    return <p key={`refundProduct${index}`}>{tag.TagLabel} ( <span>{tag.UseAmount}개 </span> / {tag.TotalAmount}개)</p>
                  })
                }
              </RefundInfoDetails>
            </RefundInfoGroup>
            <RefundInfoGroup>
              <RefundInfoLabel>이용금액</RefundInfoLabel>
              <RefundInfoDetails>
                {common.numberCommaFormat(refundStateInfo.list.UsePrice)}원
              </RefundInfoDetails>
            </RefundInfoGroup>
          </RefundInfoGroupContainer>
          <RefundInfoGroupContainer>
            <RefundInfoGroup>
              <RefundInfoLabel>환불금액</RefundInfoLabel>
              <RefundDetailsGroupContainer>
                <RefundDetailsGroup>
                  <span>카드부분취소</span>
                  <p>{common.numberCommaFormat(refundStateInfo.list.TotalPrice - refundStateInfo.list.UsePrice)}원</p>
                </RefundDetailsGroup>
                {refundStateInfo.list.MilesAmount &&
                  <RefundDetailsGroup>
                    <span>포인트 반환</span>
                    <p>{common.numberCommaFormat(refundStateInfo.list.MilesAmount)}원</p>
                  </RefundDetailsGroup>
                }
              </RefundDetailsGroupContainer>
            </RefundInfoGroup>
          </RefundInfoGroupContainer>
        </RefundInfoList>
        <TotalInfo><span>총 환불금액</span><h2>{common.numberCommaFormat(refundStateInfo.list.TotalPrice - refundStateInfo.list.UsePrice + (refundStateInfo.list.MilesAmount ? refundStateInfo.list.MilesAmount : 0))}원</h2></TotalInfo>
      </RefundInfoContainer>
    </RefundInfoWrapper >
  );
}

export default RefundInfo;