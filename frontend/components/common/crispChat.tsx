'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';
import { usePathname } from 'next/navigation';
import { env } from '@/lib/config';

const CrispChat = () => {
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if the current URL contains 'start'
    const shouldHideCrisp = pathname.includes('start');
    
    if (shouldHideCrisp) {
      // Don't initialize Crisp or hide it if already initialized
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide']);
      }
      return;
    }

    if (!env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
      return;
    }
    
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || '');
    window.$crisp.push(['do', 'chat:show']);

    return () => {
    };
  }, [pathname]);

  return null;
};

export default CrispChat;