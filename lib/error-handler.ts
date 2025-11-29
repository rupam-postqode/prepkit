/**
 * Enterprise Error Handling System for PrepKit
 * Provides structured error logging, classification, and monitoring
 */

export enum ErrorCode {
  // Authentication & Authorization (AUTH_xxx)
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',
  INVALID_CREDENTIALS = 'AUTH_004',
  SESSION_EXPIRED = 'AUTH_005',

  // Validation Errors (VAL_xxx)
  VALIDATION_ERROR = 'VAL_001',
  MISSING_REQUIRED_FIELD = 'VAL_002',
  INVALID_FORMAT = 'VAL_003',
  INVALID_EMAIL = 'VAL_004',
  PASSWORD_TOO_WEAK = 'VAL_005',

  // Business Logic Errors (BIZ_xxx)
  LESSON_NOT_FOUND = 'BIZ_001',
  SUBSCRIPTION_REQUIRED = 'BIZ_002',
  CONTENT_ENCRYPTION_FAILED = 'BIZ_003',
  MODULE_NOT_FOUND = 'BIZ_004',
  CHAPTER_NOT_FOUND = 'BIZ_005',
  PAYMENT_FAILED = 'BIZ_006',
  VIDEO_UPLOAD_FAILED = 'BIZ_007',

  // System Errors (SYS_xxx)
  INTERNAL_ERROR = 'SYS_001',
  DATABASE_ERROR = 'SYS_002',
  EXTERNAL_SERVICE_ERROR = 'SYS_003',
  NETWORK_ERROR = 'SYS_004',
  TIMEOUT_ERROR = 'SYS_005',
  CONFIGURATION_ERROR = 'SYS_006',

  // Content Protection (SEC_xxx)
  CONTENT_DECRYPTION_FAILED = 'SEC_001',
  ACCESS_DENIED = 'SEC_002',
  LICENSE_EXPIRED = 'SEC_003',
  INTEGRITY_CHECK_FAILED = 'SEC_004',

  // Rate Limiting (RATE_xxx)
  RATE_LIMIT_EXCEEDED = 'RATE_001',
  TOO_MANY_REQUESTS = 'RATE_002',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  url?: string;
  method?: string;
  timestamp: string;
  environment: string;
  version?: string;
}

export interface PrepKitError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  details?: unknown;
  stack?: string;
  cause?: Error;
  userMessage?: string;
  suggestedAction?: string;
}

/**
 * Error Logger Service
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private logQueue: PrepKitError[] = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error with full context
   */
  async logError(
    code: ErrorCode,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Partial<ErrorContext> = {},
    details?: unknown,
    originalError?: Error
  ): Promise<void> {
    const error: PrepKitError = {
      code,
      message,
      severity,
      context: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        ...context
      },
      details,
      stack: originalError?.stack,
      cause: originalError
    };

    // Add to processing queue
    this.logQueue.push(error);

    // Process queue asynchronously
    this.processQueue();

    // For critical errors, also log immediately to console
    if (severity === ErrorSeverity.CRITICAL) {
      console.error('CRITICAL ERROR:', {
        code: error.code,
        message: error.message,
        context: error.context,
        stack: error.stack
      });
    }
  }

  /**
   * Process the error logging queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.logQueue.length > 0) {
        const error = this.logQueue.shift();
        if (error) {
          await this.persistError(error);
        }
      }
    } catch (processingError) {
      console.error('Error processing log queue:', processingError);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Persist error to logging system
   */
  private async persistError(error: PrepKitError): Promise<void> {
    try {
      // In development, log to console with structured format
      if (process.env.NODE_ENV === 'development') {
        console.error('ERROR LOG:', {
          code: error.code,
          severity: error.severity,
          message: error.message,
          context: error.context,
          details: error.details,
          stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines only
        });
      }

      // TODO: In production, send to external logging service (Sentry, DataDog, etc.)
      // await this.sendToExternalService(error);

      // TODO: Store in database for audit trails
      // await this.storeInDatabase(error);

    } catch (persistError) {
      console.error('Failed to persist error:', persistError);
    }
  }

  /**
   * Create user-friendly error response
   */
  static createErrorResponse(
    code: ErrorCode,
    userMessage?: string,
    suggestedAction?: string,
    details?: unknown
  ): { success: false; error: unknown } {
    const errorDefinition = ErrorDefinitions[code];

    return {
      success: false,
      error: {
        code,
        message: userMessage || errorDefinition?.userMessage || 'An error occurred',
        suggestedAction: suggestedAction || errorDefinition?.suggestedAction,
        details: process.env.NODE_ENV === 'development' ? details : undefined,
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId()
      }
    };
  }

  /**
   * Generate unique request ID for error tracking
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Error Definitions with user-friendly messages
 */
export const ErrorDefinitions: Record<ErrorCode, {
  severity: ErrorSeverity;
  userMessage: string;
  suggestedAction: string;
  httpStatus: number;
}> = {
  // Authentication
  [ErrorCode.UNAUTHORIZED]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Please sign in to continue',
    suggestedAction: 'Sign in to your account',
    httpStatus: 401
  },
  [ErrorCode.FORBIDDEN]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'You don\'t have permission to access this content',
    suggestedAction: 'Contact support if you believe this is an error',
    httpStatus: 403
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Your session has expired',
    suggestedAction: 'Please sign in again',
    httpStatus: 401
  },

  // Validation
  [ErrorCode.VALIDATION_ERROR]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Please check your input and try again',
    suggestedAction: 'Review the form fields and correct any errors',
    httpStatus: 400
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Required information is missing',
    suggestedAction: 'Please fill in all required fields',
    httpStatus: 400
  },

  // Business Logic
  [ErrorCode.LESSON_NOT_FOUND]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Lesson not found',
    suggestedAction: 'Check the lesson URL or browse available lessons',
    httpStatus: 404
  },
  [ErrorCode.SUBSCRIPTION_REQUIRED]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Premium subscription required',
    suggestedAction: 'Upgrade to access premium content',
    httpStatus: 403
  },
  [ErrorCode.CONTENT_ENCRYPTION_FAILED]: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Content security error',
    suggestedAction: 'Please try again or contact support',
    httpStatus: 500
  },

  // System Errors
  [ErrorCode.INTERNAL_ERROR]: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Something went wrong on our end',
    suggestedAction: 'Please try again in a few moments',
    httpStatus: 500
  },
  [ErrorCode.DATABASE_ERROR]: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Database temporarily unavailable',
    suggestedAction: 'Please try again in a few moments',
    httpStatus: 503
  },
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'External service temporarily unavailable',
    suggestedAction: 'Please try again in a few moments',
    httpStatus: 503
  },

  // Security
  [ErrorCode.CONTENT_DECRYPTION_FAILED]: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Content access error',
    suggestedAction: 'Please try refreshing the page',
    httpStatus: 500
  },
  [ErrorCode.ACCESS_DENIED]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Access to this content is restricted',
    suggestedAction: 'Check your subscription status',
    httpStatus: 403
  },

  // Rate Limiting
  [ErrorCode.RATE_LIMIT_EXCEEDED]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Too many requests',
    suggestedAction: 'Please wait a moment before trying again',
    httpStatus: 429
  },

  // Default fallbacks
  [ErrorCode.INVALID_CREDENTIALS]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid email or password',
    suggestedAction: 'Check your credentials and try again',
    httpStatus: 401
  },
  [ErrorCode.SESSION_EXPIRED]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Your session has expired',
    suggestedAction: 'Please sign in again',
    httpStatus: 401
  },
  [ErrorCode.INVALID_FORMAT]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid data format',
    suggestedAction: 'Please check your input format',
    httpStatus: 400
  },
  [ErrorCode.INVALID_EMAIL]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid email address',
    suggestedAction: 'Please enter a valid email address',
    httpStatus: 400
  },
  [ErrorCode.PASSWORD_TOO_WEAK]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Password is too weak',
    suggestedAction: 'Please choose a stronger password',
    httpStatus: 400
  },
  [ErrorCode.MODULE_NOT_FOUND]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Module not found',
    suggestedAction: 'Check the module URL or browse available modules',
    httpStatus: 404
  },
  [ErrorCode.CHAPTER_NOT_FOUND]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Chapter not found',
    suggestedAction: 'Check the chapter URL or browse available chapters',
    httpStatus: 404
  },
  [ErrorCode.PAYMENT_FAILED]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Payment processing failed',
    suggestedAction: 'Check your payment details and try again',
    httpStatus: 402
  },
  [ErrorCode.VIDEO_UPLOAD_FAILED]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Video upload failed',
    suggestedAction: 'Check your file and try again',
    httpStatus: 500
  },
  [ErrorCode.NETWORK_ERROR]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Network connection error',
    suggestedAction: 'Check your internet connection and try again',
    httpStatus: 503
  },
  [ErrorCode.TIMEOUT_ERROR]: {
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Request timed out',
    suggestedAction: 'Please try again',
    httpStatus: 504
  },
  [ErrorCode.CONFIGURATION_ERROR]: {
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'System configuration error',
    suggestedAction: 'Please contact support',
    httpStatus: 500
  },
  [ErrorCode.LICENSE_EXPIRED]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Content license expired',
    suggestedAction: 'Please refresh or contact support',
    httpStatus: 403
  },
  [ErrorCode.INTEGRITY_CHECK_FAILED]: {
    severity: ErrorSeverity.HIGH,
    userMessage: 'Content integrity check failed',
    suggestedAction: 'Please contact support',
    httpStatus: 500
  },
  [ErrorCode.TOO_MANY_REQUESTS]: {
    severity: ErrorSeverity.LOW,
    userMessage: 'Too many requests',
    suggestedAction: 'Please wait before making more requests',
    httpStatus: 429
  }
};

/**
 * Helper function to create and log errors
 */
export function createAndLogError(
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  details?: unknown,
  originalError?: Error
): PrepKitError {
  const errorDefinition = ErrorDefinitions[code];
  const severity = errorDefinition?.severity || ErrorSeverity.MEDIUM;

  // Log the error
  ErrorLogger.getInstance().logError(
    code,
    message,
    severity,
    context,
    details,
    originalError
  );

  // Return structured error
  return {
    code,
    message,
    severity,
    context: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...context
    },
    details,
    stack: originalError?.stack,
    cause: originalError,
    userMessage: errorDefinition?.userMessage,
    suggestedAction: errorDefinition?.suggestedAction
  };
}

/**
 * Helper function to handle API errors
 */
export function handleApiError(
  error: unknown,
  context: Partial<ErrorContext> = {}
): { success: false; error: unknown } {
  let errorCode = ErrorCode.INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  let details = error;
  let originalError: Error | undefined;

  // Type guard for error object
  const isErrorLike = (err: unknown): err is { code?: string; name?: string; message?: string } => {
    return typeof err === 'object' && err !== null;
  };

  // Classify the error
  if (isErrorLike(error)) {
    if (error.code) {
      // Prisma errors
      if (error.code === 'P1001') errorCode = ErrorCode.DATABASE_ERROR;
      else if (error.code === 'P2002') errorCode = ErrorCode.VALIDATION_ERROR;
      else if (error.code.startsWith('P')) errorCode = ErrorCode.DATABASE_ERROR;
    } else if (error.name === 'ValidationError') {
      errorCode = ErrorCode.VALIDATION_ERROR;
    } else if (error.name === 'UnauthorizedError') {
      errorCode = ErrorCode.UNAUTHORIZED;
    } else if (error.message?.includes('timeout')) {
      errorCode = ErrorCode.TIMEOUT_ERROR;
    } else if (error.message?.includes('network')) {
      errorCode = ErrorCode.NETWORK_ERROR;
    }

    // If it's an Error instance, use it for stack trace
    if (error instanceof Error) {
      originalError = error;
    }
  }

  // Log the error
  const loggedError = createAndLogError(
    errorCode,
    message,
    context,
    details,
    originalError
  );

  // Return user-friendly response
  return ErrorLogger.createErrorResponse(
    errorCode,
    loggedError.userMessage,
    loggedError.suggestedAction,
    process.env.NODE_ENV === 'development' ? details : undefined
  );
}
