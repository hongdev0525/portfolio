import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import styled, { css } from "styled-components";
import { customAxios } from "public/js/customAxios";
import { device, fontWeight } from "component/common/GlobalComponent";
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import { isMobile } from "react-device-detect";
const MenuListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 156px;
  margin-bottom: 200px;
  @media ${device.mobileL} {
    margin: 110px 0;
  }
`

const MenuListContainer = styled.div`
  width: 1338px;
  @media ${device.mobileL} {
    width: 100%;
  }
`
const MenuListTtileGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 156px;
  @media ${device.mobileL} {
    margin-bottom: 64px;

  }
`
const Ttile = styled.div`
  font-size:56px;
  font-weight: ${fontWeight("bold")};
  line-height: 78px;
  & > span{
    color:#DC5F00;
  }
  @media ${device.mobileL} {
    font-size:25px;
    line-height: 28px;
    margin-bottom: 11px;
  }
`
const SubTile = styled.div`
  font-size: 24px;
  line-height: 32px;
  font-weight: ${fontWeight("regular")};
  color:#4D4D4D;
  @media ${device.mobileL} {
    text-align: center;
    font-size:16px;
    line-height: 22px;
  }
`

const WeekTabsContainer = styled.div`
  display: flex;
  justify-content: center;
`
const WeekTabGruop = styled.ul`
  display: flex;
  justify-content: space-between;
  width: 589px;
  margin-bottom: 141px;
  border-bottom: 1px solid #e5e5e5;
  @media ${device.mobileL} {
    border-bottom :none;
    padding: 0 29px;
    margin-bottom: 40px;
  }
`
const Tab = styled.li`
  position: relative;
  font-size:28px;
  line-height: 50px;
  cursor:pointer;
  ${props => {
    return props.active === true ? css`
      &:after{
    content:"";
    position: absolute;
    bottom: -1px;
    left:0;
    width:100%;
    height: 2px;
    background-color: #DE511D;
  };
    `:
      ""
  }}
  ${props => {
    return props.active === true ? css`color: #DE511D; font-weight: ${fontWeight("semiBold")};` : css`color: #A9A9A8;`
  }};
  @media ${device.mobileL} {
    text-align: center;
    font-size:16px;
    line-height: 22px;
  }
`
const MenuInfoListContainer = styled.div`
    display: flex;
    justify-content: center;
`

const MenuInfoList = styled(Swiper)`
  display: flex;
  align-items: flex-end;
  padding-bottom:30px;
  width: 100%;
  padding-top: 60px;
  .swiper-wrapper{
    align-items: flex-end;
  }
  .swiper-slide{
    position: relative;
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-height: 346px;
    box-shadow: 5px 5px 30px rgba(0,0,0,.05);
    background-color: #fcfcfc;
    border-radius: 10px;
    padding:44px 38px;
    cursor: pointer;
  }
  @media ${device.mobileL} {
    /* text-align: center; */
    font-size:16px;
  padding-bottom:40px;

    line-height: 22px;
    .swiper-slide{
 
    padding:50px 34px;
  }
  }
`
// const MenuInfo = styled(SwiperSlide)`
//   transition: all .6s ease;
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   width: 214px;
//   min-height: 346px;
//   box-shadow: 5px 5px 30px rgba(0,0,0,.05);
//   background-color: #fcfcfc;
//   border-radius: 10px;
//   padding:44px 38px;
//   cursor: pointer;
//   margin: 0 15px;
//   ${props => {
//     console.log('props', props)
//     return props.active === true ?
//       css`
//         width: 344px !important;
//         height: 520px !important;;
//         padding:  61px 63px 60px;
//       `
//       :
//       css`
//         width: 214px !important;
//         height: 346px !important;
//         padding:  44px 38px;
//       `
//   }}

//   @media ${device.mobileL} {
//     width:auto;
//     text-align: center;
//     font-size:16px;
//     line-height: 22px;
//   }

// `

const MenuInfoLabel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0%;
  left: 50%;
  background-image: ${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? 'url("/img/main/web/redCalendar.png");' : 'url("/img/main/web/blueCalendar.png");'
  }};
  
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  transition: all .6s ease;
  width:92px;
  height: 96px;
  transform: translate(-50%,-60%);
  padding-top: 33px;
  /* ${props => {
    return props.active === true ?
      css`
      width:130px;
      height: 132px;
      transform: translate(-50%,-70%);
      padding-top: 47px;
    `
      :
      css`
      width:92px;
      height: 96px;
      transform: translate(-50%,-60%);
      padding-top: 33px;
    `
  }} */
  
  &>span{
  transition: all .6s ease;

    color:${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek == 4 ? "#DE511D" : "#28455A"
  }};
    font-weight: ${fontWeight("semiBold")};
    font-size:   16px
  }
  &> p{
  transition: all .6s ease;

  color:${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? "#DE511D" : "#28455A"
  }};
    font-weight: ${fontWeight("semiBold")};
    font-size:  28px;
    font-size:   ${props => {
    return props.active === true ? "36px" : "28px"
  }};

  }

   @media ${device.mobileL} {
    padding-top: 25px;
    width:84px;
    height: 84px;
    &> p{

    font-size:  20px;
    line-height : 25px
  }
 }

`

const Product = styled.div`
    transition: all .6s ease;

  ${props => {
    return props.active == true ?
      css`
      margin-top: 30px;
    `
      :
      css`
     margin-top: 14px;
     `
  }};
 
  
  & > span{
    transition: font-size .6s ease;
    color:${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? "#DE511D" : "#28455A"
  }};
    opacity: ${props => {
    return props.dayOfWeek === 2 || props.dayOfWeek === 4 ? 1 : .6
  }};
    font-weight: ${fontWeight("semiBold")};
    font-size: ${props => {
    return props.active == true ? "32px" : "16px"

  }};
    ${props => {
    return props.active == true ?
      css`
        font-size: 20px;
        line-height: 28px;
      `
      :
      css`
      font-size: 16px;
      line-height: 20px;
      `
  }};
  }

  & ul{
    display: flex;  
    flex-direction: column;
  }

  & li{
    color:#243342;
    font-weight: ${fontWeight("semiBold")};
    ${props => {
    return props.active == true ?
      css`
      font-size: 20px;
      line-height: 28px;
    `
      :
      css`
     font-size: 15px;
     line-height: 20px;
     `
  }};
    transition: all .6s ease;

  }
`


const NoticeDots = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  width: 1358px;
  margin-top: 33px;
  @media ${device.mobileL} {
    width: 100%;
    margin-top: 10px;
    padding-right: 24px;
  }
`

const MonthlyMenuButton = styled.div`
display: flex;
justify-content: center;
align-items: center;
font-size:24px;
width: fit-contents;
height: 60px;
border: 1px solid #DE511D;
background-color: #FFF9F5;
border-radius: 20px;
padding: 20px;
a{
  color:#DE511D;
}
@media ${device.mobileL} {
    width: 131px;
    font-size:14px;
    height: 46px;
    margin-top: 50px;
  }
`

const Dot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 23px;
  margin-left: 22px;
  color:${props => {
    return props.dot == "blue" ? "#28455A" : "#DE511D"
  }};
  & > span{
    display: block;
    width:16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 8px;
    background-color:${props => {
    return props.dot == "blue" ? "#28455A" : "#DE511D"
  }};
  }

  @media ${device.mobileL} {
    font-size: 12px;
    line-height: 16.5px;
     margin-left: 10px;

      & > span{
            display: block;
            width:8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 2px;
            background-color:${props => {
    return props.dot == "blue" ? "#28455A" : "#DE511D"
  }};
      }
  }
`

function getWeekOfMonth(date) {
  let adjustedDate = date.getDate() + date.getDay();
  let prefixes = ['0', '1', '2', '3', '4', '5'];
  return (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
}


function getWeekNumberOfMonth() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return Math.ceil((firstDay + totalDays) / 7);
}

// const getWeekNumberOfMonth = () => {
//   var today = new Date()
//   var firstDay = new Date(today.setDate(1)).getDay();
//   var totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
//   return Math.ceil((firstDay + totalDays) / 7);
// }


function MenuList() {

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuInfoList, setMenuInfoList] = useState();
  const [mobile, setMobile] = useState(false);
  const weekNumberOfThisMonth = getWeekNumberOfMonth();
  const dows = ["월", "화", "수", "목", "금"];

  const getMenuListOfWeek = async () => {
    return await customAxios({
      method: "get",
      params: {
        week: parseInt(activeIndex),
      },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/main/menulist`,
    })
  }

  useQuery(['getMenuListOfWeek', activeIndex], getMenuListOfWeek, {
    enabled: activeIndex != null,
    onSuccess: (res) => {
      const response = res.data.data;
      console.log('response', response)
      if (res.data.status === "success") {
        setMenuInfoList(response)
      } else {
        setMenuInfoList(null)

      }
    },
    onError: (error) => {
      console.error("Error Occured : ", error);
    }

  })


  const handleMenuListTabs = (index) => {
    console.log('tabIndex', index)
    setActiveIndex(index)
  }

  const handleMouseOver = (index) => {
    setActiveMenu(index);
  }


  useEffect(() => {
    var d = new Date();
    var dow = d.getDay();
    var weekOfMonth = getWeekOfMonth(d);
    setActiveIndex(weekOfMonth);
    setActiveMenu(dow);
  }, [])


  useEffect(() => {
    setMobile(isMobile);
  }, [])

  useEffect(() => {
    if (menuInfoList) {
      setActiveMenu(Math.floor(menuInfoList.deliveryDates.length / 2))
    }
  }, [menuInfoList])


  return (
    <MenuListWrapper>
      <MenuListContainer>
        <MenuListTtileGroup>
          {mobile === true ? <Ttile><span>이번주 식단</span>은 뭘까요~?</Ttile> : <Ttile>현관앞 키친 <span>이번주 식단</span>은 뭘까요~?</Ttile>}
          <SubTile>수요일, 금요일은 아이들 반찬으로 {mobile && <br></br>} 아이도 먹고 나도 먹고</SubTile>
        </MenuListTtileGroup>
        <WeekTabsContainer>
          <WeekTabGruop>
            {[...Array(weekNumberOfThisMonth)].map((element, index) => {
              const weeekText = (index) => {
                let tmp = null;
                switch (index) {
                  case 0:
                    tmp = "첫째";
                    break;
                  case 1:
                    tmp = "둘째";
                    break;
                  case 2:
                    tmp = "셋째";
                    break;
                  case 3:
                    tmp = "넷째";
                    break;
                  case 4:
                    tmp = "다섯째";
                    break;
                  case 5:
                    tmp = "여섯째";
                    break;
                }
                return tmp
              }
              return <Tab key={`weekNumber${index}`} active={activeIndex === index + 1 ? true : false} onClick={() => handleMenuListTabs(index + 1)}>{weeekText(index)}주</Tab>
            })}
          </WeekTabGruop>
        </WeekTabsContainer>
        <MenuInfoListContainer>
          <MenuInfoList
            slidesPerView={1.5}
            breakpoints={{
              475: {
                slidesPerView: 5,
                spaceBetween: 32
              },
            }}
            initialSlide={new Date().getDay() - 1}
            // initialSlide={2}
            spaceBetween={25}
            grabCursor={true}
            centeredSlides={mobile ? true : false}
            centerInsufficientSlides={!mobile ? true : false}
          >
            {menuInfoList && menuInfoList.deliveryDates && menuInfoList.deliveryDates.map((deliveryDate, index) => {
              const dayOfWeek = new Date(deliveryDate).getDay();
              return (

                <SwiperSlide
                  key={`menuInfo${deliveryDate}${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  active={activeMenu === index ? 1 : 0}
                >
                  <MenuInfoLabel key={`label${deliveryDate}`} dayOfWeek={dayOfWeek}>
                    <span>{dows[dayOfWeek - 1]}요일</span>
                    <p>{new Date(deliveryDate).getDate() < 10 ? "0" + new Date(deliveryDate).getDate() : new Date(deliveryDate).getDate()}</p>
                  </MenuInfoLabel>
                  {
                    menuInfoList.bundles.map((menuInfo) => {
                      const bundleMenuList = menuInfo.BundleType === "샐러드" ? menuInfo.Product.split("/") : menuInfo.Product.split(",")

                      if (menuInfo.DeliveryDate === deliveryDate) {
                        return (
                          <Product key={`${menuInfo.BundleType}${menuInfo.BundleNo}`} dayOfWeek={dayOfWeek}>
                            <span>{menuInfo.BundleType}</span>
                            <ul>
                              {
                                bundleMenuList.map((menu, idx) => {
                                  return <li key={`menu${menuInfo.BundleNo + idx}`}>{menu}</li>;
                                })
                              }
                            </ul>
                          </Product>
                        )
                      }
                    })
                  }
                </SwiperSlide>
              )
            })
            }
          </MenuInfoList>
        </MenuInfoListContainer>
      </MenuListContainer>
      <NoticeDots>
        <Dot dot={"blue"}>
          <span ></span>
          일반식단
        </Dot>
        <Dot dot={"orange"}>
          <span ></span>
          어린이식단
        </Dot>
      </NoticeDots>
      <MonthlyMenuButton>
        <Link href="/menu">월별 메뉴보기</Link>
      </MonthlyMenuButton>
    </MenuListWrapper>
  );
}




export default MenuList;
