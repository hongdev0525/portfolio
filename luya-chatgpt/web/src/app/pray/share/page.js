"use client"

import styled from "styled-components"
import PrayShare from "@/component/pray/PrayShare";
const PrayShareWrapper = styled.div`
  width: 100%;
`



function PrayShareMain() {
  return (
    <PrayShareWrapper>
      <PrayShare></PrayShare>
    </PrayShareWrapper>
  );
}

export default PrayShareMain;