import { Button } from '@mui/material';

import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
        padding: 1,
        marginTop: 0,
        marginBottom: 10,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
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
                                sx={{ borderRadius: 10, minWidth: 40 }}
                                size="small"
                            >
                                {page}
                            </Button>
                        );
                    } else if (type === 'first') {
                        children = (
                            <IconButton aria-label="delete" color="primary" {...item}>
                                <ArrowBackIcon />
                            </IconButton>
                        );
                    } else if (type === 'last') {
                        children = (
                            <IconButton aria-label="delete" color="primary" {...item}>
                                <ArrowForwardIcon />
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
                            <Button type="button" {...item} variant="contained" sx={{ mt: 1, ml: 1, width: 100 }}>
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
