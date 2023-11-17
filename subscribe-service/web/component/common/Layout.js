import styled, { css } from 'styled-components'
import Navigation from "./Navigation";
import Footer from './Footer';
import Router from 'next/router'
import LoadingSpinner from './LoadingSpinner';
import { commonState } from '../../state/common';
import { loggedInState } from '../../state/common';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { scrollState } from '../../state/common';
import { isMobile } from 'react-device-detect';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner'

import { common } from 'public/js/common';

const LayoutWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: .9;
  position: fixed;
  top:0;
  left:0;
  height: 100vh;
  width: 100vw;
  background-color: #fcfcfc;
  z-index: 99999;
`;
const LoadingContainer = styled.div`

`;



function Layout({ children }) {
    const setLoading = useSetRecoilState(commonState);
    const isLoading = useRecoilValue(commonState)
    const loggedInStateInfo = useRecoilValue(loggedInState);
    const setLoggedInState = useSetRecoilState(loggedInState)
    const setScrollState = useSetRecoilState(scrollState)
    const [mobile, setMobile] = useState();

    //scroll event
    useEffect(() => {
        const handleScroll = (event) => {
            setScrollState((oldState) => {
                return {
                    ...oldState,
                    scrollValue: window.scrollY
                }
            })
        };
        window.addEventListener('scroll', handleScroll);
        setMobile(isMobile);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    useEffect(() => {
        const handleStart = () => {
            const loginState = JSON.parse(localStorage.getItem('loggedIn')) ? JSON.parse(localStorage.getItem('loggedIn')).value : false;
            setLoggedInState(loginState);
            setLoading(true)
        };
        const handleComplete = () => setLoading(false);
        const handleBeforeHistoryChange = (path) => {
            common.loginCheck(path.split("?")[0])
        }
        Router.events.on("beforeHistoryChange", handleBeforeHistoryChange);
        Router.events.on("routeChangeStart", handleStart);
        Router.events.on("routeChangeComplete", handleComplete);
        Router.events.on("routeChangeError", handleComplete);
        return () => {
            Router.events.off("routeChangeStart", handleStart);
            Router.events.off("routeChangeComplete", handleComplete);
            Router.events.off("routeChangeError", handleComplete);
            Router.events.off("beforeHistoryChange", handleBeforeHistoryChange);

        };
    }, [Router, setLoading]);




    return (
        <LayoutWrapper mobile={mobile}>
            <Navigation></Navigation>
            {children}
            {isLoading === true && <LoadingSpinner></LoadingSpinner>}
            <Footer></Footer>
        </LayoutWrapper>
    );
}

export default Layout;