import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Divider,
    Link as LinkMui,
    Stack,
    Typography
} from "@mui/material";
import Link from 'next/link';
import logoApp from "../../public/static/iconAltApp.svg";
import styles from './AuthBox.module.scss'
import GitHubIcon from "@mui/icons-material/GitHub";
import ServiceButton from "../UI/ServiceButton";
import Logo from "../UI/Logo";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {useAppSelector} from "../../store/redux";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {signInWithGitHub} from "../../store/reducers/userReducer";
import {useRouter} from "next/router";

interface AuthBoxProps {
    type: 'signIn' | 'signUp',
}

const AuthBox = (props: AuthBoxProps) => {
    const router = useRouter();
    const title = props.type === 'signIn' ? 'Вход' : 'Регистрация';
    const dispatch = useDispatch<AppDispatch>();
    const error = useAppSelector(state => state.user.error);
    const {isAuth} = useAppSelector(state => state.user);
    const [isEnterGithub, setEnterGithub] = useState(false);
    let windowAuth: Window | null;

    const signInGitHub = () => {
        setEnterGithub(true);
        windowAuth = window.open(
            'http://localhost:3001/auth/github',
            'Auth',
            'width=500,height=500,status=yes,toolbar=no,menubar=no,location=no',
        );
    }

    const handlePostMessage = (payload: MessageEvent<any>) => {
        if (payload.data !== null) {
            if (payload.data.withGitHub) {
                dispatch(signInWithGitHub(payload.data));
            }
        }
    }

    const cancelSignInGitHub = () => {
        setEnterGithub(false);
    }

    useEffect(() => {
        window.addEventListener('message', handlePostMessage);
        return () => {
            window.removeEventListener('message', handlePostMessage);
        };
    }, []);

    useEffect(() => {
        if (isAuth) {
            router.push('/');
            setEnterGithub(false);
        }
    }, [isAuth]);

    return (
        <Box
            className={styles.auth_wrapper}
            component='main'>
            <Stack
                className={styles.auth_content}
                spacing={2}
                p={3}>
                <Stack direction='row' alignItems='center'>
                    <Logo
                        icon={logoApp}
                        title='ToDoTasks'
                        iconWidth={55}
                        iconHeight={55}
                        color='secondary'
                        isResponsive={false}/>
                </Stack>
                <Typography
                    variant='h5'
                    fontWeight='bold'
                    noWrap
                    component="span"
                    color='secondary'
                    mr={2}>
                    {title}
                </Typography>
                {
                    !isEnterGithub ?
                        <>
                            <ServiceButton serviceTitle='GitHub' startIcon={<GitHubIcon/>} onClick={signInGitHub}/>
                            <Divider>
                                <Typography
                                    variant='subtitle2'
                                    noWrap
                                    component="span"
                                    color='secondary'
                                    textTransform='uppercase'>
                                    или
                                </Typography>
                            </Divider>
                            {
                                props.type === 'signIn' ? <SignIn title={title}/> : <SignUp title={title}/>
                            }
                            <Collapse in={error !== ''}>
                                <Alert variant="outlined" severity="error">
                                    {
                                        error
                                    }
                                </Alert>
                            </Collapse>
                            <Divider/>
                            <Typography
                                textAlign='center'
                                variant='subtitle1'
                                noWrap
                                component="span"
                                color='secondary'>
                                {
                                    props.type === 'signIn' ?
                                        'У вас ещё нет аккаунта?' : 'Есть аккаунт?'
                                }
                                <Link href={`/users/${props.type === 'signUp' ? 'signin' : 'signup'}`} passHref>
                                    <LinkMui
                                        underline='hover'
                                        mx={1}
                                        fontSize={15}>
                                        {props.type === 'signUp' ? 'Вход' : 'Регистрация'}
                                    </LinkMui>
                                </Link>
                            </Typography>
                        </>
                        :
                        <Box>
                            <Stack
                                alignItems='center'
                                spacing={2}>
                                <CircularProgress/>
                                <Typography
                                    variant='h5'
                                    component="span"
                                    color='secondary'
                                    textAlign='center'>
                                    Выполняется вход с помощью GitHub
                                </Typography>
                                <Button
                                    variant='outlined'
                                    size='small'
                                    color='primary'
                                    onClick={cancelSignInGitHub}>
                                    Отмена</Button>
                            </Stack>
                        </Box>
                }
            </Stack>
        </Box>
    );
};

export default AuthBox;