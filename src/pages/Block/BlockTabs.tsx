import { Box } from '@mui/material';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

interface IProps {
    tabNumber: number;
    setTabNumber: (tabNumber: number) => void;
}

const BlockTabs = ({ tabNumber, setTabNumber }: IProps) => {
    const onTabSelected = (event: any, newValue: any) => {
        setTabNumber(newValue);
    };

    const Tab = styled(TabUnstyled)`
        background: rgb(54, 58, 63);
        border-radius: 6px;
        width: 100%;

        color: #363A3F
        cursor: pointer;
        font-family: Manrope;
        font-style: normal;
        font-weight: 800;
        font-size: 14px;
        line-height: 21px;

        text-align: center;
        letter-spacing: 0.01em;
        background-color: transparent;

        padding: 12px 16px;
        margin: 6px 6px;
        border: none;
        border-radius: 5px;

        display: flex;
        justify-content: center;

        &:hover {
            color: rgb(54, 58, 63);
            cursor: pointer;
        }

        &.${tabUnstyledClasses.selected} {
            color: #ffffff;
            background: rgb(54, 58, 63);
            border-radius: 6px;
        }
    `;

    const TabsList = styled(TabsListUnstyled)`
        min-width: 320px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: space-between;
    `;

    return (
        <Box
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: 1,
                borderRadius: 1,
                mt: 4,
                mb: 2,
                minWidth: 300,
            }}
        >
            <TabsUnstyled value={tabNumber} onChange={onTabSelected}>
                <TabsList>
                    <Tab>Details</Tab>
                    <Tab>Inputs</Tab>
                    <Tab>Outputs</Tab>
                </TabsList>
            </TabsUnstyled>
        </Box>
    );
};

export default BlockTabs;
