import styled from "styled-components";
import MenuCalendar from "component/menu/MenuCalendar";

const MenuMainWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`

function MenuMain() {
  return (
    <MenuMainWrapper>
      <MenuCalendar></MenuCalendar>
    </MenuMainWrapper>
  );
}

export default MenuMain;