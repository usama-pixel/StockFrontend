'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { BatchDataType } from '@/utils/types';
import axios from '@/utils/axiosConfig'
import { status } from '@/utils/enums';
import Modal from '@/app/common/Modal';


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const handleClick = () => {
    const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modalElement !== null) {
      modalElement.showModal();
    }
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Batch
      </Button>
    </GridToolbarContainer>
  );
}

type PropType = {
  items: BatchDataType[],
  setItems: any,
  pageNumber: number,
  setPageNumber: any,
  pageLimit: number,
  setPageLimit: any,
  pageSizeOptions: number[],
  totalRows: number,
  setTotalRows: any
}

export default function MyDataGrid({
  items,
  setItems,
  pageNumber,
  setPageNumber,
  pageLimit,
  setPageLimit,
  pageSizeOptions,
  totalRows,
  setTotalRows
}: any) {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  
  const handleSaveClick = (id: GridRowId) => (params: React.SyntheticEvent) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const [batch_id, setBatch_id] = React.useState('')
  const handleSend = (id: GridRowId) => () => {
    setBatch_id(id as string)
    const modalElement = document.getElementById('send_modal') as HTMLDialogElement;
    if (modalElement !== null) {
      modalElement.showModal();
    }
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    axios.delete(`/batch/${id}`)
    .then(res => console.log({deleteRes: res.data}))
    .catch(err => console.log(err))
    setItems(items.filter((row: any) => {
      return row.id !== id
    }));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = items.find((row: any) => row.id === id);
    if (editedRow!.isNew) {
      setItems(items.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    axios.put('/batch', {
      ...newRow
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err))
    const updatedRow = { ...newRow, isNew: false };
    setItems(items.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, editable: false },
    { field: 'product_name', headerName: 'Product Name', type: 'string', width: 120, align: 'left', headerAlign: 'left', editable: true, },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 80, headerAlign: 'left', align: 'left', editable: true, },
    { field: 'status', headerName: 'Status', width: 80, editable: true, type: 'singleSelect', headerAlign: 'left', align: 'left', valueOptions: ['Recieved', 'Returned'], },
    { field: 'rate', headerName: 'Rate', width: 80, editable: true, type: 'number', headerAlign: 'left', align: 'left', },
    { field: 'tax', headerName: 'Tax', width: 80, editable: true, type: 'number', headerAlign: 'left', align: 'left', },
    { field: 'discount', headerName: 'Discount', width: 80, editable: true, type: 'number', headerAlign: 'left', align: 'left', },
    { field: 'expiry_date', headerName: 'Expiry', width: 100, editable: true, type: 'date',
      valueGetter: ({row: {expiry_date}}) => {
        if(expiry_date) return new Date(expiry_date)
        return null;
      }
    },
    { field: 'packing', headerName: 'Packing', width: 100, editable: true, type: 'string', headerAlign: 'left', align: 'left', },
    {field: 'actions',type: 'actions',headerName: 'Actions',width: 100,cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<SendIcon />}
            label='Send'
            className='textPrimary'
            onClick={handleSend(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const [openModal, setOpenModal] = React.useState(false)
  // const handlePageChange = (newPage: number) => {
  //   console.log({newPage})
  //   axios.get(`/batch?page=${newPage}&limit=${pageLimit}`)
  //   .then((res): void => {
  //       console.log({resBro: res})
  //       setItems(res.data?.rows?.map((d: any) => {
  //           const revised_data = {
  //               id: d.id,
  //               batch_no: d.batch_no,
  //               status: d.Status.name,
  //               product_name: d.product_name,
  //               quantity: d.quantity,
  //               rate: d.rate,
  //               tax: d.tax,
  //               discount: d.discount,
  //               expiry_date: d.expiry_date,
  //               packing: d.packing,
  //           }
  //           return revised_data;
  //       }))
  //       setTotalRows(res?.data?.totalRows||0)
  //   })
  //   .catch(err => console.log(err))
  //   // setPage(newPage);
  //   // // Fetch new data from the backend based on the new page
  //   // fetchDataFromBackend(newPage).then(newRows => {
  //   //   setRows(newRows);
  //   // });
  // };
  // no issues here
  // const [count, setCount] = React.useState<number>(0); // Initialize with 1 page
  // React.useEffect(() => {
  //   // Fetch total count of rows from your API
  //   axios.get('/batch/count')
  //     .then(res => {
  //       // console.log({cont: res.data})
  //       const totalCount = res.data;
  //       setCount(totalCount)
  //     })
  //     .catch(err => console.error(err));
  // }, [items]);
  const [to, setTo] = React.useState('')
  const [sendDisable, setSendDisable] = React.useState(false)
  const handleSend2 = () => {
    // const rev = items.filter(itm => itm.id !== batch_id)
    // console.log({rev})
    // setItems(itm => itm.id !== batch_id)
    setSendDisable(true)
    axios.post('/send-batch', {
      to,
      batch_id
    })
    .then(res => {
      if(res.status === 200) {
        setItems((prev: any) => {
          const rev = items.filter((itm: any) => itm.id !== batch_id)
          return rev
        })
        const modalElement = document.getElementById('send_modal') as HTMLDialogElement;
        if (modalElement !== null) {
          setTimeout(() => {
            modalElement.close();
            setTo('');
            setSendDisable(false)
          }, 3000)
        }
      }
    })
    .catch(err => console.log(err))
  }
  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      {/* {openModal && <Modal Body={ModalBody} />} */}
      
      <dialog id="send_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className='flex flex-col justify-center items-center gap-2'>
            <h3 className="font-bold text-lg">Who to send the batch to?</h3>
            <input placeholder='Name' value={to} onChange={e => setTo(e.target.value)} />
            <button className='btn btn-primary' disabled={sendDisable} onClick={handleSend2}>Send</button>
          </div>
        </div>
      </dialog>
      <DataGrid
        rows={items?.map((row: any) => {
          console.log({rarrr: row})
          // console.log({a: row?.Status?.name?.toString().toLowerCase(), b: status.recieved.toString().toLowerCase()})
          return ({
            ...row,
            status: row?.status?.toString().toLowerCase() === status.recieved.toString().toLowerCase()
            ? status.recieved
            : status.returned
          })}
        )}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageLimit,
            },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        rowCount={totalRows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        // onPaginationModelChange={(model) => handlePageChange(model.page)}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows: setItems, setRowModesModel },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}