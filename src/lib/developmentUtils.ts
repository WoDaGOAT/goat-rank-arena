
import { isDevelopmentEnvironment, shouldSuppressError } from './networkUtils';

/**
 * Enhanced console wrapper for development
 */
class DevelopmentConsole {
  private static instance: DevelopmentConsole;
  private suppressedErrorCount = 0;
  private lastSuppressionReport = Date.now();

  public static getInstance(): DevelopmentConsole {
    if (!DevelopmentConsole.instance) {
      DevelopmentConsole.instance = new DevelopmentConsole();
    }
    return DevelopmentConsole.instance;
  }

  constructor() {
    if (isDevelopmentEnvironment()) {
      this.initializeConsoleOverrides();
    }
  }

  private initializeConsoleOverrides() {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      if (this.shouldSuppressConsoleError(errorMessage)) {
        this.suppressedErrorCount++;
        this.reportSuppressedErrors();
        return;
      }
      
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const warnMessage = args.join(' ');
      
      if (this.shouldSuppressConsoleWarning(warnMessage)) {
        return;
      }
      
      originalWarn.apply(console, args);
    };
  }

  private shouldSuppressConsoleError(message: string): boolean {
    return message.includes('WebSocket connection') ||
           message.includes('ERR_BLOCKED_BY_CLIENT') ||
           message.includes('chrome-extension') ||
           message.includes('Failed to fetch') ||
           message.includes('NetworkError') ||
           message.includes('net::') ||
           message.includes('ws://') ||
           message.includes('wss://');
  }

  private shouldSuppressConsoleWarning(message: string): boolean {
    return message.includes('External resource') ||
           message.includes('likely blocked') ||
           message.includes('HMR') ||
           message.includes('hot reload');
  }

  private reportSuppressedErrors() {
    const now = Date.now();
    // Report every 30 seconds to avoid spam
    if (now - this.lastSuppressionReport > 30000) {
      console.info(`🔇 Suppressed ${this.suppressedErrorCount} external/development errors in the last 30s`);
      this.suppressedErrorCount = 0;
      this.lastSuppressionReport = now;
    }
  }

  public static init() {
    if (isDevelopmentEnvironment()) {
      DevelopmentConsole.getInstance();
      console.info('🛠️ Development console initialized - external errors will be suppressed');
    }
  }
}

export default DevelopmentConsole;
