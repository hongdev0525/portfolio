import { fontWeight, device } from "component/common/GlobalComponent";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { subscribeCalendarState } from "state/mypage";
import styled from "styled-components";

const MenuListOfDayWrapper = styled.div`
  min-height: 176px;
  margin: 30px  0px;
  @media ${device.mobileL} {
    min-height: 0px;
  }
`
const MenuListOfDayContainer = styled.div`
  background-color: #F6F6F9;
  border-radius: 5px;
  padding: 20px;
  span{
    display: block;
  }
`

const MenuInfo = styled.div`
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 7px;
  span{
    display: block;
    font-weight: ${fontWeight("bold")};
    color: #767676;
  }


`

function MenuListOfDay({ subsNo }) {

  const subscribeCalendarStateInfo = useRecoilValue(subscribeCalendarState(subsNo));

  return (
    <MenuListOfDayWrapper>
      {subscribeCalendarStateInfo.menuList && subscribeCalendarStateInfo.menuList?.length !== 0 &&
        <MenuListOfDayContainer>
          {subscribeCalendarStateInfo.menuList?.map(menu => {
            return (
              <MenuInfo key={`${menu.bundleNo}`}>
                <span>{menu.bundleType}</span>
                <p>{menu.product}</p>
              </MenuInfo>
            )
          })}
        </MenuListOfDayContainer>
      }
    </MenuListOfDayWrapper>
  );
}

export default MenuListOfDay;