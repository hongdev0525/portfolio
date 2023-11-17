import AddAddress from "component/address/AddAddress";
import MypageAddAddress from "component/mypage/address/MypageAddAddress";
import styled from "styled-components";


const MypageAddAddressMainWrapper = styled.div``

function MypageAddAddressMain() {
  return (
    <MypageAddAddressMainWrapper>
      <MypageAddAddress></MypageAddAddress>
    </MypageAddAddressMainWrapper>
  );
}

export default MypageAddAddressMain;