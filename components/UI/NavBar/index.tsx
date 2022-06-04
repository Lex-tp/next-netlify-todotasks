import {AppBar, Container, Stack, Toolbar, Typography} from "@mui/material";
import Logo from "../Logo";
import styles from './NavBar.module.scss'
import logoApp from "../../../public/static/iconApp.svg";
import AuthButton from "../AuthButton";
import {useAppSelector} from "../../../store/redux";
import ProfileMenu from "../ProfileMenu";

const NavBar = () => {
    const {isAuth, user} = useAppSelector(state => state.user);

    return (
        <AppBar position='sticky'>
            <Container maxWidth="xl">
                <Toolbar className={styles.navbar} disableGutters>
                    <Logo icon={logoApp} title='ToDoTasks' color='primary.contrastText' iconHeight={45} iconWidth={45}
                          isResponsive={true}/>
                    {
                        isAuth ?
                            <Stack
                                direction='row'
                                spacing={1}
                                alignItems='center'>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    color='primary.contrastText'
                                >
                                    {user.login}
                                </Typography>
                                <ProfileMenu
                                    avatar={user.avatarUrl}
                                    login={user.login}
                                    username={`${user.surname} ${user.name}`}
                                    email={user.email}
                                />
                            </Stack>
                            :
                            <AuthButton/>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;