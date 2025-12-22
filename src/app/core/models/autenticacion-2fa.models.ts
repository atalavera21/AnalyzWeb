export interface TwoFactorSetupResponse {
  qrCodeImage: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface TwoFactorStatusResponse {
  isEnabled: boolean;
  enabledAt?: string;
  backupCodesRemaining: number;
}

export interface Validate2FARequest {
  tempToken: string;
  code: string;
  useBackupCode: boolean;
}