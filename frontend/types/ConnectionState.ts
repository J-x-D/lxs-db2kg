export interface ConnectionState {
  connectionTested: boolean;
  connectionIsLoading: boolean;
  isConnectionPossible: boolean;
  errorMessage?: string;
}
