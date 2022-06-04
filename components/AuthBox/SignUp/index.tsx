import {
    Box, CircularProgress,
    IconButton,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import PasswordField from "../../UI/PasswordField";
import ButtonLink from "../../UI/ButtonLink";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, {useEffect, useState} from "react";
import validator from "validator";
import {clearError, errorEqualsPassword} from "../../../store/reducers/userReducer";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {useAppSelector} from "../../../store/redux";
import {emptyValidObj, validationFields} from "../settings";
import {checkEmail, fetchSignUp} from "../../../store/services/ActionCreator";
import {useRouter} from "next/router";

const stepsSignUp = [
    {desc: 'Ввод адреса эл.почты'},
    {desc: 'Ввод данных пользователя'}
];

const SignUp = ({title}: { title: string; }) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [emailOk, setEmailOk] = React.useState(false);
    const [login, setLogin] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [name, setName] = React.useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const {isLoading, error} = useAppSelector(state => state.user);
    const router = useRouter();

    const [validFields, setValidFields] = useState({
        email: emptyValidObj,
        login: emptyValidObj,
        surname: emptyValidObj,
        name: emptyValidObj,
        password: emptyValidObj,
        repeatPassword: emptyValidObj,
    });

    useEffect(() => {
        if(localStorage.getItem('token')) {
            router.push('/');
        }
    },[]);

    const setError = (message: string, field: validationFields,) => {
        setValidFields(prevState => ({
            ...prevState,
            [field]: {
                valid: false,
                message
            }
        }));
    }

    const validationFields = (field: validationFields, value: string) => {
        if (validator.isEmpty(value, { ignore_whitespace: true })) {
            setError('Заполните поле', field);
            return false;
        }
        switch (field) {
            case 'email': {
                if (!validator.isEmail(value, { allow_utf8_local_part: false })) {
                    setError('Email адрес не валиден', field);
                    return false;
                }
                break;
            }
            case 'login': {
                if(!validator.isLength(value, {min: 3})){
                    setError('Минимальная длинная никнейма от 3 знака', field);
                    return false;
                }
                if(!validator.isAscii(value) && !value.match(/^[a-zA-z\d\-]+$/gm)){
                    setError('Поле должно содержать буквы латиницы, цифры и символы -.', field);
                    return false;
                }
                break;
            }
            case 'surname':
            case 'name':{
                if(!validator.isAlpha(value, 'ru-RU') &&
                    !validator.isAlpha(value, 'en-US')){
                    setError('Поле должно содержать буквы кириллици или латиницы', field);
                    return false;
                }
                break;
            }
            case 'password':{
                if(!validator.isStrongPassword(value, {
                    minLength: 8,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })){
                    setError('Пароль должен содержать буквы латиницы, иметь длину от 8 знаков и обязательно содержать 1 заглавную букву, 1 цифру и 1 символ', field);
                    return false;
                }
                break;
            }
        }
        return true;
    }

    const handleNext = () => {
        setActiveStep((activeStep) => activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep((activeStep) => activeStep - 1);
        setEmailOk(false);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validEmail = validationFields('email', email);
        if (validEmail && !emailOk) {
            dispatch(checkEmail({email}))
                .unwrap()
                .then(() => {
                    setEmailOk(true);
                    handleNext();
                });
        }
        if (emailOk) {
            onSubmitSecondStep();
        }
    }

    const onSubmitSecondStep = () => {
        const validLogin = validationFields('login', login);
        const validSurname = validationFields('surname', surname);
        const validName = validationFields('name', name);
        const validPassword = validationFields('password', password)

        if (validLogin &&
            validSurname &&
            validName &&
            validPassword) {
            if (equalsPasswords(password, repeatPassword)) {
                dispatch(fetchSignUp({email, login, password, surname, name, avatarUrl: ''}))
                    .unwrap()
                    .then((originalPromiseResult) => {
                        //TODO: replace href for main page
                        if(originalPromiseResult) {
                            router.push('/');
                        }
                    });
            }
        }
    }

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

    const equalsPasswords = (password: string, repeatPassword: string) => {
        if (password !== repeatPassword) {
            dispatch(errorEqualsPassword());
            return false;
        }
        return true;
    }

    const handlerChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target && event.target.value);
        clearErrorMessage()('email');
    }

    const handlerChangeSurname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(event.target && event.target.value);
        clearErrorMessage()('surname');
    }

    const handlerChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target && event.target.value);
        clearErrorMessage()('name');
    }

    const handlerChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target && event.target.value);
        clearErrorMessage()('login');
    }

    const handlerChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target && event.target.value);
        clearErrorMessage()('password');
    }

    const handlerChangeRepeatPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(event.target && event.target.value);
        clearErrorMessage()('repeatPassword');
    }

    return (
        !isLoading ?
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
                                            color='secondary'
                                            mr={2}>
                                            {step.desc}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })
                    }
                </Stepper>
                <form onSubmit={onSubmit}>
                    <Stack spacing={1.5}>
                        {
                            activeStep === 0 ?
                                <TextField
                                    label="Email"
                                    size='small'
                                    variant="outlined"
                                    color='secondary'
                                    value={email}
                                    error={!validFields['email'].valid}
                                    helperText={validFields['email'].valid ? null : `* ${validFields['email'].message}`}
                                    onChange={handlerChangeEmail}
                                />
                                :
                                <>
                                    <TextField
                                        label="Никнейм пользователя"
                                        size='small'
                                        variant="outlined"
                                        color='secondary'
                                        autoComplete='off'
                                        value={login}
                                        error={!validFields['login'].valid}
                                        helperText={validFields['login'].valid ? null : `* ${validFields['login'].message}`}
                                        onChange={handlerChangeLogin}
                                    />
                                    <TextField
                                        label="Фамилия"
                                        size='small'
                                        variant="outlined"
                                        color='secondary'
                                        autoComplete='off'
                                        value={surname}
                                        error={!validFields['surname'].valid}
                                        helperText={validFields['surname'].valid ? null : `* ${validFields['surname'].message}`}
                                        onChange={handlerChangeSurname}
                                    />
                                    <TextField
                                        label="Имя"
                                        size='small'
                                        variant="outlined"
                                        color='secondary'
                                        autoComplete='off'
                                        value={name}
                                        error={!validFields['name'].valid}
                                        helperText={validFields['name'].valid ? null : `* ${validFields['name'].message}`}
                                        onChange={handlerChangeName}
                                    />
                                    <PasswordField
                                        label='Придумайте пароль'
                                        onChangePassword={handlerChangePassword}
                                        validObj={validFields['password']}
                                        value={password}
                                    />
                                    <PasswordField
                                        label='Повторите пароль'
                                        onChangePassword={handlerChangeRepeatPassword}
                                        validObj={validFields['repeatPassword']}
                                        value={repeatPassword}/>
                                </>
                        }
                        <ButtonLink
                            variant='contained'
                            size='small'
                            type='submit'>
                            {title}
                        </ButtonLink>
                    </Stack>
                </form>
            </>
            :
            <Box textAlign='center'>
                <CircularProgress/>
            </Box>
    );
};

export default SignUp;