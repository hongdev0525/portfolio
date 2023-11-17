"use client"
import styled from 'styled-components'
import AskComponent from '@/component/advice/AskComponent'

const AdvicePageWrapper = styled.div`  
  width:100%;
  height: 100%;
`

export default function AdvicePage() {
  return (
    <AdvicePageWrapper >
      <AskComponent></AskComponent>
    </AdvicePageWrapper>
  )
}
