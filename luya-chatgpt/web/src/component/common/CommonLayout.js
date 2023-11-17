"use client"
import styled from "styled-components"
import CommonHeader from "./CommonHeader";
import CommonBottomMenu from "./CommonBottomMenu";
import CommonAlert from "./CommonAlert";
import CommonConfirm from "./CommonConfirm";
import Footer from "./Footer";
import NavigationEvents from '@/utils/NavigationEvent';
import useAlert from "@/utils/useAlert/UseAlert";
import useConfirm from "@/utils/useConfirm/UseConfirm";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { loadingState } from "@/state/common";
import { useRecoilValue } from "recoil";

const Layout = styled.div`
  position: relative;
  display : flex;
  flex-direction : column;
  min-height:100vh;
  max-width: 750px;
  margin: 0 auto;
  height: 100%;
  padding-bottom: 60px;

`
const ChildrenContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  height: auto;
  min-height: calc( 100vh - 139px );

`


function CommonLayout({ children }) {
  const pathName = usePathname();
  const { alertStateInfo } = useAlert();
  const { confirmStateInfo } = useConfirm();
  const loadingStateInfo = useRecoilValue(loadingState);


  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          },
          (err) => {
            console.log('Service Worker registration failed:', err);
          }
        );
      });
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('prevUrl', pathName);
  }, [pathName])

  return (
    <Layout>

      {alertStateInfo.active === true &&
        <CommonAlert></CommonAlert>
      }
      {confirmStateInfo.active === true &&
        <CommonConfirm></CommonConfirm>
      }
      <NavigationEvents>
        <ChildrenContainer>
          <CommonHeader></CommonHeader>
          {
            loadingStateInfo.active == true &&
            <LoadingSpinner></LoadingSpinner>
          }
          {children}
        </ChildrenContainer>
      </NavigationEvents>
      <CommonBottomMenu></CommonBottomMenu>
    </Layout>
  );
}

export default CommonLayout;