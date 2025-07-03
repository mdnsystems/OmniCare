import { useLoading } from "@/contexts/loading-context";

export function useLoadingState() {
  const { isLoading, showLoading, hideLoading } = useLoading();

  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    try {
      showLoading();
      const result = await promise;
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
  };
} 