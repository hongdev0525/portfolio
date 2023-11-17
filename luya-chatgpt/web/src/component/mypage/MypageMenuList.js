"use client"
import styled from "styled-components"
import { FaRobot } from "react-icons/fa";
import { PiHandsPrayingDuotone } from "react-icons/pi";
const MypageMenuListWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
`

const MenuList = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* flex-direction: column; */
`
const Menu = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 48%;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(120, 120, 120, 0.2);
  background-color: #fefefe;
  color:#636363;
  padding: 20px;
  font-size:16px;
  text-align: center;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  color:#e2a26a;
  margin-bottom: 18px;
`

function MypageMenuList() {
  return (
    <MypageMenuListWrapper>
      <MenuList>
        <Menu>
          <IconContainer><FaRobot size="42"></FaRobot></IconContainer>
          루야AI
        </Menu>
        <Menu>
          <IconContainer><PiHandsPrayingDuotone size="42"></PiHandsPrayingDuotone></IconContainer>
          기도제목
        </Menu>
      </MenuList>
    </MypageMenuListWrapper>
  );
}

export default MypageMenuList;