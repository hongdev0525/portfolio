"use client"
import styled from "styled-components";
import BusinessInformation from "@/component/common/BusinessInformation";
const BusinessWrapper = styled.div`
  width: 100%;
`


function BusinessMain() {
  return (
    <BusinessWrapper>
      <BusinessInformation></BusinessInformation>
    </BusinessWrapper>
  );
}

export default BusinessMain;