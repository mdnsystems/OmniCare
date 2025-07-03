"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loading } from "../ui/loading";

export function RouteLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname, location.search]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 flex items-center justify-center">
      <Loading size="lg" />
    </div>
  );
} 