import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import styles from './ProfileMenu.module.scss';
import React, {useState} from "react";
import {
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon, Help,
} from '@mui/icons-material';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {logout} from "../../../store/services/ActionCreator";
import {useRouter} from "next/router";
import {stringAvatar} from "./settings";

interface ProfileProps {
    avatar: string,
    login: string,
    username: string,
    email:string,
}

type MenuItemTypeHandler = 'profile'|'dashboard'|'reference'|'logout';


interface ProfileMenuItem {
    id: number,
    icon: any,
    title: string,
    handler: MenuItemTypeHandler
}

const menuItems:Array<ProfileMenuItem> = [
    {id: 1, icon: PersonIcon, title: 'Профиль', handler: 'profile'},
    {id: 2, icon: DashboardIcon, title: 'Рабочий стол', handler: 'dashboard'},
    {id: 3, icon: Help, title: 'Справка', handler: 'reference'},
    {id: 4, icon: LogoutIcon, title: 'Выйти', handler: 'logout'}
];

const ProfileMenu = (props: ProfileProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlerMenuItem = (type:MenuItemTypeHandler) =>{
        switch (type) {
            case 'logout': {
                dispatch(logout());
                break;
            }
            case 'dashboard': {
                router.push('/dashboard');
                break;
            }
            case 'profile': {
                router.push('/users/profile');
                break;
            }
            case 'reference': {
                router.push('/reference');
                break;
            }
        }
    }

    return (
        <>
            <Box>
                <Tooltip title={props.login}>
                    <IconButton
                        onClick={handleOpenUserMenu}>
                        <Avatar
                            className={styles.avatar}
                            alt={props.login}
                            src={props.avatar}
                            {...props.avatar !== ''? null:stringAvatar(props.username)}/>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem
                    disableRipple={true}
                    sx={{
                        cursor: 'default',
                        userSelect:'text'
                    }}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        spacing={2}>
                        <Avatar
                            alt={props.login}
                            src={props.avatar}
                            sx={{width: 60, height: 60}}
                            {...props.avatar !== ''? null:stringAvatar(props.username)}/>
                        <Stack>
                            <Typography
                                variant="h6"
                                fontWeight={600}>
                                {props.username}
                            </Typography>
                            <Stack
                                direction='row'
                                spacing={1}
                                alignItems='center'>
                                <Typography
                                    textAlign="center"
                                    variant="subtitle2"
                                >
                                    {props.email}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </MenuItem>
                <Divider/>
                {menuItems.map((item:ProfileMenuItem) => (
                    <MenuItem key={item.id} onClick={()=>{
                        handleCloseUserMenu();
                        handlerMenuItem(item.handler);
                    }}>
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={1}>
                            <SvgIcon
                                component={item.icon}
                                fontSize='small' />
                            <Typography
                                textAlign="center">{item.title}</Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ProfileMenu;