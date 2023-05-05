export interface Result {
  isSuccess: boolean;
  errorMessage: string;
}

export interface ResultWithValue<T> extends Result {
  value: T;
}

export interface ResultWithValueAndPageLink<T> extends Result {
  value: T;
  prevPage: string;
  nextPage: string;
}

export interface ResultWithValueAndPagination<T> extends ResultWithValue<T> {
  currentPage: number;
  totalPages: number;
  totalRows: number;
}
