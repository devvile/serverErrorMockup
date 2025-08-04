// Import or define your Token type
export type Token = {
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  idToken: string;
  expiryDate: Date;
};

// Mock refreshAccessToken with correct return type
export const refreshAccessToken = async (): Promise<Token> => {
  console.log('🔥 Mock: Refreshing access token...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate different scenarios
  const shouldSucceed = Math.random() > 0.1; // 90% success rate
  
  if (shouldSucceed) {
    const tokens: Token = {
      accessToken: 'new-mock-access-token-' + Date.now(),
      refreshToken: 'new-mock-refresh-token-' + Date.now(),
      scope: 'read write',
      tokenType: 'Bearer',
      idToken: 'mock-id-token-' + Date.now(),
      expiryDate: new Date(Date.now() + 3600000) // 1 hour from now
    };
    console.log('🔥 Mock: Token refresh successful:', tokens);
    return tokens;
  } else {
    console.log('🔥 Mock: Token refresh failed');
    throw new Error('Mock: Refresh token expired');
  }
};

// Alternative: If you want to simulate failure scenarios
export const refreshAccessTokenWithScenarios = async (scenario: 'success' | 'failure' = 'success'): Promise<Token> => {
  console.log('🔥 Mock: Refreshing access token with scenario:', scenario);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (scenario === 'failure') {
    throw new Error('Mock: Refresh token expired or invalid');
  }
  
  return {
    accessToken: 'new-mock-access-token-' + Date.now(),
    refreshToken: 'new-mock-refresh-token-' + Date.now(),
    scope: 'read write admin',
    tokenType: 'Bearer',
    idToken: 'mock-id-token-' + Date.now(),
    expiryDate: new Date(Date.now() + 7200000) // 2 hours from now
  };
};

// Mock the other token functions
export const getAccessToken = (): string => {
  const token = 'mock-access-token-12345';
  console.log('🔥 Mock: Getting access token:', token);
  return token;
};

export const getRefreshToken = (): string => {
  const token = 'mock-refresh-token-67890';
  console.log('🔥 Mock: Getting refresh token:', token);
  return token;
};

export const setAccessToken = (token: string): void => {
  console.log('🔥 Mock: Setting access token:', token);
  // In a real mock, you might store this in a variable or localStorage
};

export const setRefreshToken = (token: string): void => {
  console.log('🔥 Mock: Setting refresh token:', token);
  // In a real mock, you might store this in a variable or localStorage
};

// Complete mock handleErrorCase function
export const mockHandleErrorCase = async (error: any) => {
  console.log('🔥 Mock: Handling error:', error);
  
  const originalRequest = error.config;
  
  if (
    error.response?.status === 401 &&
    getRefreshToken() &&
    originalRequest._retry !== true
  ) {
    console.log('🔥 Mock: 401 detected, attempting token refresh...');
    
    originalRequest._retry = true;
    
    try {
      // This now returns the complete Token type
      const tokenResponse = await refreshAccessToken();
      
      // Extract just the tokens you need
      tokenResponse.refreshToken && setRefreshToken(tokenResponse.refreshToken);
      setAccessToken(tokenResponse.accessToken);
      
      console.log('🔥 Mock: Retrying request with new token');
      console.log('🔥 Mock: Token expires at:', tokenResponse.expiryDate);
      
      // Return mock successful response
      return {
        data: { message: 'Mock: Request succeeded after token refresh' },
        status: 200,
        config: originalRequest
      };
      
    } catch (refreshError) {
      console.log('🔥 Mock: Token refresh failed');
      return Promise.reject(refreshError);
    }
  }
  
  // Handle other error types
  const parsedError = {
    message: error.response?.data?.message || error.response?.data || error.message,
    status: error.response?.status || 500
  };
  
  console.log('🔥 Mock: Parsed error:', parsedError);
  return Promise.reject(error);
};

export const shouldRefreshToken = (error: any): boolean => {
  return (    error.response?.status === 401 &&    !!getRefreshToken() &&    error.config?._retry !== true
  );
};

export const handle401WithTokenRefresh = async (error: any) => {
  console.log('🔥 Mock: 401 detected, attempting token refresh...');
  
  const originalRequest = error.config;
  originalRequest._retry = true;
  
  try {
    const tokenResponse = await refreshAccessToken();
    
    tokenResponse.refreshToken && setRefreshToken(tokenResponse.refreshToken);
    setAccessToken(tokenResponse.accessToken);
    
    console.log('🔥 Mock: Retrying request with new token');
    console.log('🔥 Mock: Token expires at:', tokenResponse.expiryDate);
    
    return {
      data: { message: 'Mock: Request succeeded after token refresh' },
      status: 200,
      config: originalRequest
    };
    
  } catch (refreshError) {
    console.log('🔥 Mock: Token refresh failed');
    throw refreshError; // Re-throw to be handled by caller
  }
};

export const parseError = (response: any) => {
  if (response.response.status >= 500) {
    return { message: response.response.data, status: response.response.status };
  }
  else {
    let errorMessage = response.response.data.message;
    if (!errorMessage) {
      errorMessage = response.response.data;
    }
    if (!errorMessage || typeof errorMessage !== 'string') {
      errorMessage = response.message;
    }

    return { message: errorMessage, status: response.response.status };
  }
};