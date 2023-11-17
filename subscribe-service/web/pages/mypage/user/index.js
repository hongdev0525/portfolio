import ConfirmUser from "component/mypage/user/ConfirmUser";
import styled from "styled-components";
import { Container } from "../../../component/common/GlobalComponent";

const UserManagementWrapper = styled(Container)``

function UserManagement() {
  return (
    <UserManagementWrapper>
      <ConfirmUser></ConfirmUser>
    </UserManagementWrapper>
  );
}

export default UserManagement;