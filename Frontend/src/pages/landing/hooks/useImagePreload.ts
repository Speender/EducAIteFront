import { useEffect, useMemo, useState } from 'react';

interface UseImagePreloadResult {
  isLoading: boolean;
  hasError: boolean;
}

export function useImagePreload(urls: string[]) : UseImagePreloadResult {
  const urlSignature = urls.join('|');
  const normalizedUrls = useMemo(
    () => urls.filter((url, index) => Boolean(url) && urls.indexOf(url) === index),
    [urlSignature],
  );
  const [state, setState] = useState<UseImagePreloadResult>({
    isLoading: normalizedUrls.length > 0,
    hasError: false,
  });

  useEffect(() => {
    if (normalizedUrls.length === 0) {
      setState({ isLoading: false, hasError: false });
      return;
    }

    let active = true;
    let remaining = normalizedUrls.length;
    let hasError = false;

    setState({ isLoading: true, hasError: false });

    const markDone = () => {
      remaining -= 1;
      if (active && remaining <= 0) {
        setState({ isLoading: false, hasError });
      }
    };

    const disposers = normalizedUrls.map((url) => {
      const image = new Image();
      image.onload = markDone;
      image.onerror = () => {
        hasError = true;
        markDone();
      };
      image.src = url;

      return () => {
        image.onload = null;
        image.onerror = null;
      };
    });

    return () => {
      active = false;
      disposers.forEach((dispose) => dispose());
    };
  }, [urlSignature, normalizedUrls]);

  return state;
}
