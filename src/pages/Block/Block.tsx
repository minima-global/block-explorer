import useStatus from '../../minima/useStatus';
import useRecentBlocks from '../../minima/useRecentBlocks';
import { DataGrid, GridColDef, GridRowParams, GridCallbackDetails } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { MuiEvent } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const recentBlockColumns: GridColDef[] = [
    { field: 'block', headerName: 'Block', flex: 100 },
    { field: 'hash', headerName: 'Hash', flex: 100 },
    { field: 'transactions', headerName: 'TKNS', flex: 100 },
    { field: 'relayed', headerName: 'Relayed', flex: 100 },
];

const Block = () => {
    // const status = useStatus();
    const recentBlocks = useRecentBlocks();
    const routerNavigate = useNavigate();

    // console.log('status', status);
    console.log('recentBlocks', recentBlocks);

    const onGridRowClicked = (
        params: GridRowParams,
        event: MuiEvent<React.MouseEvent>,
        details: GridCallbackDetails
    ) => {
        const hash = params.row.hash;
        console.log('hash', hash);
        routerNavigate(`/block/${hash}`);
    };

    return (
        <>
            <h1>Block</h1>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={recentBlocks}
                    columns={recentBlockColumns}
                    getRowId={(row) => row.block}
                    onRowClick={onGridRowClicked}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
        </>
    );
};

export default Block;
