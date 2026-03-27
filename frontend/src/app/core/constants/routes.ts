export const APP_ROUTES = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    VERIFY: 'auth/verify',
  },
  DASHBOARD: 'dashboard',
  MY_URLS: 'my-urls',
  ERROR: {
    NOT_FOUND: '404',
    SERVER_ERROR: '500',
  }
};

export const API_ROUTES = {
  AUTH: {
    PREFIX: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
    VERIFY: 'verify',
    RESEND_VERIFICATION: 'resend-verification',
    REFRESH: 'refresh',
  },
  URL: {
    PREFIX: 'url',
    SHORTEN: 'shorten',
    MY_URLS: 'my-urls',
    DELETE: (id: string) => `delete/${id}`,
  },
  MONITORING: {
    PREFIX: 'monitoring',
    PING: 'ping',
    REGISTER: 'register',
  }
};
