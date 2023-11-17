import { device } from "component/common/GlobalComponent";
import styled from "styled-components";
import SubscrbieCalendar from "./SubscribeCalendar";
import DailyOrderInfo from "./DailyOrderInfo";
const MainCalendarWrapper = styled.div`
  width: 800px;
  border: 1px solid #DBDBDB;
  border-radius:5px;
  padding: 30px;
  margin-bottom: 8px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  @media ${device.mobileL} {
    padding: 20px;
    width: 100%;
  }
`
const MainCalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius:5px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`


function MainCalendar({ subsNo, dows, nextDeliveryDate }) {
  return (
    <MainCalendarWrapper>
      <MainCalendarContainer>
        <SubscrbieCalendar subsNo={subsNo} dows={dows} nextDeliveryDate={nextDeliveryDate}></SubscrbieCalendar>
        <DailyOrderInfo subsNo={subsNo}> </DailyOrderInfo>
      </MainCalendarContainer>
    </MainCalendarWrapper>
  );
}

export default MainCalendar;