import { useEffect, useState, ChangeEvent, ChangeEventHandler } from 'react';
import { DataGrid, GridColDef, GridRowParams, GridCallbackDetails, GridRowModel } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';
import { MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import useRecentBlocks from './../../minima/useRecentBlocks';

const recentBlockColumns: GridColDef[] = [
    { field: 'block', headerName: 'Block', flex: 100 },
    { field: 'hash', headerName: 'Hash', flex: 100 },
    { field: 'transactions', headerName: 'TKNS', flex: 100, align: 'center', headerAlign: 'center' },
    { field: 'relayed', headerName: 'Relayed', flex: 100 },
];

const Block = () => {
    const routerNavigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    const recentBlocks = useRecentBlocks();
    const setSearchString = recentBlocks.setSearchString;
    const rowsState = recentBlocks.rowsState;
    const setRowsState = recentBlocks.setRowsState;
    const pageSize = recentBlocks.pageSize;

    const onGridRowClicked = (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent>,
        details: GridCallbackDetails
    ) => {
        const hash = params.row.hash;
        routerNavigate(`/${hash}`);
    };

    const onSearchFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const onSearchClicked = () => {
        setSearchString(searchText);
    };

    function CustomPagination() {
        const pageCount = Math.max(1, Math.ceil(rowsState.rowCount / pageSize));
        return (
            <Pagination
                color="primary"
                count={pageCount}
                page={rowsState.page + 1}
                onChange={(event, value) => {
                    setRowsState((prev: any) => ({ ...prev, page: value - 1 }));
                }}
            />
        );
    }

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    mt: 4,
                    minWidth: 300,
                    fontSize: 14,
                }}
            >
                <Typography variant="h5">Discover the heaviest leaf in the chain and traverse through.</Typography>
                <form onSubmit={onSearchClicked} id="search-form">
                    <TextField
                        value={searchText}
                        onChange={onSearchFieldChange}
                        sx={{ mt: 4 }}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={onSearchClicked}>
                                    <SearchOutlined />
                                </IconButton>
                            ),
                        }}
                    />
                </form>
            </Box>

            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 1,
                    borderRadius: 1,
                    mt: 2,
                    mb: 2,
                    height: 500,
                    width: '100%',
                }}
            >
                <DataGrid
                    columns={recentBlockColumns}
                    getRowId={(row) => row.txpowid}
                    onRowClick={onGridRowClicked}
                    {...rowsState}
                    paginationMode="server"
                    density="compact"
                    components={{
                        Pagination: CustomPagination,
                    }}
                />
            </Box>
        </>
    );
};

export default Block;
