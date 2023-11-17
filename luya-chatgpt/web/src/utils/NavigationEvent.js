"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LoginComponent from '@/component/login/LoginComponent';
import useLoginInfo from './useLoginInfo/useLoginInfo';

function NavigationEvents({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginHook = useLoginInfo();

  useEffect(() => {
    const isAuthenticated = loginHook.fetchLoginInfo();

    setIsAuthenticated(isAuthenticated);
    setIsLoading(false);

    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.push('/login');
    }
  }, [pathname, searchParams]);

  if (isLoading) {
    return null; // 로딩 중인 경우 아무것도 표시하지 않음
  }

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return <LoginComponent />; // 로그인 페이지로 리디렉션
  }

  return children; // 인증된 경우에만 children을 표시
}

const isPublicRoute = (pathname) => {
  // 화이트리스트에 포함되어야 하는 공개 페이지 경로를 여기에 정의합니다.
  const publicRoutes = JSON.parse(process.env.NEXT_PUBLIC_WHITELIST_URL);
  return publicRoutes.includes(pathname);
};

export default NavigationEvents;
