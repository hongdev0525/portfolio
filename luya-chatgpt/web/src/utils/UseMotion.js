"use client"
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuState } from "@/state/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from 'styled-components';

const UserMotionContainer = styled(motion.div)`
  width: 100%;
`

const UseMotion = ({ children, delay = 0 }) => {
  const pageKey = usePathname();
  const menuStatInfo = useRecoilValue(menuState);
  const setMenuState = useSetRecoilState(menuState);
  const direction = menuStatInfo.prevIndex < menuStatInfo.activeIndex ? 1 : -1;
  const variants = {
    inactive: {
      opacity: 1,
      y: 0,
      transition: {
        duration: .8,
        ease: 'easeInOut',
        delay: delay
      },
    },
    out: {
      opacity: 0,
      y: -60,
      transition: {
        duration: .8,
        ease: 'easeInOut',
        delay: delay
      }
    },
    in: {
      y: 60,
      opacity: 0,
      transition: {
        duration: .8,
        ease: 'easeInOut',
        delay
      }
    },
  };
  return (
    <AnimatePresence>
      <UserMotionContainer
        key={pageKey}
        variants={variants}
        initial="in"
        animate="inactive"
        exit="out"
      >
        {children}
      </UserMotionContainer>
    </AnimatePresence>
  );
};

export default UseMotion;
