export const ROUTES = {
  AUTH: {
    PREFIX: 'auth',
    REGISTER: 'register',
    LOGIN: 'login',
    VERIFY: 'verify',
    RESEND_VERIFICATION: 'resend-verification',
    REFRESH: 'refresh',
  },
  URL: {
    PREFIX: 'url',
    SHORTEN: 'shorten',
    MY_URLS: 'my-urls',
    DELETE: 'delete/:id',
  },
  REDIRECT: {
    PREFIX: '',
    CODE: ':code',
  },
};
