import { ref } from 'vue';

interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

interface HttpResponse<T> {
  data: T | null;
  status: number | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

export function useHttp<T>() {
  const data = ref<T | null>(null);
  const status = ref<number | null>(null);
  const isLoading = ref(false);
  const isSuccess = ref(false);
  const isError = ref(false);
  const error = ref<string | null>(null);

  const execute = async (options: HttpRequestOptions): Promise<void> => {
    data.value = null;
    status.value = null;
    isLoading.value = true;
    isSuccess.value = false;
    isError.value = false;
    error.value = null;

    try {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body ? JSON.stringify(options.body) : null,
      });

      status.value = response.status;
      if (response.ok) {
        data.value = await response.json();
        isSuccess.value = true;
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      isError.value = true;
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    status,
    isLoading,
    isSuccess,
    isError,
    error,
    execute,
  };
}