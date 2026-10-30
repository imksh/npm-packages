export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  nextCursor?: string;
  unreadCount?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
  status?: number;
  token?: string;
}
