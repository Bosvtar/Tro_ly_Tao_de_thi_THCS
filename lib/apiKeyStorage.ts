// Utility để lưu và đọc API key từ localStorage

const STORAGE_KEY = 'gemini_api_key';

export const getApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

export const saveApiKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const hasApiKey = (): boolean => {
  const key = getApiKey();
  return key !== null && key.trim() !== '';
};

