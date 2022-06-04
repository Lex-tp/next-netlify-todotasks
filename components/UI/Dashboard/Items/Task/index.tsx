import React, {useEffect, useState} from 'react';
import {
    Checkbox,
    Chip,
    IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Popover,
    Stack, SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import styles from './Task.module.scss';
import {
    Edit,
    DateRange,
    MoreHoriz,
    Delete,
    CheckCircle,
    PriorityHigh,
    ContentCopy, RemoveCircle, Timer, Article, AccessTimeFilled
} from '@mui/icons-material';
import {ITask} from "../../../../../store/types/ITask";
import EditTask from "./modules/EditTask";
import Tag from "./modules/Tag";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import {
    doneTask,
    fetchAddTagForTask,
    fetchAddTask, updatePriorityTask,
    updateTask
} from "../../../../../store/services/ActionCreator";
import {ITag} from "../../../../../store/types/ITag";
import {useSnackbar} from "notistack";

interface TaskProps {
    content: ITask,

    onDelete(): void,

    onChangeTask(): void,

    onOpenModal(): void
}

const Task = (props: TaskProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [taskContent, setTaskContent] = useState<ITask>({
        dateCreate: "",
        description: "",
        done: false,
        task_tags: [],
        id: 0,
        term: "",
        title: "",
        task_comments: [],
        priority: false
    });
    const [editMode, setEditMode] = useState(false);
    const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
    const openMenuMore = Boolean(anchorElMore);
    const {enqueueSnackbar} = useSnackbar();
    const [checked, setChecked] = React.useState(false);
    const [onlyTerm, setOnlyTerm] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        doneStatusTask(event.target.checked);
    };

    const handleRemoveDoneStatus = () => {
        setChecked(false);
        doneStatusTask(false);
    };

    const handleAddPriority = () => {
        dispatch(updatePriorityTask({id: taskContent.id, priority: !props.content.priority})).then(()=> {
            props.onChangeTask();
            if (!props.content.priority) {
                enqueueSnackbar(`Задача отмечена знаком приоритета`, {variant: "info"});
            } else {
                enqueueSnackbar(`С задачи снят знак приоритета`, {variant: "info"});
            }
        });
    };

    const handleAddDoneStatus = () => {
        setChecked(true);
        doneStatusTask(true);
    };

    const doneStatusTask = (done: boolean) => {
        dispatch(doneTask({id: props.content.id, done})).then(() => {
            props.onChangeTask();
            if (done) {
                enqueueSnackbar(`Задача перемещена в категорию "Выполненных задач"`, {variant: "success"});
            } else {
                enqueueSnackbar(`Задача удалена из категории "Выполненных задач"`, {variant: "warning"});
            }
        });
    }

    const handleCloseMore = () => {
        setAnchorElMore(null);
    };

    const handlerDelete = () => {
        props.onDelete();
    }

    const handlerDuplicate = () => {
        dispatch(fetchAddTask({title: props.content.title, description: props.content.description, term: props.content.term}))
            .unwrap()
            .then((data: ITask) => {
                props.content.task_tags.forEach((tag) => {
                    dispatch(fetchAddTagForTask({taskId: data.id, tagId: tag.tagId}))
                        .unwrap()
                        .then(() => {
                            props.onChangeTask();
                        });
                });
            })
            .finally(() => {
                props.onChangeTask();
                enqueueSnackbar(`Задача успешно дублирована!`, {variant: "success"});
            });
    }

    const handleClickMore = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElMore(event.currentTarget);
    };

    const handlerEdit = () => {
        setEditMode(!editMode);
    }

    const handlerSuccessEdit = (title: string, description: string, term: string, tags: Array<ITag>) => {
        dispatch(updateTask({id: taskContent.id, title, description, term}))
            .unwrap()
            .then(() => {
                if(tags.length>0) {
                    tags.forEach((tag) => {
                        dispatch(fetchAddTagForTask({taskId: taskContent.id, tagId: tag.id}))
                            .unwrap()
                            .then(() => {
                                props.onChangeTask();
                                setEditMode(false);
                                setOnlyTerm(false);
                            });
                    });
                }else {
                    props.onChangeTask();
                    setEditMode(false);
                    setOnlyTerm(false);
                }
            });
    }

    const handlerCancelEdit = () => {
        setEditMode(!editMode);
        setOnlyTerm(false);
    }

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            setChecked(props.content.done);
            setTaskContent({...props.content});
        }
        return () => {
            unmounted = true
        };
    }, []);

    return (
        <Stack>
            {
                editMode ?
                    <EditTask
                        label='Редактирование'
                        title={taskContent.title}
                        content={taskContent.description}
                        selectTags={taskContent.task_tags}
                        term={taskContent.term}
                        onlyTerm={onlyTerm}
                        handlerSuccess={(title, description, term, tags: Array<ITag>) => {
                            handlerSuccessEdit(title, description, term, tags);
                        }}
                        handlerCancel={handlerCancelEdit}/>
                    :
                    <Stack
                        className={styles.static_task}
                        direction='row'
                        justifyContent='space-between'
                        minWidth={0}
                        spacing={1}
                        data-task-clicked={true}
                        onClick={(e) => {
                            if ((e.target as HTMLElement).getAttribute('data-task-clicked')) {
                                props.onOpenModal();
                            }
                        }}>
                        <Tooltip
                            title='Отметка выполнения'>
                            <Checkbox checked={checked} onChange={handleChange}/>
                        </Tooltip>
                        <Stack
                            data-task-clicked={true}
                            minWidth={0}
                            className={styles.task_content}>
                            <Stack
                                data-task-clicked={true}
                                direction='row'
                                justifyContent='space-between'
                                spacing={2}
                                alignItems='center'>
                                <Tooltip
                                    title={taskContent.title}>
                                    <Typography
                                        data-task-clicked={true}
                                        variant="h6"
                                        color='secondary.dark'
                                        textOverflow='ellipsis'
                                        noWrap
                                        component='h2'>
                                        {taskContent.title}
                                    </Typography>
                                </Tooltip>
                                <Tooltip
                                    title='Срок для выполнения'>
                                    <Chip
                                        color={new Date(taskContent.term) < new Date() && !taskContent.done ? 'error' : taskContent.done ? 'success' : 'primary'}
                                        size="small"
                                        icon={<Timer sx={{
                                            color: '#FE4F5A'
                                        }}/>}
                                        label={
                                            <Typography
                                                fontWeight={600}
                                                variant='subtitle2'>
                                                {new Date(taskContent.term).toLocaleString('ru-RU', {dateStyle: 'short', timeStyle: 'short'})}
                                            </Typography>
                                        }/>
                                </Tooltip>
                            </Stack>
                            <Typography
                                data-task-clicked={true}
                                variant="subtitle1"
                                color='secondary'
                                textOverflow='ellipsis'
                                noWrap
                                component='p'>
                                {taskContent.description}
                            </Typography>
                            <Stack
                                data-task-clicked={true}
                                justifyContent='space-between'
                                direction='row'>
                                <Stack
                                    data-task-clicked={true}
                                    flexWrap='wrap'
                                    gap={1}
                                    direction='row'
                                    my={0.5}
                                    alignItems='center'>
                                    {
                                        taskContent.task_tags?.map((item) => {
                                            return <Tag key={item.tagId} titleTag={item.tagData.title}
                                                        colorMain={item.tagData.color}/>
                                        })
                                    }
                                </Stack>
                                <Stack
                                    spacing={1.5}
                                    alignItems='center'
                                    direction='row'>
                                    {
                                        props.content.priority ?
                                            <Tooltip
                                                title='Метка приоритета'>
                                                <PriorityHigh
                                                    sx={{color: '#E12B15'}}/>
                                            </Tooltip>
                                            :
                                            null
                                    }
                                    <Tooltip
                                        title='Количество заметок'>
                                        <Stack
                                            alignItems='center'
                                            spacing={0.5}
                                            direction='row'>
                                            <Article
                                                sx={{
                                                    color: 'rgba(69,108,122,0.75)'
                                                }}/>
                                            <Typography
                                                color='secondary'
                                                fontWeight={600}
                                                variant='subtitle2'>
                                                {taskContent.task_comments?.length}
                                            </Typography>
                                        </Stack>
                                    </Tooltip>
                                    <Tooltip
                                        title='Дата создания'>
                                        <Stack
                                            alignItems='center'
                                            spacing={0.5}
                                            direction='row'>
                                            <AccessTimeFilled
                                                sx={{
                                                    color: 'rgba(69,108,122,0.75)'
                                                }}/>
                                            <Typography
                                                color='secondary'
                                                fontWeight={600}
                                                variant='subtitle2'>
                                                {new Date(taskContent.dateCreate).toLocaleDateString('ru-RU')}
                                            </Typography>
                                        </Stack>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                        </Stack>
                        {
                            new Date(taskContent.term) < new Date() && !taskContent.done ?
                                <>
                                    <Tooltip title='Редактировать'>
                                        <IconButton
                                            color='secondary'
                                            onClick={handlerEdit}>
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Переназначить срок'>
                                        <IconButton color='secondary' onClick={() => {
                                            setOnlyTerm(true);
                                            setEditMode(!editMode);
                                        }}>
                                            <DateRange/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Дополнительно'>
                                        <IconButton
                                            color='secondary'
                                            onClick={handleClickMore}>
                                            <MoreHoriz/>
                                        </IconButton>
                                    </Tooltip>
                                    <Popover
                                        open={openMenuMore}
                                        anchorEl={anchorElMore}
                                        onClose={handleCloseMore}
                                        anchorOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'right',
                                        }}>
                                        <MenuList>
                                            {
                                                [
                                                    {
                                                        icon: CheckCircle,
                                                        color: '#26BB2F',
                                                        title: 'Отметить как выполненное',
                                                        click: handleAddDoneStatus
                                                    },
                                                    {
                                                        icon: Article,
                                                        color: '#0c99c0',
                                                        title: 'Добавить заметку',
                                                        click: props.onOpenModal
                                                    },
                                                    {icon: PriorityHigh, color: '#E12B15', title: props.content.priority ? 'Убрать приоритет':'Добавить приоритет', click: handleAddPriority},
                                                    {
                                                        icon: ContentCopy,
                                                        title: 'Дублировать',
                                                        click: handlerDuplicate
                                                    },
                                                    {icon: Delete, title: 'Удалить', click: handlerDelete},
                                                ].map((element, index) => {
                                                    return (
                                                        <MenuItem key={index} onClick={element.click}>
                                                            <ListItemIcon>
                                                                {
                                                                    <SvgIcon
                                                                        sx={{color: `${element.color}`}}
                                                                        color='secondary'
                                                                        component={element.icon}
                                                                    />
                                                                }
                                                            </ListItemIcon>
                                                            <ListItemText>{element.title}</ListItemText>
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </MenuList>
                                    </Popover>
                                </>
                                :
                                taskContent.done ?
                                    <>
                                        <Tooltip title='Добавить заметку'>
                                            <IconButton
                                                color='secondary'
                                                onClick={props.onOpenModal}>
                                                <Article/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Снять отметку о выполнении'>
                                            <IconButton
                                                color='secondary'
                                                onClick={handleRemoveDoneStatus}>
                                                <RemoveCircle/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Удалить'>
                                            <IconButton
                                                color='secondary'
                                                onClick={handlerDelete}>
                                                <Delete/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                    :
                                    <>
                                        <Tooltip title='Редактировать'>
                                            <IconButton
                                                color='secondary'
                                                onClick={handlerEdit}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Переназначить срок'>
                                            <IconButton color='secondary' onClick={() => {
                                                setOnlyTerm(true);
                                                setEditMode(!editMode);
                                            }}>
                                                <DateRange/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Дополнительно'>
                                            <IconButton
                                                color='secondary'
                                                onClick={handleClickMore}>
                                                <MoreHoriz/>
                                            </IconButton>
                                        </Tooltip>
                                        <Popover
                                            open={openMenuMore}
                                            anchorEl={anchorElMore}
                                            onClose={handleCloseMore}
                                            anchorOrigin={{
                                                vertical: 'center',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'center',
                                                horizontal: 'right',
                                            }}>
                                            <MenuList>
                                                {
                                                    [
                                                        {
                                                            icon: CheckCircle,
                                                            color: '#26BB2F',
                                                            title: 'Отметить как выполненное',
                                                            click: handleAddDoneStatus
                                                        },
                                                        {
                                                            icon: Article,
                                                            color: '#0c99c0',
                                                            title: 'Добавить заметку',
                                                            click: props.onOpenModal
                                                        },
                                                        {icon: PriorityHigh, color: '#E12B15', title: props.content.priority ? 'Убрать приоритет':'Добавить приоритет', click: handleAddPriority},
                                                        {
                                                            icon: ContentCopy,
                                                            title: 'Дублировать',
                                                            click: handlerDuplicate
                                                        },
                                                        {icon: Delete, title: 'Удалить', click: handlerDelete},
                                                    ].map((element, index) => {
                                                        return (
                                                            <MenuItem key={index} onClick={element.click}>
                                                                <ListItemIcon>
                                                                    {
                                                                        <SvgIcon
                                                                            sx={{color: `${element.color}`}}
                                                                            color='secondary'
                                                                            component={element.icon}
                                                                        />
                                                                    }
                                                                </ListItemIcon>
                                                                <ListItemText>{element.title}</ListItemText>
                                                            </MenuItem>
                                                        );
                                                    })
                                                }
                                            </MenuList>
                                        </Popover>
                                    </>
                        }
                    </Stack>
            }
        </Stack>
    );
};

export default Task;