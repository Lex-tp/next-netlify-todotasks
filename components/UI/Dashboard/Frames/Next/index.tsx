import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"
import ruLocale from '@fullcalendar/core/locales/ru';;
import {
    doneTask,
    fetchAddTagForTask,
    fetchAddTask,
    getAllTasks, incFailStatUser,
    removeTask, updatePriorityTask
} from "../../../../../store/services/ActionCreator";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import {
    Box, Chip,
    IconButton,
    Popover,
    Stack,
    SvgIcon, Tooltip,
    Typography
} from "@mui/material";
import {ITask} from "../../../../../store/types/ITask";
import ModalTask from "../../Items/Task/modules/ModalTask";
import {Edit, Delete, OpenInNew, RemoveCircle, CheckCircle, ContentCopy, PriorityHigh} from "@mui/icons-material";
import AlertDialog from "../../../AlertDialog";
import {useSnackbar} from "notistack";
import ModalEdit from "./modules/ModalEdit";
import AddItem from "../../Items/components/AddItem";
import {endOfDay, subMinutes} from "date-fns";
import {useAppSelector} from "../../../../../store/redux";
import {useRouter} from "next/router";

const NextFrame = () => {
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [tasks, setTasks] = useState<Array<ITask>>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectTask, setSelectTask] = useState<ITask>();
    const [addModal, setAddModal] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const {enqueueSnackbar} = useSnackbar();
    const [onlyTerm, setOnlyTerm] = React.useState(false);
    const { sortType, user} = useAppSelector(state => state.user);

    const handlePopoverOpen = (element: HTMLElement) => {
        if(element.parentElement) {
            setAnchorEl(element.parentElement.parentElement);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(()=>{
        renderTasks();
    },[]);

    const handleOpenModal = () => {
        setOpenModal(true);
        handlePopoverClose();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            renderTasks();
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = () => {
        if(selectTask) {
            dispatch(fetchAddTask({title: selectTask.title, description: selectTask.description, term: selectTask.term}))
                .unwrap()
                .then((data: ITask) => {
                    selectTask.task_tags.forEach((tag) => {
                        dispatch(fetchAddTagForTask({taskId: data.id, tagId: tag.tagId}))
                            .unwrap()
                            .then(() => {
                                renderTasks();
                            });
                    });
                })
                .finally(() => {
                    renderTasks();
                    enqueueSnackbar(`???????????? ?????????????? ??????????????????????!`, {variant: "success"});
                });
            handlePopoverClose();
        }

    }

    const handlerDialogAgree = () => {
        setOpenDialog(false);
        handlePopoverClose();
        dispatch(removeTask({id: selectTask!.id})).then(() => {
            setOpenDialog(false);
            enqueueSnackbar(`???????????? ?????????????? ??????????????!`, {variant: "success"});
            renderTasks();
        });
    }

    const renderTasks = () => {
        dispatch(getAllTasks({sort: sortType})).then((data) => {
            if (data.payload) {
                setTasks([...data.payload]);
                dispatch(incFailStatUser({
                    userId: parseInt(user.userId),
                    count: [...data.payload].filter(element => new Date(element.term) < new Date() && !element.done).length
                }))
            }
        });
    }

    const handlerDialogDisagree = () => {
        setOpenDialog(false);
    }

    const handleDeleteTask = () => {
        setOpenDialog(true);
    }

    const editTask = () => {
        setOpenModalEdit(true);
        setOnlyTerm(false);
    }

    const handleAddDoneStatus = () => {
        doneStatusTask(true);
    }

    const handleRemoveDoneStatus = () => {
        doneStatusTask(false);
    }

    const doneStatusTask = (done: boolean) => {
        if(selectTask) {
            dispatch(doneTask({id: selectTask.id, done})).then(() => {
                if(done) {
                    enqueueSnackbar(`???????????? ???????????????????? ?? ?????????????????? "?????????????????????? ??????????"`, {variant: "success"});
                }else {
                    enqueueSnackbar(`???????????? ?????????????? ???? ?????????????????? "?????????????????????? ??????????"`, {variant: "warning"});
                }
                renderTasks();
                handlePopoverClose();
            });
        }
    }

    const handleAddPriority = () => {
        if(selectTask) {
            dispatch(updatePriorityTask({id: selectTask.id, priority: !selectTask.priority})).then(()=> {
                renderTasks();
                handlePopoverClose();
            });
        }
    };

    const sliceLongText = (text: string) => {
        return text.length > 20 ? text.slice(0, 20).concat('...') : text;
    }

    return (
        <Box height='calc(100vh - 180px)'>
            <AddItem
                title='???????????????? ????????????'
                OnClick={()=>{
                    setOpenModalEdit(true);
                    setAddModal(true);
                }}/>
            <FullCalendar
                editable
                eventDrop={(info)=>{
                    if(new Date(info.event.start!.toISOString())>=new Date()) {
                        setOnlyTerm(true);
                        setSelectTask({
                            ...tasks.filter((task) => task.id === parseInt(info.event.id))[0],
                            term: info.event.start?.toISOString()
                        } as ITask);
                        setOpenModalEdit(true);
                    }else {
                        renderTasks();
                        enqueueSnackbar(`???????????? ?????????????????? ???????? ???????????? ???????????????? ??????"`, {variant: "warning"});
                    }
                }}
                nextDayThreshold={'1:00:00'}
                height='100%'
                events={
                    tasks.map((task)=>{
                        return {
                            id: task.id.toString(),
                            title: task.title,
                            start: task.term,
                            end: endOfDay(new Date(task.term)),
                            color: new Date(task.term) < new Date() && !task.done ? '#d32f2f' : task.done ? '#398f3c': '#FE4F5A',
                            display: 'block',
                        }
                    })
                }
                eventClick={(info)=>{
                    info.jsEvent.preventDefault();
                    handlePopoverOpen(info.el);
                    setSelectTask(tasks.filter((task)=>task.id === parseInt(info.event.id))[0]);
                    setAddModal(false);
                }}
                customButtons={{
                    helpButton: {
                        text: '??????????????',
                        click:()=> {router.push('/reference')}
                    }
                }}
                headerToolbar={
                    {
                        start: 'today',
                        center: 'title',
                        end: 'prev,next,helpButton'
                    }
                }
                titleFormat={
                    { year: 'numeric', month: 'long', day: 'numeric' }
                }
                locale={ruLocale}
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
            />
            <AlertDialog
                open={openDialog}
                title="???????????????? ????????????"
                text="?????????????????????? ???????????????? ????????????"
                onAgree={handlerDialogAgree}
                onDisagree={handlerDialogDisagree}/>
            <ModalTask
                open={openModal}
                task={selectTask ? selectTask : {} as ITask}
                onClose={() => {
                    setOpenModal(false);
                }}
                tabName='????????????'/>
            <ModalEdit
                addMethod={addModal}
                open={openModalEdit}
                onlyTerm={onlyTerm}
                task={!addModal ? selectTask? selectTask: {} as ITask : {} as ITask}
                onClose={() => {
                    setOpenModalEdit(false);
                    handlePopoverClose();
                }}
                onChange={()=>{
                    renderTasks();
                }}
                tabName='????????????????????????????'/>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}>
                <Stack py={1} px={2}>
                    <Stack spacing={0.5}>
                        <Stack
                            spacing={1}
                            alignItems='center'
                            justifyContent='space-between'
                            direction='row'>
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                color='secondary'
                                noWrap>
                                {selectTask ? sliceLongText(selectTask.title): ''}
                            </Typography>
                            <Stack direction='row'>
                                {
                                    selectTask?.priority ?
                                        <Tooltip
                                            title='?????????? ????????????????????'>
                                            <PriorityHigh
                                                sx={{color: '#E12B15'}}/>
                                        </Tooltip>
                                        :
                                        null
                                }
                                <Tooltip title='???????? ????????????????'>
                                    <Typography
                                        variant="caption"
                                        color='secondary'
                                        noWrap>
                                        {selectTask ? new Date(selectTask.dateCreate).toLocaleDateString('ru-RU'): ''}
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Typography
                            variant="subtitle2"
                            color='secondary'
                            noWrap>
                            {selectTask ? sliceLongText(selectTask.description): ''}
                        </Typography>
                        <Chip
                            color={selectTask?.done ? 'success' : 'error'}
                            size='small'
                            label={selectTask?.done ? '??????????????????' : '???? ??????????????????'}/>
                    </Stack>
                    <Stack
                        m={0.5}
                        justifyContent='center'
                        direction='row'>
                        {
                            [
                                {
                                    icon:  selectTask?.done ? RemoveCircle : CheckCircle,
                                    title: selectTask?.done ? '?????????? ?????????? ?? ????????????????????' : '???????????????? ?? ????????????????????',
                                    handle: selectTask?.done ? handleRemoveDoneStatus : handleAddDoneStatus
                                },
                                {icon: Edit, title: '??????????????????????????', handle: editTask},
                                {icon: OpenInNew, title: '?????????????????? ?? ????????????', handle: handleOpenModal},
                                {icon: PriorityHigh, title: selectTask?.priority ? '???????????? ??????????????????':'???????????????? ??????????????????', handle: handleAddPriority},
                                {icon: ContentCopy, title: '??????????????????????', handle: handleCopy},
                                {icon: Delete, title: '??????????????', handle: handleDeleteTask},
                            ].map((element, index) => {
                                return (
                                    <React.Fragment key={index}>
                                    <Tooltip title={element.title}>
                                        <IconButton onClick={element.handle}>
                                            {
                                                <SvgIcon
                                                    color='secondary'
                                                    component={element.icon}
                                                />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    </React.Fragment>
                                );
                            })
                        }
                    </Stack>
                </Stack>
            </Popover>
        </Box>
    );
};

export default NextFrame;