import {Box, Chip, List, ListItemButton, ListItemIcon, ListItemText, SvgIcon, Typography} from "@mui/material";
import styles from './SideBar.module.scss'
import {MenuDashboard} from "../Dashboard";
import React, {useState} from "react";

interface SideBarProps {
    menuItems: Array<MenuDashboard>,

    selectHandler(numberFrame: number): void
}

const SideBar = (props: SideBarProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    return (
        <Box
            sx={{display: {xs: 'none', md: 'block'}}}
            minHeight={330}
            maxWidth={240}
            minWidth={240}>
            <List
                sx={{
                    position: 'sticky',
                    top: '65px',
                    '& .Mui-selected': {
                        backgroundColor: 'rgba(0,0,0,0.04) !important',
                    },
                }}
                component='nav'>
                {
                    props.menuItems.map((element, index) => {
                        return (
                            <ListItemButton
                                key={index}
                                className={styles.menu_item}
                                selected={selectedIndex === index}
                                onClick={(event) => {
                                    handleListItemClick(event, index);
                                    props.selectHandler(index + 1)
                                }}
                                disableRipple={true}>
                                <ListItemIcon className={styles.menu_item_icon}>
                                    <SvgIcon
                                        component={element.icon}
                                        sx={{color: element.color}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={element.title}/>
                                {
                                    element.count > 0 ?
                                        <Chip
                                            label={
                                                <Typography
                                                    variant='subtitle2'
                                                    fontWeight={600}
                                                    component='span'>
                                                    {element.count}
                                                </Typography>
                                            }
                                            size='small'
                                            variant='filled'
                                            color='primary'
                                        />
                                        :
                                        null
                                }
                            </ListItemButton>
                        )
                    })
                }
            </List>
        </Box>
    );
};

export default SideBar;