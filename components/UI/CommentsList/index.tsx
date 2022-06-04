import React, {useEffect, useState} from 'react';
import {
    Button,
    Chip,
    IconButton,
    List,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {AttachFile, Mic} from '@mui/icons-material';
import styles from './CommentsList.module.scss';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {fetchAddCommentForTask, getAllComments} from "../../../store/services/ActionCreator";
import {useAppSelector} from "../../../store/redux";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import validator from "validator";
import {useSnackbar} from "notistack";
import {IComment} from "../../../store/types/IComment";

interface CommentsListProps {
    taskId: number,
    children?: React.ReactNode;
}

const Input = styled('input')({
    display: 'none',
});

const CommentsList = (props: CommentsListProps) => {
    const [commentText, setCommentText] = useState('');
    const [limitLetter, setLimitLetter] = useState(false);
    const [error, setError] = useState(false);
    const [file, setFile] = useState({} as File);
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useAppSelector(state => state.user);
    const { transcript, listening } = useSpeechRecognition();
    const {enqueueSnackbar} = useSnackbar();

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 255) {
            setCommentText(event.target && event.target.value);
            if (limitLetter) {
                setLimitLetter(false);
            }
            if (error) {
                setError(false);
            }
        }
    }

    useEffect(()=>{
        if(commentText.length>255) {
            setLimitLetter(true);
        }
    },[commentText]);

    useEffect(()=>{
        if(!listening) {
            setCommentText(prevState => `${prevState} ${transcript}`.trimStart());
        }
    },[listening]);

    const sendFile = async () => {
        if(file.name) {
            const data = new FormData();
            data.append('file', file);
            return await axios.post('http://localhost:3001/file/upload', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
        }
    }

    const listenMic = () => {
        if(!SpeechRecognition.browserSupportsSpeechRecognition()) {
            enqueueSnackbar(`Упс... Браузер не поддерживает голосовой ввод!`, {variant: "warning"});
        }else {
            if(listening) {
                SpeechRecognition.stopListening();
            }else {
                SpeechRecognition.startListening();
            }
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(commentText.length <= 255) {
            if (!validator.isEmpty(commentText,{ ignore_whitespace: true }) || file.name) {
                sendFile().then((res) => {
                        dispatch(fetchAddCommentForTask({
                            text: commentText,
                            file: res ? res.data.body.filename : '',
                            taskId: props.taskId,
                            userId: parseInt(user.userId)
                        }))
                            .then(() => {
                                dispatch(getAllComments({taskId: props.taskId}));
                            });
                        setCommentText('');
                        setFile({} as File);
                }).catch(()=>{
                    enqueueSnackbar(`Неверный файл либо превышен размер. Попробуйте еще раз!`, {variant: "error"});
                });
            } else {
                setError(true);
            }
        }else {
            setError(true);
        }
    }

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.currentTarget as HTMLInputElement;
        if (event.target.files && event.target.files.length > 0) {
            const file = target.files![0];
            setFile(file);
        }
    }

    return (
        <Stack
            direction='column'
            spacing={1}>
            <List sx={{
                color: 'secondary.main',
                maxHeight: '250px',
                overflowY: "scroll",
            }}>
                {props.children}
            </List>
            <form
                className={styles.comment_input_box}
                onSubmit={onSubmit}>
                <Stack
                    sx={{color: 'secondary.main'}}
                    spacing={1}
                    direction='column'>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={commentText}
                        autoComplete='off'
                        error={error}
                        helperText={
                            error ?
                                <Typography
                                    variant="caption"
                                    color='primary.main'
                                    component="span">
                                    Необходимо заполнить содержимое длинной до 255 символов или прикрепить файл!
                                </Typography>
                                :
                                null
                        }
                        onChange={onChangeText}
                        placeholder='Комментарий'/>
                    <Stack
                        justifyContent='space-between'
                        direction='row'>
                        <Stack
                            alignItems='center'
                            direction='row'>
                            <Tooltip title='Прикрепить файл'>
                                <label>
                                    <Input
                                        id='file-upload'
                                        accept=".doc,.docx,.xml,application/msword,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={onChangeFile}
                                        type="file"/>
                                    <IconButton component="span">
                                        <AttachFile color='secondary'/>
                                    </IconButton>
                                </label>
                            </Tooltip>
                            <Tooltip title='Включить диктовку'>
                                <IconButton onClick={listenMic}>
                                    <Mic color={listening ? 'primary' : 'secondary'}/>
                                </IconButton>
                            </Tooltip>
                            {
                                file.name ?
                                    <Tooltip title={file.name}>
                                        <Chip
                                            color='secondary'
                                            size='small'
                                            variant='outlined'
                                            icon={<AttachFile/>}
                                            label={<span>{file.name.slice(0,20).concat('...')}</span>}
                                            onDelete={() => {
                                                setFile({} as File)
                                            }}/>
                                    </Tooltip>
                                    :
                                    null
                            }
                        </Stack>
                        <Stack
                            spacing={2}
                            alignItems='center'
                            direction='row'>
                            <Typography
                                variant="subtitle2"
                                color={limitLetter ? 'primary' : 'secondary'}
                                component="span">
                                {`Количество символов:`} <b>{commentText.length}</b> / <b>255</b>
                            </Typography>
                            <Button
                                type='submit'
                                variant='contained'>
                                Прикрепить
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
};

export default CommentsList;