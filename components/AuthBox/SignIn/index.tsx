import {Box, CircularProgress, Link as LinkMui, Stack, TextField} from "@mui/material";
import PasswordField from "../../UI/PasswordField";
import Link from 'next/link'
import ButtonLink from "../../UI/ButtonLink";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {useAppSelector} from "../../../store/redux";
import {fetchSignIn} from "../../../store/services/ActionCreator";
import {clearError} from "../../../store/reducers/userReducer";
import validator from "validator";
import {useRouter} from "next/router";
import {emptyValidObj} from "../settings";

const SignIn = ({title}: { title: string; }) => {
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [validFields, setValidFields] = useState({
        login: emptyValidObj,
        password: emptyValidObj,
    });

    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const {isLoading, error, isAuth} = useAppSelector(state => state.user);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            router.push('/');
        }
    },[]);

    const validationFields = (field:'login'|'password', value:string) => {
        if(validator.isEmpty(value, {ignore_whitespace: true})) {
            setValidFields( prevState => ({
                ...prevState,
                [field]: {
                    valid: false,
                    message: 'Заполните поле'
                }
            }));
            return false;
        }
        return true;
    }

    const clearErrorMessage = () => {
        if (error !== '') {
            dispatch(clearError());
        }
        return (field: 'login'|'password')=>{
            setValidFields( prevState => ({
                ...prevState,
                [field]: emptyValidObj,
            }));
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validLogin = validationFields('login',login);
        const validPassword = validationFields('password',password);
        if(validLogin && validPassword) {
            dispatch(fetchSignIn({login, password}))
                .unwrap()
                .then((originalPromiseResult) => {
                    if(originalPromiseResult) {
                        router.push('/dashboard');
                    }
                });
        }
    }

    const handlerChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target && event.target.value);
        clearErrorMessage()('login');
    }

    const handlerChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target && event.target.value);
        clearErrorMessage()('password');
    }

    return (
        !isLoading ?
            <form onSubmit={onSubmit}>
                <Stack spacing={1.5}>
                    <TextField
                        label="Имя пользователя или Email"
                        size='small'
                        variant="outlined"
                        color='secondary'
                        error={!validFields['login'].valid}
                        helperText={validFields['login'].valid ? null: `* ${validFields['login'].message}`}
                        value={login}
                        onChange={handlerChangeLogin}
                    />
                    <PasswordField
                        value={password}
                        validObj = {validFields['password']}
                        onChangePassword={handlerChangePassword}/>
                    <Box>
                        <Link
                            href='/users/reset/password'
                            passHref>
                            <LinkMui
                                underline='hover'
                                color='secondary'
                                ml={2}
                                fontSize={14}>Забыли пароль?</LinkMui>
                        </Link>
                    </Box>
                    <ButtonLink
                        type='submit'
                        variant='contained'
                        size='small'>
                        {title}
                    </ButtonLink>
                </Stack>
            </form>
            :
            <Box textAlign='center'>
                <CircularProgress/>
            </Box>
    );
};

export default SignIn;