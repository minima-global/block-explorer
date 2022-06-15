import { Button, Box, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IconButton } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import usePagination, { UsePaginationItem } from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import { RowsState } from './../../minima/useRecentBlocks';
import { useState } from 'react'

interface IProps {
    rowsState: RowsState;
    pageSize: number;
    setRowsState: any;
}

const BlockPagination = ({ rowsState, pageSize, setRowsState }: IProps) => {
    const currentPage = rowsState.page;
    const pageCount = Math.max(1, Math.ceil(rowsState.rowCount / pageSize));
    const prevDisabled = currentPage <= 0;
    const nextDisabled = currentPage + 1 >= pageCount;

    const onPreviousClicked = () => {
        const newPage = currentPage - 1;
        setRowsState((prev: RowsState) => ({ ...prev, page: newPage }));
    };

    const onNextClicked = () => {
        const newPage = currentPage + 1;
        setRowsState((prev: RowsState) => ({ ...prev, page: newPage }));
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button sx={{ m: 1 }} variant="contained" disabled={prevDisabled} onClick={onPreviousClicked} size="small">
                Prev
            </Button>
            <Button sx={{ m: 1 }} variant="contained" disabled={nextDisabled} onClick={onNextClicked} size="small">
                Next
            </Button>
        </Box>
    );
};

export default BlockPagination;
