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
    console.log('rowsState', rowsState)
    const currentPage = rowsState.page
    const pageCount = Math.max(1, Math.ceil(rowsState.rowCount / pageSize));
    const prevDisabled = currentPage <= 1
    const nextDisabled = (currentPage + 1) >= pageCount

    const onPreviousClicked = () => {
        const newPage = currentPage - 1
        setRowsState((prev: RowsState) => ({ ...prev, page: newPage }));
    }

    const onNextClicked = () => {
        const newPage = currentPage + 1
        setRowsState((prev: RowsState) => ({ ...prev, page: newPage }));
    }

    const PageDropdown = () => {
        const createValueString = (index: number) => {
            return 'Page ' + (index + 1)
        }
        const menuItems = Array.from({length: pageCount}, (v, index) => ({value: index, text: createValueString(index)}))
        const onPageSelected = (event: SelectChangeEvent) => {
            const newPageNumber = event.target.value
            console.log('newPageNumber', newPageNumber)
            setRowsState((prev: RowsState) => ({ ...prev, page: parseInt(newPageNumber) }));
        }
        return (
            <Select value={createValueString(pageCount)} onChange={onPageSelected}>
                {menuItems.map((menuItem) => (
                    <MenuItem value={menuItem.value.toString()}>{menuItem.text}</MenuItem>
                ))}
            </Select>
        )
    }

    const [age, setAge] = useState('');

    console.log('age', age)

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={prevDisabled} onClick={onPreviousClicked}>Prev</Button>
            <PageDropdown></PageDropdown>
            <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
            <Button variant="contained" disabled={nextDisabled} onClick={onNextClicked}>Next</Button>
        </Box>
    )   
};

export default BlockPagination;
