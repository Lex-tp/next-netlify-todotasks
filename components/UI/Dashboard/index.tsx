import React, {useEffect, useState} from 'react';
import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Popover,
    Stack,
    SvgIcon,
} from "@mui/material";
import {
    Event,
    EventAvailable,
    EventBusy,
    AllInbox,
    LocalOffer,
    CalendarToday,
    Today,
} from "@mui/icons-material";
import styles from './Dashboard.module.scss';
import SideBar from "../SideBar";
import MainFrame from "./Frames";
import {useAppSelector} from "../../../store/redux";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {selectTabFrame} from "../../../store/reducers/userReducer";
import {getAllTags, getAllTasks, getStatUser, incFailStatUser} from "../../../store/services/ActionCreator";
import {isToday} from "date-fns";

export interface MenuDashboard {
    icon: any,
    title: string,
    color: string,
    count: number
}

const Dashboard = () => {
    const [value, setValue] = useState('Категории');
    const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
    const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
    const openMenuCategory = Boolean(anchorElCategory);
    const openMenuMore = Boolean(anchorElMore);
    const dispatch = useDispatch<AppDispatch>();
    const {tags, tasks, selectTab} = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllTasks({sort: 'DESC'}));
        dispatch(getAllTags());
    }, []);

    const SideMenu: Array<MenuDashboard> = [
        {
            icon: AllInbox, title: 'Все задачи', color: 'rgba(23,55,122,0.9)', count: tasks.length
        },
        {
            icon: Today, title: 'Сегодня', color: 'rgba(45,97,199,0.9)', count: tasks.filter((task) => {
                return !task.done && isToday(new Date(task.term)) && new Date(task.term) > new Date();
            }).length
        },
        {
            icon: Event, title: 'Предстоящие', color: 'rgba(114,88,190,0.9)', count: tasks.filter((task) => {
                return !task.done && new Date(task.term) > new Date();
            }).length
        },
        {
            icon: EventAvailable,
            title: 'Выполненные',
            color: 'rgba(35,180,40,0.9)',
            count: tasks.filter((task) => task.done).length
        },
        {
            icon: EventBusy, title: 'Пропущенные', color: 'rgba(218,10,10,0.9)', count: tasks.filter((task) => {
                return !task.done && new Date(task.term) < new Date();
            }).length
        },
        {icon: LocalOffer, title: 'Метки', color: 'rgba(35,201,162,0.9)', count: tags.length},
    ];

    const handleClickCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElCategory(event.currentTarget);
    };

    const handleCloseCategory = () => {
        setAnchorElCategory(null);
    };

    const handleClickMore = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElMore(event.currentTarget);
    };

    const handleCloseMore = () => {
        setAnchorElMore(null);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleSelectFrame = (numberFrame: number) => {
        dispatch(selectTabFrame({numberTab: numberFrame}));
    }

    return (
        <Box
            className={styles.main_wrapper}>
            <Stack
                direction='row'
                justifyContent='space-between'>
                <SideBar menuItems={[...SideMenu]} selectHandler={handleSelectFrame}/>
                <Box
                    className={styles.main_board}
                    my={2}
                    mx={4}
                    minWidth={0}
                    component='section'>
                    <MainFrame selectFrame={selectTab}/>
                </Box>
            </Stack>
            <BottomNavigation
                value={value}
                onChange={handleChange}
                className={styles.footer_wrapper}
                sx={{display: {xs: 'flex', md: 'none'}}}>
                <BottomNavigationAction
                    label='Категории'
                    value='Категории'
                    onClick={handleClickCategory}
                    showLabel
                    icon={
                        <SvgIcon
                            component={CalendarToday}
                        />}
                />
                <BottomNavigationAction
                    label='Дополнительно'
                    value='Дополнительно'
                    onClick={handleClickMore}
                    showLabel
                    icon={
                        <SvgIcon
                            component={Today}
                        />}
                />
            </BottomNavigation>
            <Popover
                open={openMenuCategory}
                anchorEl={anchorElCategory}
                onClose={handleCloseCategory}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <MenuList>
                    {
                        SideMenu.slice(0, 5).map((element, index) => {
                            return (
                                <MenuItem key={index} onClick={() => handleSelectFrame(index+1)}>
                                    <ListItemIcon>
                                        <SvgIcon
                                            color='secondary'
                                            component={element.icon}
                                        />
                                    </ListItemIcon>
                                    <ListItemText>{element.title}</ListItemText>
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Popover>
            <Popover
                open={openMenuMore}
                anchorEl={anchorElMore}
                onClose={handleCloseMore}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <MenuList>
                    {
                        SideMenu.slice(5, 6).map((element, index) => {
                            return (
                                <MenuItem key={index} onClick={() => handleSelectFrame(index + 6)}>
                                    <ListItemIcon>
                                        <SvgIcon
                                            color='secondary'
                                            component={element.icon}
                                        />
                                    </ListItemIcon>
                                    <ListItemText>{element.title}</ListItemText>
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Popover>
        </Box>
    );
};

export default Dashboard;