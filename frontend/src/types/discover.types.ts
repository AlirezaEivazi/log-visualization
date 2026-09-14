export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string; // ISO string
  level: LogLevel;
  service: string;
  message: string;
  host: string;
}
