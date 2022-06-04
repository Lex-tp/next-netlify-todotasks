import React, {useEffect, useState} from 'react';
import {Avatar, Button, Divider, Grid, Stack, styled, TextField, Tooltip, Typography} from "@mui/material";
import styles from "./ProfileContent.module.scss";
import {stringAvatar} from "../UI/ProfileMenu/settings";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useAppSelector} from "../../store/redux";
import {AssignmentTurnedIn, Circle, DateRange, Done, Edit, Email, Person, PersonAdd} from "@mui/icons-material";
import axios from "axios";
import {getStatUser, incFailStatUser, updateAvatar, updateUserInfo} from "../../store/services/ActionCreator";
import {API_URL} from "../../http";
import {useSnackbar} from "notistack";
import validator from "validator";
import {differenceInCalendarDays} from "date-fns";
import {VictoryPie} from "victory";
import Image from "next/image";
import statImage from "../../public/static/stat.jpg";

const Input = styled('input')({
    display: 'none',
});

const ProfileContent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user, stat, tasks} = useAppSelector(state => state.user);
    const [editMode, setEditMode] = useState(false);
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorSurname, setErrorSurname] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const editProfile = () => {
        setEditMode(true);
    }

    const onChangeSurname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(event.target && event.target.value);
        setErrorSurname(false);
    }

    const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target && event.target.value);
        setErrorName(false);
    }

    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target && event.target.value);
        setErrorEmail(false);
    }

    const saveEdit = () => {
        if (validator.isEmpty(surname, {ignore_whitespace: true})) {
            setErrorSurname(true);
        }
        if (validator.isEmpty(name, {ignore_whitespace: true})) {
            setErrorName(true);
        }
        if (validator.isEmpty(email, {ignore_whitespace: true})
            || !validator.isEmail(email, {allow_utf8_local_part: false})) {
            setErrorEmail(true);
        }
        if (!validator.isEmpty(surname, {ignore_whitespace: true}) &&
            !validator.isEmpty(name, {ignore_whitespace: true}) &&
            !validator.isEmpty(email, {ignore_whitespace: true})
            && validator.isEmail(email, {allow_utf8_local_part: false})
        ) {
            dispatch(updateUserInfo({surname, name, email})).then(() => {
                setEditMode(false);
                enqueueSnackbar(`Данные профиля успешно изменены!`, {variant: "success"});
            });
        }

    }

    const sendFile = async (file: File) => {
        if (file.name) {
            const data = new FormData();
            data.append('image', file);
            return await axios.post('https://todotask-server.herokuapp.com/image/upload', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
        }
    }

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.currentTarget as HTMLInputElement;
        if (event.target.files && event.target.files.length > 0) {
            const file = target.files![0];
            sendFile(file).then((res) => {
                if (res) {
                    dispatch(updateAvatar({file: `${API_URL}/files/${res.data.body.filename}`}));
                }
            }).catch(() => {
                enqueueSnackbar(`Неверное изображение либо превышен размер. Попробуйте еще раз!`, {variant: "error"});
            });
        }
    }

    useEffect(() => {
        dispatch(getStatUser({userId: parseInt(user.userId)}));
    }, []);

    useEffect(() => {
        setName(user.name);
        setSurname(user.surname);
        setEmail(user.email);
    }, [user.name, user.surname, user.email]);

    return (
        <Grid py={5} container spacing={4} justifyContent='center'>
            <Grid item xs={"auto"}>
                <Stack
                    alignItems='center'
                    spacing={1}
                    direction='column'>
                    <Avatar
                        className={styles.avatar}
                        alt={user.login}
                        src={user.avatarUrl}
                        {...user.avatarUrl !== '' ? null : stringAvatar(`${user.surname} ${user.name}`)}/>
                    <Tooltip title='Сменить изображение профиля'>
                        <label>
                            <Input
                                id='file-upload'
                                accept="image/png,image/jpg,image/jpeg"
                                onChange={onChangeFile}
                                type="file"/>
                            <Button
                                component="span"
                                className={styles.change_button}
                                size='small'>
                                Сменить изображение
                            </Button>
                        </label>
                    </Tooltip>
                    <Typography
                        component='span'
                        textAlign='center'
                        color='secondary.main'
                        variant='caption'>
                        Выберите фото размером до 3МБ.
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={9}>
                <Stack
                    spacing={1}
                    direction='column'>
                    <Stack
                        alignItems='center'
                        justifyContent='space-between'
                        spacing={1}
                        direction={{xs: 'column',sm: 'row', md: 'row'}}>
                        <Typography
                            color='secondary.main'
                            fontWeight={600}
                            variant='h4'>
                            {`${user.surname} ${user.name}`}
                        </Typography>
                        <Button
                            size='small'
                            variant="outlined"
                            onClick={editProfile}
                            startIcon={<Edit/>}>
                            Редактировать
                        </Button>
                    </Stack>
                    <Divider/>
                    <Stack
                        py={2}
                        spacing={2}
                        direction='column'>
                        {
                            editMode ?
                                <Stack
                                    spacing={3}
                                    direction='column'>
                                    <Stack
                                        spacing={2}
                                        direction='row'>
                                        <TextField
                                            size='small'
                                            label='Фамилия'
                                            value={surname}
                                            autoComplete='off'
                                            onChange={onChangeSurname}
                                            error={errorSurname}
                                            helperText={
                                                errorSurname ?
                                                    <Typography
                                                        variant="caption"
                                                        color='primary.main'
                                                        component="span">
                                                        Необходимо обязательно заполнить фамилию!
                                                    </Typography>
                                                    :
                                                    null
                                            }
                                        />
                                        <TextField
                                            size='small'
                                            label='Имя'
                                            value={name}
                                            autoComplete='off'
                                            onChange={onChangeName}
                                            error={errorName}
                                            helperText={
                                                errorName ?
                                                    <Typography
                                                        variant="caption"
                                                        color='primary.main'
                                                        component="span">
                                                        Необходимо обязательно заполнить имя!
                                                    </Typography>
                                                    :
                                                    null
                                            }
                                        />
                                    </Stack>
                                    <Stack
                                        spacing={2}
                                        direction='row'>
                                        <TextField
                                            size='small'
                                            label='Email'
                                            value={email}
                                            autoComplete='off'
                                            onChange={onChangeEmail}
                                            error={errorEmail}
                                            helperText={
                                                errorEmail ?
                                                    <Typography
                                                        variant="caption"
                                                        color='primary.main'
                                                        component="span">
                                                        Необходимо корректно заполнить электронную почту!
                                                    </Typography>
                                                    :
                                                    null
                                            }
                                        />
                                    </Stack>
                                    <Stack
                                        spacing={2}
                                        direction='row'>
                                        <Button
                                            size='small'
                                            variant="contained"
                                            onClick={saveEdit}
                                            startIcon={<Done/>}>
                                            Сохранить изменения
                                        </Button>
                                    </Stack>
                                </Stack>
                                :
                                <>
                                    <Stack
                                        spacing={1}
                                        direction='row'
                                        alignItems='center'>
                                        <Person color='secondary'/>
                                        <Tooltip title='Имя пользователя'>
                                            <Stack direction={{xs: 'column',sm: 'row', md: 'row'}} spacing={1}>
                                                <Typography
                                                    color='secondary.main'
                                                    variant='h5'>
                                                    Имя пользователя:
                                                </Typography>
                                                <Typography
                                                    color='primary'
                                                    fontWeight={600}
                                                    variant='h5'>
                                                    {user.login}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                    <Stack
                                        spacing={1}
                                        direction='row'
                                        alignItems='center'>
                                        <Email color='secondary'/>
                                        <Tooltip title='Электронная почта'>
                                            <Stack direction={{xs: 'column',sm: 'row', md: 'row'}} spacing={1}>
                                                <Typography
                                                    color='secondary.main'
                                                    variant='h5'>
                                                    Электронная почта:
                                                </Typography>
                                                <Typography
                                                    color='primary'
                                                    fontWeight={600}
                                                    variant='h5'>
                                                    {user.email}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                    <Stack
                                        spacing={1}
                                        direction='row'
                                        alignItems='center'>
                                        <PersonAdd color='secondary'/>
                                        <Tooltip title='Дата создания профиля'>
                                            <Stack direction={{xs: 'column',sm: 'row', md: 'row'}} spacing={1}>
                                                <Typography
                                                    color='secondary.main'
                                                    variant='h5'>
                                                    Профиль создан:
                                                </Typography>
                                                <Typography
                                                    color='primary'
                                                    fontWeight={600}
                                                    variant='h5'>
                                                    {new Date(user.createdAt).toLocaleDateString('ru')}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                    <Stack
                                        spacing={1}
                                        direction='row'
                                        alignItems='center'>
                                        <DateRange color='secondary'/>
                                        <Tooltip title='Количество проведенных дней с момента создания'>
                                            <Stack
                                                direction={{xs: 'column',sm: 'row', md: 'row'}}
                                                spacing={1}>
                                                <Typography
                                                    color='secondary.main'
                                                    variant='h5'>
                                                    Количество проведенных дней:
                                                </Typography>
                                                <Typography
                                                    color='primary'
                                                    fontWeight={600}
                                                    variant='h5'>
                                                    {differenceInCalendarDays(new Date(), new Date(user.createdAt))}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                </>
                        }
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack>
                    <Typography
                        variant='h4'
                        fontWeight={600}
                        color='secondary'>
                        Статистика профиля
                    </Typography>
                    <Divider/>
                    <Grid container
                          direction={{xs: 'column-reverse',sm: 'column-reverse', md: 'row'}}
                          spacing={1}
                          p={2}
                          justifyContent='center'
                          alignItems='center'>
                        {
                            stat.userStat ?
                                <>
                                    <Grid item xs={6}>
                                        <VictoryPie
                                            labels={({datum}) => datum.y}
                                            style={{
                                                data: {
                                                    fillOpacity: 0.9, stroke: "#456c7a", strokeWidth: 0.5
                                                },
                                                labels: {
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    fill: "#395A66"
                                                }
                                            }}
                                            colorScale={["rgb(51,147,56)", "#FE4F5A", "#3a8eab"]}
                                            height={280}
                                            data={[
                                                {x: 1, y: stat.userStat.complete},
                                                {x: 2, y: stat.userStat.fails},
                                                {
                                                    x: 3,
                                                    y: stat.userStat.all - (stat.userStat.complete + stat.userStat.fails)
                                                }
                                            ]}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Stack
                                                spacing={1}
                                                direction='row'
                                                pb={1}
                                                alignItems='center'>
                                                <AssignmentTurnedIn color='secondary'/>
                                                <Tooltip title='Всего создано задач'>
                                                    <Stack direction='row' spacing={1}>
                                                        <Typography
                                                            color='secondary.main'
                                                            variant='h5'>
                                                            Всего создано задач:
                                                        </Typography>
                                                        <Typography
                                                            color='primary'
                                                            fontWeight={600}
                                                            variant='h5'>
                                                            {stat.userStat.all}
                                                        </Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                            <Stack
                                                spacing={1}
                                                direction='row'
                                                alignItems='center'>
                                                <Circle sx={{color: 'rgb(51,147,56)'}}/>
                                                <Tooltip title='Всего выполенно задач'>
                                                    <Stack direction='row' spacing={1}>
                                                        <Typography
                                                            color='secondary.main'
                                                            variant='h5'>
                                                            Всего выполенно задач:
                                                        </Typography>
                                                        <Typography
                                                            color='primary'
                                                            fontWeight={600}
                                                            variant='h5'>
                                                            {stat.userStat.complete}
                                                        </Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                            <Stack
                                                spacing={1}
                                                direction='row'
                                                alignItems='center'>
                                                <Circle sx={{color: '#FE4F5A'}}/>
                                                <Tooltip title='Всего пропущено задач'>
                                                    <Stack direction='row' spacing={1}>
                                                        <Typography
                                                            color='secondary.main'
                                                            variant='h5'>
                                                            Всего пропущено задач:
                                                        </Typography>
                                                        <Typography
                                                            color='primary'
                                                            fontWeight={600}
                                                            variant='h5'>
                                                            {stat.userStat.fails}
                                                        </Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                            <Stack
                                                spacing={1}
                                                direction='row'
                                                alignItems='center'>
                                                <Circle sx={{color: '#3a8eab'}}/>
                                                <Tooltip title=' Остальные задач'>
                                                    <Stack direction='row' spacing={1}>
                                                        <Typography
                                                            color='secondary.main'
                                                            variant='h5'>
                                                            Остальные задачи:
                                                        </Typography>
                                                        <Typography
                                                            color='primary'
                                                            fontWeight={600}
                                                            variant='h5'>
                                                            {stat.userStat.all - (stat.userStat.complete + stat.userStat.fails)}
                                                        </Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </>
                                :
                                <Stack
                                    m={1}
                                    spacing={2}>
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                        color='secondary'
                                        component='p'>
                                        Работайте, статистика появится позже!
                                    </Typography>
                                    <Image
                                        src={statImage}
                                        alt='Image about list'
                                        placeholder='blur'
                                        width={500}
                                        height={333}
                                    />
                                </Stack>
                        }
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default ProfileContent;