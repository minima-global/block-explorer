import { Button } from '@mui/material';

import { IconButton } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import usePagination, { UsePaginationItem } from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import { RowsState } from './../../minima/useRecentBlocks';

interface IProps {
    rowsState: RowsState;
    pageSize: number;
    setRowsState: any;
}

const BlockPagination = ({ rowsState, pageSize, setRowsState }: IProps) => {
    const List = styled('ul')({
        listStyle: 'none',
        padding: 0,
        marginTop: 0,
        marginBottom: 10,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
    });
    const pageCount = Math.max(1, Math.ceil(rowsState.rowCount / pageSize));
    const pagination = usePagination({
        count: pageCount,
        page: rowsState.page + 1,
        showFirstButton: true,
        showLastButton: true,
        onChange: (event, value) => {
            setRowsState((prev: RowsState) => ({ ...prev, page: value - 1 }));
        },
    });
    const items = pagination.items;

    const topRowItems: UsePaginationItem[] = [];
    const bottomRowItems: UsePaginationItem[] = [];

    items.forEach((item) => {
        if (item.type === 'next' || item.type === 'previous') {
            bottomRowItems.push(item);
        } else {
            topRowItems.push(item);
        }
    });

    return (
        <nav style={{ width: '100%' }}>
            <List>
                {topRowItems.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                        children = '…';
                    } else if (type === 'page') {
                        children = (
                            <Button
                                type="button"
                                {...item}
                                variant={selected ? 'contained' : undefined}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'capitalize',
                                    fontSize: 'calc(16px + 0.5vmin)!important',
                                    boxShadow: 0,
                                    backgroundColor: selected ? '#16181C' : null,
                                    color: selected ? '#fff' : null,
                                }}
                                size="small"
                            >
                                {page}
                            </Button>
                        );
                    } else if (type === 'first') {
                        children = (
                            <IconButton aria-label="delete" {...item} sx={{ mr: 0, color: '#16181C' }}>
                                <KeyboardDoubleArrowLeft />
                            </IconButton>
                        );
                    } else if (type === 'last') {
                        children = (
                            <IconButton aria-label="delete" {...item} sx={{ ml: 0, color: '#16181C' }}>
                                <KeyboardDoubleArrowRight />
                            </IconButton>
                        );
                    } else {
                        // nothing. other item types should be on the row below
                    }

                    return <li key={index}>{children}</li>;
                })}
            </List>
            <List style={{ justifyContent: 'center', marginBottom: 40 }}>
                {bottomRowItems.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === 'next' || type === 'previous') {
                        children = (
                            <Button
                                type="button"
                                {...item}
                                variant="contained"
                                sx={{ mt: 1, ml: 1, width: 100, textTransform: 'capitalize', boxShadow: 0 }}
                            >
                                {type}
                            </Button>
                        );
                    }

                    return <li key={index}>{children}</li>;
                })}
            </List>
        </nav>
    );
};

export default BlockPagination;
