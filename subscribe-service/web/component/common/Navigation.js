import styled, { css } from 'styled-components'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { fontWeight } from 'component/common/CommonComponent'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { scrollState } from 'state/common'
import { isMobile } from 'react-device-detect'
import { MdMenu, MdClose } from 'react-icons/md'
import { useQuery } from 'react-query'
import { customAxios } from 'public/js/customAxios'
import { common } from 'public/js/common'
import { loggedInState } from 'state/common'
const NavigationWrapper = styled.div`
    height:fit-content ;
`
const NavigationFixedWrapper = styled.div`
    display: flex;
    justify-content:center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    transition: all .3s ease;
    background-color: #fcfcfc;
    box-shadow:  0 5px 30px rgba(0,0,0,.05);
    position: fixed;
            top:0;
            left:0;
            right: 0;
            z-index: 9999;
    /* ${props => {
        return props.headerFixed === true ? css`
           
        `: ''
    }} */
`

const NavigationContainer = styled.div`
    display: flex;
    justify-content:space-between;
    align-items: center;
    height: 62px;
    width: 1194px;
    margin: 0 auto;
`

const LogoContainer = styled.div`
    display: flex;
    align-items: flex-end;
    & > span{
        font-size: 22px;
        line-height: 26px;
    }
    cursor: pointer;
`

const MenuContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

`
const MenuList = styled.ul`
    display: flex;
    justify-items: flex-end;
    padding: 0 20px;
    & >  li:last-of-type{
        border-right: none;
        padding-right:0;
    }
`

const MenuWrapper = styled.div`
    position: relative;
`


const Menu = styled.li`
    font-size: 16px;
    font-weight: ${fontWeight("medium")};
    padding: 0 16px;
    cursor: pointer;
    border-right: 1px solid #919191;
`

const ExtraMenu = styled.div`
    font-size: 16px;
    font-weight: ${fontWeight("medium")};
    padding: 0 48px;
    cursor: pointer;
`

const EventBanner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #DC5F00;
    height: 52px;
    & > p{
        font-size: 24px;
        font-weight: 300;
        color:#fcfcfc;
    }
`

const MobileNavigation = styled.div`
    position: fixed;
    top: 0;
    left:0;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 55px;
    background-color: #fcfcfc;
    padding: 0 24px;
    z-index: 99999;
    box-shadow: 0 5px 30px rgb(0 , 0 ,0 , 0.05);
    ${props => {
        return props.headerFixed === true ? css`
            position: fixed;
            top:0;
            left:0;
            right: 0;
            z-index: 9999;
        `: ''
    }}
`

const MobileNavigationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:100%;
`

const MenuToggle = styled.div``
const MobileMenuContainer = styled(MenuContainer)`
    position: fixed;
    align-items: flex-start;
    width: 100%;
    height: 100vh;
    top:55px;
    left:0;
    z-index: 9999;
    background-color: #FFF9F5;
    transition: transform .3s ease-in;
    transform: ${props => props.active == true ? "translate(0,0)" : "translate(100%,0)"};
`

const MobileMenuList = styled(MenuList)`
    width: 100%;
    flex-direction: column;
    padding: 60px 15px;
`

const MobileMenu = styled(Menu)`
    font-size: 18px;
    font-weight: ${fontWeight("semiBold")};
    border-right: none;
    padding: 24px 0;
    text-align: center;
    /* padding: 0; */
    border-top: 1px solid #e5e5e5;
`

const CouponImg = styled(Image)`
    position: absolute;
    bottom: -60px;
    left: -95%;
    z-index: 9999;
    object-fit: cover;
    animation: couponAnimation 1.5s ease infinite;

    @keyframes couponAnimation {
        0%{
            transform: translate(0,0);
        }
        50%{
            transform: translate(0,30%);
        }
        100%{
            transform: translate(0,0);
        }
    }
`
const MobileCoupon = styled(CouponImg)`
    position: absolute;
    bottom: -60px;
    left:-33px;
`


function Navigation() {
    const [headerFixed, setHeaderFixed] = useState(false);
    const scrollValue = useRecoilValue(scrollState).scrollValue;
    const loggedInStateInfo = useRecoilValue(loggedInState);
    const setLoggedInState = useSetRecoilState(loggedInState)
    const [mobile, setMobile] = useState();
    const [mobileToggle, setMobileToggle] = useState(false)
    const [subscribeExist, setSubscribeExist] = useState(null);

    const getSubscribeList = async () => {
        return await customAxios({
            method: "get",
            withCredentials: true,
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/subscribe/list`,
        })
    }
    useQuery('getSubscribeList', getSubscribeList, {
        onSuccess: (res) => {
            if (res.data.data?.length !== 0) {
                setSubscribeExist(true);

            } else {
                setSubscribeExist(false);
            }
        },
        onError: (error) => {
            console.error("Error Occured : ", error);
        }
    })


    const requestLogout = async () => {
        return await customAxios({
            method: "GET",
            withCredentials: true,
            url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/logout`,
        })
    }


    const { refetch: requestLogoutRefetch } = useQuery('requestLogout', requestLogout, {
        enabled: false,
        onSuccess: (res) => {
            common.setItemWithExpireTime("loggedIn", false, 0);
            location.href = "/login"
        },
        onError: (error) => {
            console.error("Error Occured : ", error);
        }
    });


    const logout = () => {
        setMobileToggle(false);
        requestLogoutRefetch();
    }


    useEffect(() => {
        // const loginState = JSON.parse(localStorage.getItem('loggedIn')) ? JSON.parse(localStorage.getItem('loggedIn')).value : false;
        // setIsLogin(loginState)
        setMobile(isMobile)
    }, [Router])


    const handleRouting = (path) => {
        setMobileToggle(false);
        Router.push(path)
    }

    useEffect(() => {
        if (scrollValue >= 52) {
            setHeaderFixed(true);
        } else {
            setHeaderFixed(false);
        }
    }, [scrollValue])

    const handleToggle = (e) => {
        e.preventDefault();
        setMobileToggle(currentState => !currentState)
    }

    const handleSubscribeMenu = () => {
        setMobileToggle(false);
        if (subscribeExist === true && loggedInStateInfo===true) {
            alert("구독변경을 원하시면 마이페이지에서 구독변경 기능을 이용해주세요");
        }
        Router.push("/subscribe");

    }

    useEffect(() => {
        const loginState = JSON.parse(localStorage.getItem('loggedIn')) ? JSON.parse(localStorage.getItem('loggedIn')).value : false;
        setLoggedInState(loginState);
    }, [])

    useEffect(() => {
        const handleStart = () => {
            const loginState = JSON.parse(localStorage.getItem('loggedIn')) ? JSON.parse(localStorage.getItem('loggedIn')).value : false;
            setLoggedInState(loginState);
        };
        Router.events.on("routeChangeStart", handleStart);
        return () => {
            Router.events.off("routeChangeStart", handleStart);
        };
    }, [Router])
    return (
        <NavigationWrapper>
            {!mobile &&
                <>
                    <NavigationFixedWrapper headerFixed={headerFixed}>
                        <NavigationContainer>
                            <LogoContainer onClick={() => handleRouting("/")}>
                                <Image quality={100} width={132} height={46} src="/img/main/web/header_logo.png" alt='메인로고'></Image>
                                {/* <span>현관앞키친</span> */}
                            </LogoContainer>
                            <MenuContainer>

                                <MenuList>
                                    <Menu onClick={() => handleSubscribeMenu()}>구독하기</Menu>
                                    <Menu onClick={() => handleRouting("/experience")}>체험하기</Menu>
                                    {(loggedInStateInfo === false || loggedInStateInfo == null) &&
                                        <>
                                            <MenuWrapper>
                                                <Menu onClick={() => handleRouting("/signup")}>회원가입</Menu>
                                                {Router.pathname == "/" &&
                                                    <CouponImg src="/img/main/web/coupon.png" width={252} height={45} alt="쿠폰 이미지"></CouponImg>
                                                }
                                            </MenuWrapper>
                                            <Menu onClick={() => handleRouting("/login")}>로그인</Menu>
                                        </>}
                                    {(loggedInStateInfo === true) &&
                                        <>
                                            <Menu onClick={() => handleRouting("/mypage")}>마이페이지</Menu>
                                            <Menu onClick={() => logout("/login")}>로그아웃</Menu>
                                        </>}
                                </MenuList>
                            </MenuContainer>
                        </NavigationContainer>
                    </NavigationFixedWrapper>
                </>
            }
            {mobile &&
                <>
                    <MobileNavigation headerFixed={headerFixed}>
                        <MobileNavigationContainer>
                            <LogoContainer onClick={() => handleRouting("/")}>
                                <Image quality={100} width={94} height={29} src="/img/main/web/m_header_logo.png" alt='메인로고'></Image>
                            </LogoContainer>
                            <MenuContainer>
                                <MenuWrapper>
                                    {(loggedInStateInfo === false || loggedInStateInfo == null) &&
                                        <>
                                            <ExtraMenu onClick={() => handleRouting("/login")}>로그인</ExtraMenu>
                                            {Router.pathname == "/" &&
                                                <MobileCoupon src="/img/main/web/m_coupon.png" width={211} height={55} alt="쿠폰 이미지"></MobileCoupon>
                                            }
                                        </>
                                    }
                                </MenuWrapper>
                                <MenuToggle onClick={handleToggle}>
                                    {mobileToggle === false ? <MdMenu size={36}></MdMenu> : <MdClose size={36}></MdClose>}
                                </MenuToggle>
                            </MenuContainer>
                        </MobileNavigationContainer>
                    </MobileNavigation>
                    <MobileMenuContainer active={mobileToggle}>
                        <MobileMenuList>
                            <MobileMenu onClick={() => handleSubscribeMenu()}>구독하기</MobileMenu>
                            <MobileMenu onClick={() => handleRouting("/experience")}>체험하기</MobileMenu>
                            {(loggedInStateInfo === false || loggedInStateInfo == null) &&
                                <>
                                    <MobileMenu onClick={() => handleRouting("/signup")}>회원가입</MobileMenu>
                                    <MobileMenu onClick={() => handleRouting("/login")}>로그인</MobileMenu>
                                </>}
                            {(loggedInStateInfo === true) &&
                                <>
                                    <MobileMenu onClick={() => handleRouting("/mypage")}>마이페이지</MobileMenu>
                                    <MobileMenu onClick={() => logout()}>로그아웃</MobileMenu>
                                </>}
                        </MobileMenuList>
                    </MobileMenuContainer>
                </>
            }
        </NavigationWrapper>
    );
}

export default Navigation;