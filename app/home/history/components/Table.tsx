import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    // person: 'Ismael',
    //   amount: '100',
    //   status: status.sent
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'person', headerName: 'Person', width: 130 },
  { field: 'batchId', headerName: 'Batch Id', width: 130 },
  { field: 'amount', headerName: 'Amount', width: 130 },
  { field: 'status', headerName: 'Status', type: 'string', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params: GridValueGetterParams) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
];

export default function Table({data}: {data: any}) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}