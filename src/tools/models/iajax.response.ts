export interface IAjaxResponse<T> {
  success: boolean;
  valid: boolean;
  message: string;
  count: number;
  data: T[];
}
