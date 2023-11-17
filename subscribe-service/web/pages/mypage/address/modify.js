import styled from "styled-components";
import MypageAddressModfiy from "component/mypage/address/MypageAddressModify";

const AddressModifyManagementWrapper = styled.div`
`

function AddressModifyManagement({ subsNo, addressNo }) {
  return (
    <AddressModifyManagementWrapper>
      <MypageAddressModfiy subsNo={subsNo} addressNo={addressNo}></MypageAddressModfiy>
    </AddressModifyManagementWrapper>
  );
}

export default AddressModifyManagement;


export const getServerSideProps = async (context) => {
  const { query } = context;
  const { subsNo, addressNo } = query;

  if (!subsNo || !addressNo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      subsNo: subsNo,
      addressNo: addressNo,
    },
  };
};