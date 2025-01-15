declare module './loggerService' {
  export function logInfo(message: string): void;
  export function logError(message: string): void;
  export const requestLogger: any;
  export const devLogger: any;
}
