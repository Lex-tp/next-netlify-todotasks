import React, {useState} from 'react';
import {emptyValidObj} from "../AuthBox/settings";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useAppSelector} from "../../store/redux";
import {clearError} from "../../store/reducers/userReducer";
import {fetchSendCode, fetchSendResetMail} from "../../store/services/ActionCreator";
import validator from "validator";
import {
    Alert,
    Box,
    CircularProgress, Collapse,
    Divider,
    IconButton, Link as LinkMui,
    Stack,
    Step,
    StepLabel,
    Stepper, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import styles from "../AuthBox/AuthBox.module.scss";
import Logo from "../UI/Logo";
import logoApp from "../../public/static/iconAltApp.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PasswordField from "../UI/PasswordField";
import ButtonLink from "../UI/ButtonLink";
import {validationFields} from "../AuthBox/settings";
import Link from "next/link";

const stepsSignUp = [
    {desc: 'Ввод Email'},
    {desc: 'Подтверждение'},
];

const ResetPassword = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [code, setCode] = React.useState('');
    const [successReset, setSuccessReset] = React.useState(false);
    const [validFields, setValidFields] = useState({
        email: emptyValidObj,
        password: emptyValidObj,
        code: emptyValidObj,
    });
    const dispatch = useDispatch<AppDispatch>();
    const {isLoading, error} = useAppSelector(state => state.user);

    const clearErrorMessage = () => {
        if (error !== '') {
            dispatch(clearError());
        }
        return (field: validationFields) => {
            setValidFields(prevState => ({
                ...prevState,
                [field]: emptyValidObj,
            }));
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (activeStep === 0) {
            const validEmail = validationFields('email', email);
            if (validEmail) {
                dispatch(fetchSendResetMail({email}))
                    .unwrap()
                    .then(() => {
                        handleNext();
                    });
            }
        } else {

            const validPassword = validationFields('password', password);
            const validCode = validationFields('code', code);
            if (validPassword && validCode) {
                dispatch(fetchSendCode({email, code, password}))
                    .unwrap()
                    .then(() => {
                        setSuccessReset(true);
                    });
            }
        }

    }

    const validationFields = (field: validationFields, value: string) => {
        if (validator.isEmpty(value, {ignore_whitespace: true})) {
            setError('Заполните поле', field);
            return false;
        }
        switch (field) {
            case 'email': {
                if (!validator.isEmail(value, {allow_utf8_local_part: false})) {
                    setError('Email адрес не валиден', field);
                    return false;
                }
                break;
            }
            case 'password': {
                if (!validator.isStrongPassword(value, {
                    minLength: 8,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })) {
                    setError('Пароль должен содержать буквы латиницы, иметь длину от 8 знаков и обязательно содержать 1 заглавную букву, 1 цифру и 1 символ', field);
                    return false;
                }
                break;
            }
        }
        return true;
    }

    const setError = (message: string, field: validationFields,) => {
        setValidFields(prevState => ({
            ...prevState,
            [field]: {
                valid: false,
                message
            }
        }));
    }

    const handleNext = () => {
        setActiveStep((activeStep) => activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep((activeStep) => activeStep - 1);
    };

    const handlerChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target && event.target.value);
        clearErrorMessage()('email');
    }

    const handlerChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target && event.target.value);
        clearErrorMessage()('code');
    }

    const handlerChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target && event.target.value);
        clearErrorMessage()('password');
    }

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
                    Восстановление пароля
                </Typography>
                <Divider/>
                {
                    successReset ?
                        <Stack
                            spacing={2}
                            textAlign='center'>
                            <Alert>Пароль успешно изменен!</Alert>
                            <Link
                                href='/users/signin'
                                passHref>
                                <LinkMui
                                    underline='hover'
                                    mx={1}
                                    fontSize={15}>
                                    Войти в учетную запись
                                </LinkMui>
                            </Link>
                        </Stack>
                        :
                        <>
                            {
                                activeStep === stepsSignUp.length - 1 ?
                                    <Stack
                                        direction='row'
                                        alignItems='center'>
                                        <Tooltip title='Предыдущий шаг'>
                                            <IconButton
                                                aria-label="back"
                                                color='primary'
                                                onClick={handleBack}>
                                                <ArrowBackIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Typography
                                            variant='h6'
                                            fontWeight='600'
                                            component="span"
                                            color='secondary'>
                                            {email}
                                        </Typography>
                                    </Stack>
                                    :
                                    null
                            }
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {
                                    stepsSignUp.map((step) => {
                                        return (
                                            <Step key={step.desc}>
                                                <StepLabel>
                                                    <Typography
                                                        variant='body2'
                                                        textAlign='center'
                                                        component="p"
                                                        color='secondary'>
                                                        {step.desc}
                                                    </Typography>
                                                </StepLabel>
                                            </Step>
                                        );
                                    })
                                }
                            </Stepper>
                            {
                                isLoading ?
                                    <Box textAlign='center'>
                                        <CircularProgress/>
                                    </Box>
                                    :
                                    <form onSubmit={onSubmit}>
                                        <Stack spacing={1.5}>
                                            {
                                                activeStep === 0 ?
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            textAlign='center'
                                                            component="p"
                                                            color='secondary'>
                                                            Для восстановления пароля, введите свою электронную почту.
                                                        </Typography>
                                                        <TextField
                                                            label="Email для восстановления пароля"
                                                            size='small'
                                                            variant="outlined"
                                                            color='secondary'
                                                            value={email}
                                                            error={!validFields['email'].valid}
                                                            helperText={validFields['email'].valid ? null : `* ${validFields['email'].message}`}
                                                            onChange={handlerChangeEmail}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            textAlign='center'
                                                            component="p"
                                                            color='secondary'>
                                                            Введите код отправленный Вам на электронный адрес.
                                                        </Typography>
                                                        <TextField
                                                            label="Код"
                                                            size='small'
                                                            variant="outlined"
                                                            color='secondary'
                                                            autoComplete='off'
                                                            value={code}
                                                            onChange={handlerChangeCode}
                                                            error={!validFields['code'].valid}
                                                            helperText={validFields['code'].valid ? null : `* ${validFields['code'].message}`}
                                                        />
                                                        <PasswordField
                                                            label='Придумайте новый пароль'
                                                            onChangePassword={handlerChangePassword}
                                                            validObj={validFields['password']}
                                                            value={password}
                                                        />
                                                    </>
                                            }
                                            <Collapse in={error !== ''}>
                                                <Alert variant="outlined" severity="error">
                                                    {
                                                        error
                                                    }
                                                </Alert>
                                            </Collapse>
                                            <ButtonLink
                                                variant='contained'
                                                size='small'
                                                type='submit'>
                                                Продолжить
                                            </ButtonLink>
                                        </Stack>
                                    </form>
                            }
                        </>
                }
            </Stack>
        </Box>
    );
};

export default ResetPassword;