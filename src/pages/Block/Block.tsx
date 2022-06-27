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
    { field: 'hash', headerName: 'Hash', sortable: false, flex: 200 },
    { field: 'transactions', headerName: 'TXNS', sortable: false, flex: 100, align: 'center', headerAlign: 'center' },
    {
        field: 'relayed',
        headerName: 'Timestamp',
        sortable: false,
        flex: 200,
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

    return (
        <>
            <form onSubmit={onSearchClicked} id="search-form">
                <TextField
                    value={searchText}
                    onChange={onSearchFieldChange}
                    placeholder="Search by id, address or height"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: 1.5,
                        borderRadius: 1.5,
                        mt: 4,
                    }}
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

            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 1,
                    borderRadius: 1.5,
                    mt: 2,
                    mb: 2,
                    height: 450,
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
                        LoadingOverlay: CustomLoadingOverlay,
                    }}
                    hideFooter={true}
                />
            </Box>
            <BlockPagination rowsState={rowsState} pageSize={pageSize} setRowsState={setRowsState} />
        </>
    );
};

export default Block;
