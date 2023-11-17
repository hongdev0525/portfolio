import Router from 'next/router';
import { useEffect } from 'react';

export const useOnLeavePageConfirmation = (unsavedChanges) => {
  useEffect(() => {
    // For reloading.
  
    window.onbeforeunload = () => {
      if (unsavedChanges) {
        return '변경사항이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?';
      }
    };

    // For changing in-app route.
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = confirm('변경사항이 저장되지 않을 수 있습니다. 페이지를 벗어나시겠습니까?');
        if (!ok) {
          Router.events.emit('routeChangeError');
          throw 'Abort route change. Please ignore this error.';
        }
      };

      Router.events.on('routeChangeStart', routeChangeStart);
      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
 
  }, [unsavedChanges]);
};