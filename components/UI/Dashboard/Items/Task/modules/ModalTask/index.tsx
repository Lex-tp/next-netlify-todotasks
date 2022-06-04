import React, {useEffect, useState} from 'react';
import {
    Box,
    Checkbox,
    Divider,
    Fade,
    IconButton,
    Modal,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {Description, Close, CalendarToday, Timer} from '@mui/icons-material';
import {ITask} from "../../../../../../../store/types/ITask";
import Tag from "../Tag";
import styles from './ModalTask.module.scss';
import CommentsList from "../../../../../CommentsList";
import Comment from "../../../../../CommentsList/Comment";
import {useAppSelector} from "../../../../../../../store/redux";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../../store";
import {getAllComments, removeComment} from "../../../../../../../store/services/ActionCreator";
import Image from "next/image";
import commentsImage from "../../../../../../../public/static/comments.png";
import AlertDialog from "../../../../../AlertDialog";
import {useSnackbar} from "notistack";
import LoaderContent from "../../../../../LoaderContent";
import {style} from "../../../settings/style/ModalWindow";

interface ModalTaskProps {
    open: boolean,
    tabName: string,

    onClose(): void,

    task: ITask
}

const ModalTask = (props: ModalTaskProps) => {
    const [selectComment, setSelectComment] = useState(0);
    const {commentsForTask} = useAppSelector(state => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const handlerDialogAgree = () => {
        setOpenDialog(false);
        dispatch(removeComment({commentId: selectComment})).then(() => {
            dispatch(getAllComments({taskId: props.task.id}));
            enqueueSnackbar(`Заметка успешно удалена!`, {variant: "success"});
        })
    }

    const handlerDialogDisagree = () => {
        setOpenDialog(false);
    }

    useEffect(() => {
        setLoading(true);
        if (props.task.id) {
            dispatch(getAllComments({taskId: props.task.id})).then(() => {
                setLoading(false);
            })
        }
    }, [props.task]);

    return (
        <>
            <Modal
                open={props.open}
                onClose={() => {
                    props.onClose();
                }}
                closeAfterTransition>
                <Fade in={props.open}>
                    <Box sx={style}>
                        <Stack
                            spacing={1}
                            direction='column'>
                            <Stack
                                direction='row'
                                justifyContent='space-between'>
                                <Stack
                                    className={styles.modal_title}
                                    alignItems='center'
                                    spacing={1}
                                    direction='row'>
                                    <Description color='primary'/>
                                    <Typography
                                        variant="h6"
                                        component="h2">
                                        {props.tabName}
                                    </Typography>
                                </Stack>
                                <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                        props.onClose();
                                    }}>
                                    <Close/>
                                </IconButton>
                            </Stack>
                            <Divider/>
                            <Stack
                                width='100%'
                                direction='row'
                                alignItems='flex-start'>
                                <Checkbox checked={props.task.done}/>
                                <Stack
                                    width='100%'
                                    spacing={1}
                                    direction='column'>
                                    <Typography
                                        sx={{overflowWrap: 'anywhere'}}
                                        variant="h5"
                                        fontWeight={600}
                                        my={0.5}
                                        component="h2">
                                        {props.task.title}
                                    </Typography>
                                    <Typography
                                        sx={{overflowWrap: 'anywhere'}}
                                        variant="h6"
                                        color='secondary'
                                        component='p'>
                                        {props.task.description}
                                    </Typography>
                                    <Stack
                                        spacing={1}
                                        direction='row'
                                        alignItems='center'>
                                        {
                                            props.task.task_tags?.map((item) => {
                                                return <Tag key={item.tagId} titleTag={item.tagData.title}
                                                            colorMain={item.tagData.color}/>
                                            })
                                        }
                                    </Stack>
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        spacing={1}>
                                        <Tooltip title='Дата создания'>
                                            <Stack
                                                className={styles.modal_tags}
                                                direction='row'
                                                spacing={0.5}>
                                                <CalendarToday
                                                    color='secondary'
                                                    fontSize='small'/>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={600}
                                                    color='secondary'
                                                    component='span'>
                                                    {new Date(props.task.dateCreate).toLocaleDateString('ru-RU')}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                        <Tooltip title='Срок выполнения'>
                                            <Stack
                                                className={styles.modal_tags}
                                                direction='row'
                                                spacing={0.5}>
                                                <Timer
                                                    color={new Date(props.task.term) < new Date() && !props.task.done ? 'error' : props.task.done ? 'success' : 'primary'}
                                                    fontSize='small'/>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={600}
                                                    color={new Date(props.task.term) < new Date() && !props.task.done ? 'error' : props.task.done ? 'success' : 'primary'}
                                                    component='span'>
                                                    {new Date(props.task.term).toLocaleString('ru-RU', {dateStyle: 'short', timeStyle: 'short'})}
                                                </Typography>
                                            </Stack>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack
                                className={styles.control_panel}
                                direction='row'
                                justifyContent='end'
                                alignItems='center'>

                            </Stack>
                            <Divider/>
                            <Stack
                                sx={{width: '100%'}}>
                                <Typography
                                    p={1}
                                    pb={1.5}
                                    color='primary'
                                    textTransform='uppercase'
                                    variant='subtitle2'>
                                    {`Заметки (${commentsForTask.length})`}
                                </Typography>
                                <Divider/>
                                <CommentsList taskId={props.task.id}>
                                    <LoaderContent isLoading={isLoading}>
                                        {
                                            commentsForTask.length > 0 ?
                                                commentsForTask.map((comment, index) => {
                                                    return (<Comment
                                                        key={index}
                                                        text={comment.text}
                                                        file={comment.file}
                                                        onDelete={() => {
                                                            setSelectComment(comment.id)
                                                            setOpenDialog(true);
                                                        }}
                                                        dateCreate={new Date(comment.dateCreate).toLocaleString('ru-RU')}/>)
                                                })
                                                :
                                                <Stack
                                                    p={2}
                                                    alignItems='center'
                                                    spacing={2}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color='secondary.light'
                                                        component='p'>
                                                        Добавьте сюда примечания, ссылки, файлы.
                                                    </Typography>
                                                    <Image
                                                        src={commentsImage}
                                                        alt='Image about comments'
                                                        placeholder='blur'
                                                        width={100}
                                                        height={100}
                                                    />
                                                </Stack>
                                        }
                                    </LoaderContent>
                                </CommentsList>
                            </Stack>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
            <AlertDialog
                open={openDialog}
                title="Удаление комментария"
                text="Подтвердите удаление комментария"
                onAgree={handlerDialogAgree}
                onDisagree={handlerDialogDisagree}/>
        </>
    );
};

export default ModalTask;