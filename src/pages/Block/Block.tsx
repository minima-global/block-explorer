import { useState, ChangeEvent } from 'react';
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridCallbackDetails,
    GridOverlay,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import { Box, LinearProgress } from '@mui/material';
import { MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { SearchOutlined, Clear } from '@mui/icons-material';
import useRecentBlocks from './../../minima/useRecentBlocks';
import * as React from 'react';
import BlockPagination from './BlockPagination';

const printDate = (myDate: Date) => {
    const dateParts = myDate.toDateString().split(' ');
    const timeParts = myDate.toTimeString().split(' ');
    const month = dateParts[1];
    const day = dateParts[2];
    const time = timeParts[0];

    return `${time}, ${month} ${day}`;
};

const recentBlockColumns: GridColDef[] = [
    { field: 'block', headerName: 'Block', sortable: false, flex: 100 },
    { field: 'hash', headerName: 'Hash', sortable: false, flex: 100 },
    { field: 'transactions', headerName: 'TKNS', sortable: false, flex: 100, align: 'center', headerAlign: 'center' },
    {
        field: 'relayed',
        headerName: 'Relayed',
        sortable: false,
        flex: 100,
        renderCell: (params: GridRenderCellParams<Date>) => <>{printDate(params.value)}</>,
    },
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

    const onSearchClicked = (event: any) => {
        event.preventDefault();
        setSearchString(searchText);
    };

    const onClearSearchClicked = () => {
        setSearchText(''); // local input field
        setSearchString(''); // sent to minima
    };

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                    <LinearProgress />
                </div>
            </GridOverlay>
        );
    }

    const CustomPagination = () => (
        <BlockPagination rowsState={rowsState} pageSize={pageSize} setRowsState={setRowsState} />
    );

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 1,
                    borderRadius: 1.5,
                    p: 2,
                    mt: 4,
                    minWidth: 300,
                    fontSize: 14,
                }}
            >
                <Typography variant="h4">Discover the heaviest leaf in the chain and traverse through.</Typography>
                <form onSubmit={onSearchClicked} id="search-form">
                    <TextField
                        value={searchText}
                        onChange={onSearchFieldChange}
                        sx={{ mt: 4 }}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <IconButton onClick={onSearchClicked} type="submit">
                                    <SearchOutlined />
                                </IconButton>
                            ),
                            endAdornment: (
                                <IconButton onClick={onClearSearchClicked}>
                                    <Clear />
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
                    borderRadius: 1.5,
                    mt: 2,
                    mb: 2,
                    height: 600,
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <DataGrid
                    columns={recentBlockColumns}
                    getRowId={(row) => row.txpowid}
                    onRowClick={onGridRowClicked}
                    {...rowsState}
                    paginationMode="server"
                    density="compact"
                    disableColumnMenu
                    components={{
                        Pagination: CustomPagination,
                        LoadingOverlay: CustomLoadingOverlay,
                    }}
                />
            </Box>
        </>
    );
};

export default Block;
