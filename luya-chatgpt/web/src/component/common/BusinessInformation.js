
"use client"
import styled from "styled-components";
import Image from "next/image";
import { CommonWrapper } from "./CommonComponent";

const InformationWrapper = styled(CommonWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 60px;
  width: 100%;
  
`

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 30px;
  padding:30px;
`


const InformationTable = styled.table`
width: 100%;
border-spacing: 0 16px;
`

const InformationTableBody = styled.tbody`

`
const InformationTr = styled.tr`
`
const InformationTd = styled.td`
  display: flex;
  justify-content: space-between;
  width: 100%;
  span{
    display: block;
    width: 28%;
    font-size: 14px;
    font-weight: 300;
    line-height: 21px;
  }
  p{
    font-size: 14px;
    line-height: 21px;
    text-align: right;
  }
`

function BusinessInformation() {
  return (
    <InformationWrapper>
      <Image src={"/img/logo/logo.png"} width={120} height={120} alt="로고 이미지"></Image>
      <InformationContainer>
        <InformationTable>
          <InformationTableBody>
            <InformationTr>
              <InformationTd>
                <span>법인명</span> <p>주식회사 코이코드</p>
              </InformationTd>
            </InformationTr>
            <InformationTr>
              <InformationTd>
                <span>대표이사</span> <p>정규인</p>
              </InformationTd>
            </InformationTr>
            <InformationTr>
              <InformationTd>
                <span>이메일</span> <p>koicode@koicode.co.kr</p>
              </InformationTd>
            </InformationTr>
            <InformationTr>
              <InformationTd>
                <span>사업자등록번호</span> <p>259-86-00867</p>
              </InformationTd>
            </InformationTr>
            <InformationTr>
              <InformationTd>
                <span>주소</span> <p>서울특별시 서초구 강남대로 51길 10 <br></br>(효성해링턴타워 지하1층 109-28호)</p>
              </InformationTd>
            </InformationTr>
          </InformationTableBody>
        </InformationTable>

        {/* (<a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2598600867">사업자정보 확인</a>) */}
      </InformationContainer>
    </InformationWrapper>

  );
}

export default BusinessInformation;