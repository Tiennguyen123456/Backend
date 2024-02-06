import { GridRowSelectionModel, GridSortModel } from "@mui/x-data-grid";

export interface IDataTable<T> {
  search: string;
  list: T[];
  totalItems: number;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  pageSizeOptions: number[];
  sortModel: GridSortModel;
  rowSelectionModel: GridRowSelectionModel;
}

export interface IListRes<T> {
  count: number;
  collection: T[];
  pagination: {
    meta: {
      current_page: number;
      from: number;
      to: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}
