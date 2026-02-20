import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function useDeviceOS() {
  const theme = useTheme();
  
  // Optional: you can also combine with screen size heuristics
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const os = useMemo(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(ua) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }

    // Android detection
    if (/android/i.test(ua)) {
      return 'android';
    }

    return 'other'; // desktop, windows phone (rare now), etc.
  }, []);

  return os;
}

