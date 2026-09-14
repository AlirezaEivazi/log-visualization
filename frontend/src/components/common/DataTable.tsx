'use client';

import { DataGrid, type DataGridProps, type GridValidRowModel } from '@mui/x-data-grid';

type DataTableProps<T extends GridValidRowModel> = DataGridProps<T>;

/**
 * Thin wrapper around MUI X DataGrid with the defaults every log/results
 * table in this app should share (compact density, disabled cell
 * selection, sane page sizes). Pass any DataGrid prop through as usual.
 */
export default function DataTable<T extends GridValidRowModel>(props: DataTableProps<T>) {
  const { initialState, sx, ...rest } = props;

  return (
    <DataGrid
      density="compact"
      disableRowSelectionOnClick
      disableColumnMenu
      pageSizeOptions={[10, 25, 50]}
      {...rest}
      initialState={{
        pagination: { paginationModel: { pageSize: 25, page: 0 } },
        ...initialState,
      }}
      sx={{
        border: 'none',
        fontSize: '0.8125rem',
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        ...sx,
      }}
    />
  );
}
