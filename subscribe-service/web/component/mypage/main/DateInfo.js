import styled from "styled-components";
import { fontWeight, device } from "component/common/GlobalComponent";
import { common } from "public/js/common";
const DateInfoWrapper = styled.div`
  width: 395px;
  height: 171px;
  border: 1px solid #DBDBDB;
  border-radius:5px;
  padding: 40px 50px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  @media ${device.mobileL} {
    width: 100%;
    height: 134px;
    padding: 20px 37px;
  }
`
const DateInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`


const Divider = styled.div`
  height: 90px;
  width: 1px;
  background-color: #DBDBDB;
 
`



const DateContext = styled.div`
text-align: center;
  span{
    display: block;
    font-size: 16px;
    line-height: 48px;
    color:#999999;
    font-weight: ${fontWeight("regular")};
  }
  p{
    display: block;
    font-size: 18px;
    line-height: 32px;
    font-weight: ${fontWeight("medium")};
  }
  @media ${device.mobileL} {
    span{
      font-size: 14px;
    }
   
  }
`


function DateInfo({ subscribeInfo }) {
  const nextDeliveryDate = new Date(subscribeInfo.nextDeliveryDate)
  const nextPaymentDate = new Date(subscribeInfo.nextPaymentDate)

  return (
    <DateInfoWrapper>
      <DateInfoContainer>
        <DateContext>
          <span>다음 배송일</span>
          {subscribeInfo.statusCode !== "normal" ?
            <p> - </p>
            :
            <p>{nextDeliveryDate.getMonth() + 1}/{nextDeliveryDate.getDate()}({common.getDayOfWeek(nextDeliveryDate)})</p>
          }
        </DateContext>
        <Divider></Divider>
        <DateContext>
          <span>다음 결제 예정일</span>
          {subscribeInfo.statusCode !== "normal" ?
            <p> - </p>
            :
            <p>{nextPaymentDate.getMonth() + 1}/{nextPaymentDate.getDate()}({common.getDayOfWeek(nextPaymentDate)})</p>
          }
        </DateContext>
      </DateInfoContainer>
    </DateInfoWrapper>
  );
}

export default DateInfo;