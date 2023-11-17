import styled from "styled-components";
import { fontWeight } from "component/common/CommonComponent";
import { Title } from "../../subscribe/CommonComponent";
import { device } from "../../common/GlobalComponent";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { cancelRefundState } from "state/subscribe";
import { useEffect } from "react";
import { common } from "public/js/common";


const CancelRefundInfoWrapper = styled.div`
  margin-bottom: 40px;
`
const CancelRefundInfoContainer = styled.div`
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
const CancelRefundInfoList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CancelRefundInfoGroupContainer = styled.li`
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

const CancelRefundInfoGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media ${device.mobileL} {
    margin-bottom: 8px;
  }
`


const CancelRefundInfoLabel = styled.p`
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
const CancelRefundInfoDetails = styled.div`
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
const CancelRefundDetailsGroupContainer = styled.div`
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
const CancelRefundDetailsGroup = styled.div`
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




function CancelRefundInfo({ subsNo, stateKey }) {
  const cancelRefundStateInfo = useRecoilValue(cancelRefundState(stateKey));
  const setCancelRefundStateInfo = useSetRecoilState(cancelRefundState(stateKey));

  const getCancelRefundInfo = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: {
        subsNo: subsNo,
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/cancelrefundinfo`,
    })
  }

  useQuery(`CancelRefundInfo${subsNo}`, getCancelRefundInfo, {
    onSuccess: (res) => {
      console.log('res', res)
      const response = res.data;
      if (response.status === "success") {
        setCancelRefundStateInfo((oldState) => {
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

  useEffect(() => {
    console.log('cancelRefundStateInfo', cancelRefundStateInfo)
  }, [cancelRefundStateInfo])


  return (
    <CancelRefundInfoWrapper>
      <Title>환불 정보</Title>
      <CancelRefundInfoContainer>
        <CancelRefundInfoList>
          <CancelRefundInfoGroupContainer>
            {/* <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>총 상품금액</CancelRefundInfoLabel>
              <CancelRefundInfoDetails>
                {common.numberCommaFormat(cancelRefundStateInfo.list.totalPrice )}원
              </CancelRefundInfoDetails>
            </CancelRefundInfoGroup> */}
            <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>결제금액</CancelRefundInfoLabel>
              <CancelRefundInfoDetails>
                {common.numberCommaFormat(cancelRefundStateInfo.list.paymentPrice )}원
              </CancelRefundInfoDetails>
            </CancelRefundInfoGroup>
            {/* <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>사용적립금</CancelRefundInfoLabel>
              <CancelRefundInfoDetails>
                {cancelRefundStateInfo.list.totalUseMiles ? common.numberCommaFormat(cancelRefundStateInfo.list.totalUseMiles) : 0}원
              </CancelRefundInfoDetails>
            </CancelRefundInfoGroup> */}
            <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>이용내역</CancelRefundInfoLabel>
              <CancelRefundInfoDetails>
                {cancelRefundStateInfo.list.tags &&
                  cancelRefundStateInfo.list.tags.map((tag, index) => {
                    return <p key={`refundProduct${index}`}>{tag.TagLabel} ( <span>{tag.UseAmount}개 </span> / {tag.TotalAmount}개)</p>
                  })
                }
              </CancelRefundInfoDetails>
            </CancelRefundInfoGroup>
            <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>이용금액</CancelRefundInfoLabel>
              <CancelRefundInfoDetails>
                {cancelRefundStateInfo.list.totalUseProductPrice ? common.numberCommaFormat(cancelRefundStateInfo.list.totalUseProductPrice) : 0}원
              </CancelRefundInfoDetails>
            </CancelRefundInfoGroup>
          </CancelRefundInfoGroupContainer>
          <CancelRefundInfoGroupContainer>
            <CancelRefundInfoGroup>
              <CancelRefundInfoLabel>환불금액</CancelRefundInfoLabel>
              <CancelRefundDetailsGroupContainer>
                <CancelRefundDetailsGroup>
                  <span>카드부분취소</span>
                  <p>{cancelRefundStateInfo.list.refundPayment ? common.numberCommaFormat(cancelRefundStateInfo.list.refundPayment) : 0}원</p>
                </CancelRefundDetailsGroup>
                <CancelRefundDetailsGroup>
                  <span>포인트 반환</span>
                  <p>{common.numberCommaFormat((cancelRefundStateInfo.list.refundMiles ? cancelRefundStateInfo.list.refundMiles : 0) + (cancelRefundStateInfo.list.refundMilesOforderChange ? cancelRefundStateInfo.list.refundMilesOforderChange : 0))}원</p>
                </CancelRefundDetailsGroup>
              </CancelRefundDetailsGroupContainer>
            </CancelRefundInfoGroup>
          </CancelRefundInfoGroupContainer>
        </CancelRefundInfoList>
        <TotalInfo><span>총 환불금액</span><h2>{common.numberCommaFormat(cancelRefundStateInfo.list.refundPayment + (cancelRefundStateInfo.list.refundMiles ? cancelRefundStateInfo.list.refundMiles : 0) + (cancelRefundStateInfo.list.refundMilesOforderChange ? cancelRefundStateInfo.list.refundMilesOforderChange : 0))}원</h2></TotalInfo>
      </CancelRefundInfoContainer>
    </CancelRefundInfoWrapper >
  );
}

export default CancelRefundInfo;