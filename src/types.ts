// Type definitions for the math parser

export interface ValidationResult {
  valid: boolean;
  cleanedInput: string;
  message: string;
  invalidContent: string[];
}

export interface Token {
  type: string | undefined;
  value: string;
  text: string;
}

export interface Parser {
  feed(input: string): void;
  results: any[];
}

export interface Grammar {
  // Nearley grammar interface
}

export interface AppState {
  input: string;
  result: string;
  isValid: boolean | null;
  invalidContent: string[];
}
