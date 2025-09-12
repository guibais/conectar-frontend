import type { TFunction } from 'i18next';

export type StandardizedError = {
  error: string;
  message: string;
  details?: any;
};

export type ErrorResponse = {
  response?: {
    data?: StandardizedError | { message?: string };
    status?: number;
  };
  message?: string;
};

const ERROR_TRANSLATIONS: Record<string, string> = {
  // Auth errors
  AUTH_EMAIL_ALREADY_EXISTS: 'auth.errors.emailAlreadyExists',
  AUTH_INVALID_CREDENTIALS: 'auth.errors.invalidCredentials',
  AUTH_GOOGLE_AUTH_FAILED: 'auth.errors.googleAuthFailed',
  AUTH_MISSING_GOOGLE_DATA: 'auth.errors.missingGoogleData',
  AUTH_INVALID_GOOGLE_TOKEN: 'auth.errors.invalidGoogleToken',
  AUTH_USER_CREATION_FAILED: 'auth.errors.userCreationFailed',

  // Client errors
  CLIENTS_CLIENT_NOT_FOUND: 'clients.errors.clientNotFound',
  CLIENTS_EMAIL_ALREADY_EXISTS: 'clients.errors.emailAlreadyExists',
  CLIENTS_CNPJ_ALREADY_EXISTS: 'clients.errors.cnpjAlreadyExists',
  CLIENTS_INVALID_CLIENT_DATA: 'clients.errors.invalidClientData',
  CLIENTS_CLIENT_CREATION_FAILED: 'clients.errors.clientCreationFailed',
  CLIENTS_CLIENT_UPDATE_FAILED: 'clients.errors.clientUpdateFailed',
  CLIENTS_CLIENT_DELETE_FAILED: 'clients.errors.clientDeleteFailed',
  CLIENTS_UNAUTHORIZED_ACCESS: 'clients.errors.unauthorizedAccess',

  // Common errors
  COMMON_INTERNAL_SERVER_ERROR: 'common.errors.internalServerError',
  COMMON_VALIDATION_ERROR: 'common.errors.validationError',
  COMMON_UNAUTHORIZED: 'common.errors.unauthorized',
  COMMON_FORBIDDEN: 'common.errors.forbidden',
  COMMON_NOT_FOUND: 'common.errors.notFound',
};

export const handleStandardizedError = (
  error: ErrorResponse,
  t: TFunction,
  fallbackKey = 'common.errors.generic'
): string => {
  if (!error?.response?.data) {
    return t(fallbackKey);
  }

  const errorData = error.response.data;

  if ('error' in errorData && errorData.error) {
    const translationKey = ERROR_TRANSLATIONS[errorData.error];
    if (translationKey) {
      return t(translationKey);
    }
  }

  if ('message' in errorData && errorData.message) {
    return errorData.message;
  }

  return t(fallbackKey);
};

export const isStandardizedError = (error: ErrorResponse): boolean => {
  return !!(
    error?.response?.data &&
    'error' in error.response.data &&
    error.response.data.error
  );
};
