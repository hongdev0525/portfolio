import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { withdrawState } from "state/user";
import { fontWeight, device } from "component/common/GlobalComponent";


const WithdrawWrapper = styled.div`
  position: absolute;
  top:0;
  left:0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
`
const WithdrawContainer = styled.div`
  margin-top: 400px;
  width: 487px;
  height: 238px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fefefe;
  border-radius: 5px;
  z-index: 10;
  padding:30px;

  div{
    p{
      width: 100%;
      padding: 40px 0 70px;
      border-bottom: 1px solid #DBDBDB;
      text-align: center;
      color:#707070;
    }
  }

  @media ${device.mobileL} {
    width: 279px;
    height: 145px;
      padding:40px 30px;
        div{
        p{
          font-size: 14px;
          font-weight: ${fontWeight("regular")};
          width: 100%;
          padding: 0;
          padding-bottom: 30px;
          border-bottom: 1px solid #DBDBDB;
          text-align: center;
        }
      }
  }

`
const WithdrawBackground = styled.div`
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  z-index: 5;
  `;

const ConfirmButton = styled.button`
  border: none;
  background-color: #fefefe;
  font-size: 20px;
  font-weight: ${fontWeight("medium")};
  cursor: pointer;
  margin-top: 26px;

  @media ${device.mobileL} {
  font-size: 16px;
  margin-top: 14px;
  margin-bottom: 14px;
   
  }
`


function WithdrawModal() {
  const setWithdrawState = useSetRecoilState(withdrawState);
  const handleConfrimModal = () => {
    setWithdrawState((oldState) => {
      return {
        ...oldState,
        modalActive: false,
      }
    })
  }

  return (
    <WithdrawWrapper >
      <WithdrawContainer>
        <div> <p> 현재 구독 중인 상품이 있어 회원 탈퇴가 불가합니다.</p></div>
        <ConfirmButton type="button" onClick={handleConfrimModal}>확인</ConfirmButton>
      </WithdrawContainer>
      <WithdrawBackground></WithdrawBackground>
    </WithdrawWrapper>
  );
}

export default WithdrawModal;