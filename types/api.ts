// Basic API response types (for auth context)

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>; // For form validation errors
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  status: "success" | "error";
}
