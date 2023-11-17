"use client";
import styled from "styled-components";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaRobot } from "react-icons/fa";
import { PiHandsPrayingDuotone } from "react-icons/pi";
import { AiFillHome } from "react-icons/ai";
import { menuState } from "@/state/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

const CommonFooterWrpper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 750px;
  background-color: #fefefe;
`;

const CommonFooterContainer = styled.div`
  border-top: 1px solid #e5e5e5;
  /* border-top: 1px solid #e2a26a; */
  padding: 10px 20px;
`;

const MenuList = styled.ul`
  display: flex;
  justify-content: space-between;
  /* margin-bottom: 10px; */
`;

const Menu = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  font-size: 14px;
  cursor: pointer;
  img {
    margin-bottom: 6px;
    object-fit: cover;
  }
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-direction: column;
  }
  p {
    ${(props) =>
    props.active === true ? "color:var(--color-set05);" : "color:var(--color-set07);"}
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  ${(props) => (props.active === true ? "color:var(--color-set05);" : "color:var(--color-set07);")}
`;

function CommonFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const menuStatInfo = useRecoilValue(menuState);
  const setMenuState = useSetRecoilState(menuState);
  const links = [
    {
      index: 0,
      href: "/home",
      icon: <AiFillHome size={26} />,
      label: "홈",
    },
    {
      index: 1,
      href: "/advice",
      icon: <FaRobot size={26} />,
      label: "루야AI",
    },
    {
      index: 2,
      href: "/pray",
      icon: <PiHandsPrayingDuotone size={26} />,
      label: "기도제목",
    },
    // Add more links here if needed
    // {
    //   href: "/mypage",
    //   icon: <FiSettings size={26} />,
    //   label: "마이페이지",
    // },
  ];

  const handleRouter = (link, index) => {
    router.push(link)
    if (menuStatInfo.activeIndex !== index) {
      setMenuState(prev => {
        return {
          ...prev,
          prevIndex: prev.activeIndex,
          activeIndex: index,
        }
      })
    }
  }

  return (
    <CommonFooterWrpper>
      <CommonFooterContainer>
        <MenuList>
          {links.map((link) => (
            <Menu key={link.href} active={pathname === link.index} onClick={() => handleRouter(link.href, link.index)} >
              <IconContainer active={pathname === link.href}>{link.icon}</IconContainer>
              <p>{link.label}</p>
            </Menu>
          ))}
        </MenuList>
      </CommonFooterContainer>
    </CommonFooterWrpper >
  );
}

export default CommonFooter;
