// Consistent API response format
export class ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  cursor?: string;
  hasMore?: boolean;

  constructor(success: boolean, data?: any, error?: string, cursor?: string, hasMore?: boolean) {
    this.success = success;
    this.timestamp = new Date().toISOString();
    
    if (data !== undefined) {
      this.data = data;
    }
    
    if (error) {
      this.error = error;
    }

    if (cursor !== undefined) {
      this.cursor = cursor;
    }

    if (hasMore !== undefined) {
      this.hasMore = hasMore;
    }
  }

  static success(data: any, cursor?: string, hasMore?: boolean) {
    return new ApiResponse(true, data, undefined, cursor, hasMore);
  }

  static error(message: string) {
    return new ApiResponse(false, undefined, message);
  }
}
