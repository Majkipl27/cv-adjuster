const PARSE_MODEL_STORAGE_KEY = 'cv-adjuster:parse-model';
const ADJUST_MODEL_STORAGE_KEY = 'cv-adjuster:adjust-model';

export const DEFAULT_PARSE_MODEL = 'minimax/minimax-m2.7';
export const DEFAULT_ADJUST_MODEL = 'anthropic/claude-haiku-4.5';

export function hasGatewayKey(): boolean {
  return __HAS_GATEWAY_KEY__;
}

export function getParseModel(): string {
  if (typeof window === 'undefined') return DEFAULT_PARSE_MODEL;
  return window.localStorage.getItem(PARSE_MODEL_STORAGE_KEY) ?? DEFAULT_PARSE_MODEL;
}

export function getAdjustModel(): string {
  if (typeof window === 'undefined') return DEFAULT_ADJUST_MODEL;
  return window.localStorage.getItem(ADJUST_MODEL_STORAGE_KEY) ?? DEFAULT_ADJUST_MODEL;
}

export function setParseModel(model: string): void {
  window.localStorage.setItem(PARSE_MODEL_STORAGE_KEY, model);
}

export function setAdjustModel(model: string): void {
  window.localStorage.setItem(ADJUST_MODEL_STORAGE_KEY, model);
}
