import styled, { css } from "styled-components";
import { DayContent, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ko from "date-fns/locale/ko";
import { format } from 'date-fns';
import { useState } from "react";
import { useQuery } from "react-query";
import { customAxios } from "public/js/customAxios";
import { useEffect } from "react";
import { common } from "public/js/common";
import { fontWeight } from "component/common/CommonComponent";
import { device } from "component/common/GlobalComponent";

const MenuCalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 180px;
  overflow-x: hidden;
  width: 900px;
  @media ${device.mobileL} {
    width: 400px;
    padding: 30px 0  0;
  }

`
const MenuCalendarContainer = styled(DayPicker)`
  display: flex;
  justify-content: center;
  --rdp-cell-size: 180px;
  font-size: 16px;
  & .rdp-months{
 
    padding:20px;
    border-radius: 10px;
    background-color: #fcfcfc ;
  }
  & .rdp-months{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & .rdp-day{
    border-radius: 0;
    height: fit-content;
    padding: 5px;
  }
  & .rdp-nav_button{
    width: 60px;
    height: 60px;
  }
  & .rdp-head_cell{
    font-size: 24px;
    height: 60px;
  }
  & .rdp-caption{
    display: flex;
    align-items: center;
    width: 900px;
    margin: 0 auto 48px;
  }
  & .rdp-caption_label{
    width: 180px;
    justify-content: center;
    font-size: 32px;
  }
  @media ${device.mobileL} {
    --rdp-cell-size: 70px;
  font-size: 11px;

    & .rdp-table{
      padding: 4px;
    }
    & .rdp-head_cell{
    font-size: 18px;
    /* height: 60px; */
  }
    & .rdp-caption{
    display: flex;
    align-items: center;
    width: 350px;
    margin: 0 auto 24px;
  }
  & .rdp-caption_label{
    justify-content: center;
    font-size: 24px;
  }
  }
`
const DateNumber = styled.div`
  width: 160px;
  background-color:${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? "#DE511D" : "#28455A"
  }};
  &> time{
    color: #fcfcfc;
  }
  @media ${device.mobileL} {
    width: 70px;
  }
`

const Product = styled.div`

  transition: all .6s ease;
  margin-top: 14px;
 text-align: left;
  
  & > span{
    transition: font-size .6s ease;
    display: block;
    color:${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? "#DE511D" : "#28455A"
  }};
      
    font-weight: ${fontWeight("semiBold")};
    font-size:  16px;
    line-height: 20px;
    margin-bottom: 8px;
      
  }

  & ul{
    display: flex;  
    flex-direction: column;
  }

  & li{
  color:#243342;
  font-weight: ${fontWeight("semiBold")};
  font-size: 15px;
  line-height: 20px;
  transition: all .6s ease;

  }
  @media ${device.mobileL} {
    padding: 4px;
    margin-top: 6px;

    & > span{
      /* text-align: center; */
    font-weight: ${fontWeight("semiBold")};
    font-size:  12px;
    line-height: 14px;
    margin-bottom: 4px;
      
  }
    & li{
      width: 100% !important;
  color:#243342;
  font-weight: ${fontWeight("semiBold")};
  font-size: 10px;
  line-height: 13px;
  transition: all .6s ease;
  }
  }
  
`

function getNextMonth() {
  let d = new Date();
  let sel_month = +2; // 월을 조절하시면 됩니다. -1이면 전달을 +1이면 다음달을..
  d.setMonth(d.getMonth() + sel_month);
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2);
  let day = ('0' + d.getDate()).slice(-2);
  let dt = year + "-" + month + "-" + day;
  return new Date(dt)
}


function MenuCalendar() {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1)
  const [menuInfo, setMenuInfo] = useState(null);


  const getMenuListOfMonth = async () => {
    console.log('activeMonth', activeMonth)
    return await customAxios({
      method: "get",
      params: {
        month: activeMonth
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/main/menucalendar`,
    })
  }

  useQuery(['getMenuListOfMonth', activeMonth], getMenuListOfMonth, {
    enabled: activeMonth != null,
    onSuccess: (res) => {
      const response = res.data.data;
      setMenuInfo(response);
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }
  })

  useEffect(() => {
    console.log('menuInfoƒ :>> ', menuInfo);
  }, [menuInfo])



  const DateContents = (props) => {
    const calendarDate = props.date
    const dateTime = format(props.date, 'yyyy-MM-dd');
    const dayOfWeek = new Date(calendarDate).getDay();
    return (
      <div>
        <DateNumber dayOfWeek={dayOfWeek}>
          <time dateTime={dateTime}>
            <DayContent {...props} />
          </time>
        </DateNumber>
        {
          menuInfo && menuInfo.length !== 0 ? menuInfo.map((menu) => {
            if (common.DateFormatting(menu.DeliveryDate) === common.DateFormatting(props.date) && menu.Product) {
              const bundleMenuList = menu.BundleType === "샐러드" ? menu.Product.split("/") : menu.Product.split(",")
              return (
                <Product key={`${menu.BundleType}${menu.BundleNo}`} dayOfWeek={dayOfWeek}>
                  <span>{menu.BundleType}</span>
                  <ul>
                    {
                      bundleMenuList.map((menu, idx) => {
                        return <li key={`${menu}${idx}`}>{menu}</li>;
                      })
                    }
                  </ul>
                </Product>
              )
            }
          }
          )
            :
            <p>미지정</p>
        }
      </div>
    );
  }

  const handleMonthChange = (date) => {
    console.log('date :>> ', date);
    const month = new Date(date).getMonth() + 1
    setActiveMonth(month)
  }


  return (
    <MenuCalendarWrapper>
      <MenuCalendarContainer
        mode="single"
        locale={ko}
        disabled={
          [
            { dayOfWeek: [0, 6] },
          ]
        }
        components={{ DayContent: DateContents }}
        daysOfWeek={[0, 1]}
        fromMonth={new Date()}
        toMonth={getNextMonth()}
        onMonthChange={handleMonthChange}

      />
    </MenuCalendarWrapper>
  );
}

export default MenuCalendar;