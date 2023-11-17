import { fontWeight } from 'component/common/CommonComponent';
import styled, { css } from 'styled-components'
import { device } from "component/common/GlobalComponent";


export const Title = styled.div`
    font-size: 24px;
    font-weight:${fontWeight("medium")};
    line-height: 28px;
    margin-bottom: 4px;
    @media ${device.mobileL} {
      font-size :20px;
      line-height: 28px;
      margin-bottom: 5px;
      padding:0;
    }
`

export const SubsTitle = styled.div`
    font-size: 14px;
    font-weight:${fontWeight("regular")};
    opacity: .5;
    @media ${device.mobileL} {
      font-size :12px;
      line-height: 14px;
      font-weight: ${fontWeight("regular")};
      margin-bottom: 10px !important;
    }
`

export const TitleGroup = styled.div`
  margin-bottom: 20px;
  @media ${device.mobileL} {
    margin-bottom: 30px;
    }
`


export const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
`

export const GroupButton01 = styled.button`
    width: 50%;
    height: 56px;
    font-size: 16px;
    line-height: 27px;
    font-weight: ${fontWeight("regular")};
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border:none;
    cursor: pointer;
    transition: all .4s ease;

    ${props => props.active == true ?
    css`
        color:#fefefe;
        background-color: #DC5F00;
        font-weight: ${fontWeight("bold")};
     `
    :
    css`
        color:#a9a9a8;
        background-color: #fefefe;
        border: 1px solid #A9A9A8;
     `
  }
`
export const GroupButton02 = styled(GroupButton01)`
    border-radius: 0;
    height: 56px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`

