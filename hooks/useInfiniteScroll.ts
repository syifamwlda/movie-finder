import { useEffect, useRef, useCallback, useState } from 'react';

export function useInfiniteScroll(
  callback: () => void,
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            callback();
          }
        },
        {
          threshold: options.threshold ?? 0.1,
          rootMargin: options.rootMargin ?? '200px',
        }
      );
      observerRef.current.observe(node);
    },
    [callback, hasMore, isLoading, options.threshold, options.rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { sentinelRef, isLoading, setIsLoading, hasMore, setHasMore };
}
