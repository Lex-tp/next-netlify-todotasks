import React, {useEffect, useState} from 'react';
import {Divider, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Title from "../Title";
import SortButton from "../../../SortButton";
import EditTask from "../../Items/Task/modules/EditTask";
import {ITag} from "../../../../../store/types/ITag";
import AddItem from "../../Items/components/AddItem";
import LoaderContent from "../../../LoaderContent";
import Task from "../../Items/Task";
import Image from "next/image";
import emptyImage from "../../../../../public/static/empty.jpg";
import ModalTask from "../../Items/Task/modules/ModalTask";
import {ITask} from "../../../../../store/types/ITask";
import AlertDialog from "../../../AlertDialog";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import {useSnackbar} from "notistack";
import {
    fetchAddTagForTask,
    fetchAddTask,
    getAllTasks,
    incFailStatUser,
    removeTask
} from "../../../../../store/services/ActionCreator";
import {useAppSelector} from "../../../../../store/redux";
import {Help} from "@mui/icons-material";
import {useRouter} from "next/router";

const AllFrame = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Array<ITask>>([]);
    const [selectTask, setSelectTask] = useState<ITask>();
    const [openDialog, setOpenDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [addMode, setAddMode] = useState(false);
    const { sortType, priorityOnly, tagsSort, user} = useAppSelector(state => state.user);

    useEffect(() => {
        let unmounted = false;
        renderTasks(unmounted);
        return () => {
            unmounted = true
        };
    }, []);

    function renderTasks(mounted?: boolean | null) {
        setLoading(true);
        dispatch(getAllTasks({sort: sortType})).then((data) => {
            if (!mounted) {
                if (data.payload) {
                    const commonArray = [...data.payload].filter((task) => {
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
                    }).filter(element=> !element.priority);
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
                    }).filter(element=> element.priority);
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

    useEffect(() => {
        const interval = setInterval(() => {
            renderTasks();
        }, 600000);
        return () => clearInterval(interval);
    }, []);

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

    const handlerAddTask = () => {
        setAddMode(!addMode);
    }

    useEffect(()=> {
        renderTasks();
    },[sortType, priorityOnly, tagsSort]);

    const handlerSuccessAdd = (title: string, description: string, term: string, tags: Array<ITag>) => {
        dispatch(fetchAddTask({title, description, term}))
            .unwrap()
            .then((data: ITask) => {
                tags.forEach((tag) => {
                    dispatch(fetchAddTagForTask({taskId: data.id, tagId: tag.id}))
                        .unwrap()
                        .then(() => {
                            renderTasks();
                        });
                });
            })
            .finally(() => {
                renderTasks();
                setAddMode(!addMode);
            });
    }
    return (
        <Stack spacing={1}>
            <Stack
                spacing={1}
                sx={{
                    position: 'sticky',
                    top: '55px',
                    backgroundColor: '#ffffff',
                    zIndex: '1'
                }}>
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Title text='Все задачи'/>
                    <Stack
                        spacing={1}
                        m={2}
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
                {
                    addMode ?
                        <EditTask
                            label='Добавление'
                            handlerSuccess={(title, description, term, tags: Array<ITag>) => {
                                handlerSuccessAdd(title, description, term, tags)
                            }}
                            handlerCancel={handlerAddTask}/>
                        :
                        <AddItem
                            title='Добавить задачу'
                            OnClick={handlerAddTask}/>
                }
                <Divider/>
            </Stack>
            <LoaderContent isLoading={isLoading}>
                <Stack spacing={1} px={2} pb={7}>
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
                                    Список задач пуст!
                                </Typography>
                                <Image
                                    src={emptyImage}
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
                    renderTasks();
                }}
                tabName='Все задачи'/>
            <AlertDialog
                open={openDialog}
                title="Удаление задачи"
                text="Подтвердите удаление задачи"
                onAgree={handlerDialogAgree}
                onDisagree={handlerDialogDisagree}/>
        </Stack>
    );
};

export default AllFrame;