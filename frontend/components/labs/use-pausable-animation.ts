"use client";

import { useEffect, useRef } from "react";

type PausableAnimationOptions = {
  durationMs: number;
  isPaused: boolean;
  isRunning: boolean;
  onComplete?: () => void;
  onProgress: (progress: number) => void;
  runSignal: number;
};

export function usePausableAnimation({
  durationMs,
  isPaused,
  isRunning,
  onComplete,
  onProgress,
  runSignal,
}: PausableAnimationOptions) {
  const isPausedRef = useRef(isPaused);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  isPausedRef.current = isPaused;
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!isRunning || runSignal === 0) {
      return;
    }

    let animationFrame: number | null = null;
    let startedAt: number | null = null;
    let pauseStartedAt: number | null = null;
    let pausedDuration = 0;

    onProgressRef.current(0);

    function animate(timestamp: number) {
      startedAt ??= timestamp;

      if (isPausedRef.current) {
        pauseStartedAt ??= timestamp;
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      if (pauseStartedAt !== null) {
        pausedDuration += timestamp - pauseStartedAt;
        pauseStartedAt = null;
      }

      const progress = Math.min(
        1,
        (timestamp - startedAt - pausedDuration) / durationMs,
      );
      onProgressRef.current(progress);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        animationFrame = null;
        onCompleteRef.current?.();
      }
    }

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [durationMs, isRunning, runSignal]);
}
