"use client"
import styled from "styled-components"
import Image from "next/image"

const PrayTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 35px;
`
const PrayTitleText = styled.p`
  font-size: 18px;
  color:#e2a26a;
  font-weight: 600;
`
const PrayTitleImage = styled(Image)`
  margin-bottom: 8px;
`

function PrayTitle() {
  return (
    <PrayTitleContainer>
      <PrayTitleImage
        src="/img/bible.png"
        width={80}
        height={80}
        alt="pray title icon"
      ></PrayTitleImage>
      <PrayTitleText>
        나의 기도제목
      </PrayTitleText>
    </PrayTitleContainer>
  );
}

export default PrayTitle;