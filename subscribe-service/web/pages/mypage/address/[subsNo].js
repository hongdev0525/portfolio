import MypageAddresss from "component/mypage/address/MypageAddress";
import styled from "styled-components";
import { Container } from "../../../component/common/GlobalComponent";

const AddressManagementWrapper = styled.div`
`

function AddressManagement({ subsNo }) {
  return (
    <AddressManagementWrapper>
      <MypageAddresss subsNo={subsNo}></MypageAddresss>
    </AddressManagementWrapper>
  );
}

export default AddressManagement;


export const getServerSideProps = async (context) => {
  return { props: { subsNo: context.params.subsNo } };
};