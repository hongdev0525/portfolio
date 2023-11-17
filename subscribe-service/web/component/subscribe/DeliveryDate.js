import styled from "styled-components";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ko from "date-fns/locale/ko";
import { subscribeState } from '../../state/subscribe';
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useEffect, useState } from "react";
import { Title, TitleGroup } from './CommonComponent';
import { fontWeight } from "component/common/CommonComponent";
import { device } from "component/common/GlobalComponent";
import { common } from "public/js/common";
import { deliveryDateState } from "../../state/subscribe";
import { deliveryDowState } from "../../state/subscribe";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";

const DeliveryDateWrapper = styled.div`
  margin-bottom: 50px;
  @media ${device.mobileL} {
    margin-bottom: 60px;
  }
`

const DaypickerContainer = styled(DayPicker)`
  width: 100%;
  margin: 0;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  width: fit-content;
  padding:40px 30px;
  --rdp-cell-size: 76px;
  font-size: 24px;
  background-color: #fefefe;
 
  .rdp-caption_label{
    font-size : 24px;
  }
    .rdp-head_cell{
      font-weight: ${fontWeight("medium")};
    }
    .rdp-day{
      font-size: 19px;
      font-weight: ${fontWeight("regular")};
      line-height: 38px;
      margin: 0 auto;
      
    }
    .rdp-day_selected{
      transition: all .4s ease;
      width: 64px;
      height: 64px;
      background-color:  #DC5F00;
      box-shadow: 5px 5px 10px rgba(0,0,0,.1);
      font-weight: ${fontWeight("bold")};
     
    }
    .rdp-day_selected:hover{
      width: 64px;
      height: 64px;
    }
    .rdp-day_outside{
      opacity: 1;
    }

  @media ${device.mobileL} {
    width: 100%;
    --rdp-cell-size: 42px;
    padding:22px 15px;
    font-size: 13px;
    .rdp-day, .rdp-head_cell{
   
      font-size: 13px;
      font-weight: ${fontWeight("medium")};
      line-height: 15px;
    }
    .rdp-day{
      display: flex;
      justify-content: center;
      width: 35px;
      height: 35px;
    }
    .rdp-day_selected{
      transition: all .4s ease;
      width: 35px;
      height: 35px;
      background-color:  #DC5F00;
      box-shadow: 5px 5px 10px rgba(0,0,0,.1);
     
    }
    .rdp-day_selected:hover{
      width: 35px;
      height: 35px;
    }
  }


`


function DeliveryDate({ stateKey }) {

  const [startDate, setstartDate] = useState()
  const setDeliveryDateState = useSetRecoilState(deliveryDateState(stateKey));
  const deliveryDateStateInfo = useRecoilValue(deliveryDateState(stateKey));
  const subscribeStateInfo = useRecoilValue(subscribeState);
  const selectedDowList = useRecoilValue(deliveryDowState(stateKey));
  const [deliveryDows, setDeliveryDows] = useState([]);
  const [holidayList, setHolidayList] = useState(null);


  const getHolidayList = async () => {
    return await customAxios({
      method: "GET",
      withCredentials: true,
      params: { codeType: "DELIVERY_DOW" },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/getholidaylist`,
    })
  }

  useQuery([`getHolidayList${stateKey}}`, deliveryDows], () => getHolidayList(), {
    onSuccess: (res) => {
      let tmp = [];

      if (res.status === 200) {
        res.data.data.map(dayInfo => {
          tmp.push(new Date(dayInfo.Locdate));
        })
        tmp.push({ dayOfWeek: deliveryDows })
        tmp.push({ before: startDate })
        setHolidayList(tmp)
      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error)
    }
  })


  const handleDaypicker = (date) => {

    setDeliveryDateState((oldState) => {
      return {
        ...oldState,
        deliveryDate: date
      }
    })
  }

  useEffect(() => {
    let now = new Date();
    let dayOfWeek = now.getDay();
    //4시 이전 로직 추가 필요
    const currentHour = new Date().getHours();
    // let timeInterval = (dayOfWeek === 4 || dayOfWeek === 5) ? 5 : 2;
    const timeInterval = (dayOfWeek === 4 || dayOfWeek === 5) ? 5 : (currentHour >= 16 ? 3 : 2);
    setstartDate(new Date(now.setDate(now.getDate() + timeInterval)))
  }, [])


  useEffect(() => {
    if (selectedDowList.list) {
      const dowList = selectedDowList.list;
      let tmp = [0, 1, 2, 3, 4, 5, 6];
      const disbaledDows = tmp.filter((dow) => {
        return dowList.includes(common.getDayOfWeekText(dow)) === false
      });
      setDeliveryDows(disbaledDows);
    }
  }, [selectedDowList.list])

  return (
    <DeliveryDateWrapper>
      <TitleGroup>
        <Title>첫배송 희망일 선택</Title>
      </TitleGroup>
      <DaypickerContainer
        mode="single"
        locale={ko}
        showOutsideDays
        disabled={
          holidayList
        }
        daysOfWeek={[0, 1]}
        selected={(new Date(deliveryDateStateInfo.deliveryDate))}
        onSelect={handleDaypicker}
      />
    </DeliveryDateWrapper>
  );
}

export default DeliveryDate;