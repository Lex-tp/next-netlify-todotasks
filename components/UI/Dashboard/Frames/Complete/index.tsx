import React, {useEffect, useState} from 'react';
import {Box, Divider, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Title from "../Title";
import {Help, Reorder} from "@mui/icons-material";
import LoaderContent from "../../../LoaderContent";
import Task from "../../Items/Task";
import Image from "next/image";
import thinkImage from "../../../../../public/static/think.png";
import {ITask} from "../../../../../store/types/ITask";
import {getAllTasks, incFailStatUser, removeTask} from "../../../../../store/services/ActionCreator";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import ModalTask from "../../Items/Task/modules/ModalTask";
import AlertDialog from "../../../AlertDialog";
import {useSnackbar} from "notistack";
import SortButton from "../../../SortButton";
import {useAppSelector} from "../../../../../store/redux";
import {isToday} from "date-fns";
import {useRouter} from "next/router";

const CompleteFrame = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Array<ITask>>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectTask, setSelectTask] = useState<ITask>();
    const [openDialog, setOpenDialog] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();
    const { sortType,priorityOnly, tagsSort, user } = useAppSelector(state => state.user);

    useEffect(() => {
        let unmounted = false;
        renderTasks(unmounted);
        return () => {
            unmounted = true
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            renderTasks();
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    useEffect(()=> {
        renderTasks();
    },[sortType,priorityOnly, tagsSort]);

    function renderTasks(mounted?: boolean | null) {
        setLoading(true);
        dispatch(getAllTasks({sort: sortType})).then((data) => {
            if (!mounted) {
                if (data.payload) {
                    const commonArray = [...data.payload].filter(task => {
                        let result = false;
                        if(tagsSort.length>0) {
                            for(const tagTask of task.task_tags) {
                                if(!result) {
                                    for (const tag of tagsSort) {
                                        if (tag.id === tagTask.tagId) {
                                            result = true;
                                            break;
                                        }
                                    }
                                }else {
                                    break;
                                }
                            }
                            return result;
                        }
                        return true;
                    }).filter((task)=> {
                        return task.done && !task.priority;
                    });
                    const priorityArray = [...data.payload].filter(task => {
                        let result = false;
                        if(tagsSort.length>0) {
                            for(const tagTask of task.task_tags) {
                                if(!result) {
                                    for (const tag of tagsSort) {
                                        if (tag.id === tagTask.tagId) {
                                            result = true;
                                            break;
                                        }
                                    }
                                }else {
                                    break;
                                }
                            }
                            return result;
                        }
                        return true;
                    }).filter((task)=> {
                        return task.done && task.priority;
                    });
                    priorityOnly ? setTasks(priorityArray):
                        setTasks([...priorityArray, ...commonArray]);
                    setLoading(false);
                    dispatch(incFailStatUser({
                        userId: parseInt(user.userId),
                        count: [...data.payload].filter(element => new Date(element.term) < new Date() && !element.done).length
                    }))
                }
            }
        });
    }

    const handlerDialogAgree = () => {
        setOpenDialog(false);
        dispatch(removeTask({id: selectTask!.id})).then(() => {
            renderTasks();
            setOpenDialog(false);
            enqueueSnackbar(`Задача успешно удалена!`, {variant: "success"});
        });
    }

    const handlerDialogDisagree = () => {
        setOpenDialog(false);
    }

    return (
        <Stack spacing={1}>
            <Stack
                spacing={1}
                sx={{
                position: 'sticky',
                top: '65px',
                backgroundColor: '#ffffff',
                zIndex: '1'
            }}>
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Title text='Выполненные задачи'/>
                    <Stack
                        spacing={1}
                        direction='row'
                        alignItems='center'>
                        <Tooltip title='Справка'>
                            <IconButton
                                onClick={()=>{router.push('/reference')}}
                                color='secondary'>
                                <Help/>
                            </IconButton>
                        </Tooltip>
                        <SortButton />
                    </Stack>
                </Stack>
                <Typography
                    textAlign='center'
                    color='secondary.main'
                    variant='subtitle1'>
                    Нажмите на задачу, чтобы открыть дополнительную информацию.
                </Typography>
                <Divider/>
            </Stack>
            <LoaderContent isLoading={isLoading}>
                <Stack spacing={1} px={2}>
                    {
                        tasks.length > 0 ?
                            tasks.map((task) => {
                                    return (<Task
                                        key={task.id}
                                        content={task}
                                        onChangeTask={() => {
                                            renderTasks();
                                        }}
                                        onOpenModal={() => {
                                            setSelectTask(task);
                                            setOpenModal(true);
                                        }}
                                        onDelete={() => {
                                            setOpenDialog(true);
                                            setSelectTask(task);
                                        }}/>);
                            })
                            :
                            <Stack
                                m={1}
                                alignItems='center'
                                spacing={2}>
                                <Typography
                                    variant="h4"
                                    fontWeight={600}
                                    color='secondary.dark'
                                    component='p'>
                                    Вы не завершили ни одну задачу!
                                </Typography>
                                <Image
                                    src={thinkImage}
                                    alt='Image about list'
                                    placeholder='blur'
                                    width={500}
                                    height={500}
                                />
                            </Stack>
                    }
                </Stack>
            </LoaderContent>
            <ModalTask
                open={openModal}
                task={selectTask ? selectTask : {} as ITask}
                onClose={() => {
                    setOpenModal(false);
                }}
                tabName='Выполненные'/>
            <AlertDialog
                open={openDialog}
                title="Удаление выполненной задачи"
                text="Подтвердите удаление задачи"
                onAgree={handlerDialogAgree}
                onDisagree={handlerDialogDisagree}/>
        </Stack>
    );
};

export default CompleteFrame;