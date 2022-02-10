import useStatus from '../../minima/useStatus';
import { DataGrid, GridColDef, GridRowParams, GridCallbackDetails } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useRecentBlocksContext } from '../../minima/RecentBlocksContext';

const recentBlockColumns: GridColDef[] = [
    { field: 'block', headerName: 'Block', flex: 100 },
    { field: 'hash', headerName: 'Hash', flex: 100 },
    { field: 'transactions', headerName: 'TKNS', flex: 100, align: 'center', headerAlign: 'center' },
    { field: 'relayed', headerName: 'Relayed', flex: 100 },
];

const Block = () => {
    // const status = useStatus();
    const blocksContextData = useRecentBlocksContext();
    const routerNavigate = useNavigate();

    const onGridRowClicked = (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent>,
        details: GridCallbackDetails
    ) => {
        const hash = params.row.hash;
        routerNavigate(`/${hash}`);
    };

    return (
        <>
            <Box sx={{ height: 500, width: '100%', mt: 2 }}>
                <DataGrid
                    rows={blocksContextData.recentBlocks}
                    columns={recentBlockColumns}
                    getRowId={(row) => row.block}
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
