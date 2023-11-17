"use client"

import styled from "styled-components"

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 30px 20px 40px;
  background-color: #fefefe;
  p{
    font-size: 12px;
    font-weight: 300;
    text-align: center;

  }
`
const FooterContainer = styled.div`
 
  width: 100%;

`


const ContentList = styled.ul`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
`
const Content = styled.li`
  margin-right: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 300;
 
`


function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <ContentList>
          <Content>
            <a href="https://seed-bergamot-577.notion.site/f99dc9755aa049e2a152e69f9cce38e4?pvs=4">
              이용약관
            </a>
          </Content>
          <Content>
            <a href="https://seed-bergamot-577.notion.site/132efd5c0f1e4dbda987dbaea79bc391?pvs=4">
              개인정보처리방침
            </a>
          </Content>
          <Content>
            <a href="/business">
              사업자정보
            </a>
          </Content>
        </ContentList>

      </FooterContainer>
      <p>Copyright 2023 Koicode corp. All rights reserved.</p>
    </FooterWrapper>
  );
}

export default Footer;