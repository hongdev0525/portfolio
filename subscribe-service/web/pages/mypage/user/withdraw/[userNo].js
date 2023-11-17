import styled from "styled-components";
import WithdrawUser from "component/mypage/user/WithdrawUser";

const WithdrawMainWrapper = styled.div``


function WithdrawMain() {
  return (
    <WithdrawMainWrapper>
      <WithdrawUser></WithdrawUser>
    </WithdrawMainWrapper>
  );
}

export default WithdrawMain;