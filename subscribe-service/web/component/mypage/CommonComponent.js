import { fontWeight,device } from 'component/common/GlobalComponent'
import styled from 'styled-components'


export const MenuTitle = styled.div`
    font-size: 24px;
    font-weight:bold;
    margin-bottom: 24px;
`

export const MypageButton = styled.button`
    border: none;
    outline: none;
    width: 100%;
    height: 56px;
    color:#fefefe;
    background-color: #DC5F00;
    border: 1px solid  #DBDBDB;
    border-radius: 5px;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.1);
    font-size: 18px;
    font-weight: ${fontWeight("bold")};
    cursor: pointer;
    @media ${device.mobileL} {
        height: 48px;
        font-size: 16px;
        font-weight: ${fontWeight("semiBold")};

    }
`