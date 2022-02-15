import { useEffect, useState, ChangeEvent, ChangeEventHandler } from 'react';
import { DataGrid, GridColDef, GridRowParams, GridCallbackDetails, GridRowModel } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';
import { MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useRecentBlocksContext } from '../../minima/RecentBlocksContext';
import { TextField, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

const recentBlockColumns: GridColDef[] = [
    { field: 'block', headerName: 'Block', flex: 100 },
    { field: 'hash', headerName: 'Hash', flex: 100 },
    { field: 'transactions', headerName: 'TKNS', flex: 100, align: 'center', headerAlign: 'center' },
    { field: 'relayed', headerName: 'Relayed', flex: 100 },
];

interface RowsState {
    page: number;
    pageSize: number;
    rows: GridRowModel[];
    loading: boolean;
}

const TOTAL_ROWS = 1000;

const Block = () => {
    const blocksContextData = useRecentBlocksContext();
    const routerNavigate = useNavigate();
    const [rowsState, setRowsState] = useState<RowsState>({
        page: 0,
        pageSize: 10,
        rows: [],
        loading: false,
    });
    const [searchText, setSearchText] = useState('');

    const newTable = blocksContextData.blockTablePage;
    const setVisiblePage = blocksContextData.setVisiblePage;
    const setSearchString = blocksContextData.setSearchString;

    console.log('Block component rerender ', Date.now());

    useEffect(() => {
        setRowsState((prev) => ({ ...prev, loading: false, rows: newTable }));
    }, [newTable]);

    useEffect(() => {
        setVisiblePage(rowsState.page);
    }, [rowsState.page]);

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
        return (
            <Pagination
                color="primary"
                count={100}
                page={rowsState.page + 1}
                onChange={(event, value) => {
                    setRowsState((prev) => ({ ...prev, page: value - 1 }));
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
                    pagination
                    rowCount={TOTAL_ROWS}
                    {...rowsState}
                    paginationMode="server"
                    density="compact"
                    components={{
                        Pagination: CustomPagination,
                    }}
                    // onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                    // onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
                />
            </Box>

            <Box sx={{ height: 500, width: '100%', mt: 2 }}>
                <DataGrid
                    rows={blocksContextData.recentBlocks}
                    columns={recentBlockColumns}
                    getRowId={(row) => row.txpowid}
                    onRowClick={onGridRowClicked}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    density="compact"
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'block', sort: 'desc' }],
                        },
                    }}
                />
            </Box>
        </>
    );
};

export default Block;
