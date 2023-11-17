"use client"
import styled from "styled-components"
import Image from "next/image";
import Link from "next/link";

const BackWardContainer = styled.div`
  width: 100%;
  img{
    opacity: 0.4;
  }
  
`

function BackWard({ url }) {
  return (
    <BackWardContainer>
      <Link href={url}>
        <Image
          src="/img/left-arrow.png"
          width={30}
          height={30}
          alt="backward icon"
        ></Image>
      </Link>
    </BackWardContainer>

  );
}

export default BackWard;