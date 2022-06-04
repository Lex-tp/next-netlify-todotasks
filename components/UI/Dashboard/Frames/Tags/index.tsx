import React, {useEffect, useState} from 'react';
import Title from "../Title";
import {Box, Divider, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {useAppSelector} from "../../../../../store/redux";
import TagItem from "../../Items/TagItem";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import {
    fetchAddTag,
    getAllTags, incFailStatUser, removeTag,
} from "../../../../../store/services/ActionCreator";
import AddItem from "../../Items/components/AddItem";
import EditTag from "../../Items/TagItem/modules/EditTag";
import AlertDialog from "../../../AlertDialog";
import Image from "next/image";
import emptyImage from "../../../../../public/static/empty.jpg";
import LoaderContent from "../../../LoaderContent";
import {useSnackbar} from "notistack";
import {ITag} from "../../../../../store/types/ITag";
import ModalTag from "../../Items/TagItem/modules/ModalTag";
import {Help} from "@mui/icons-material";
import {useRouter} from "next/router";

const TagsFrame = () => {
    const router = useRouter();
    const {tags, user, tasks} = useAppSelector(state => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [addMode, setAddMode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectTag, setSelectTag] = useState<ITag>();
    const [isLoading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const handlerAddTag = () => {
        setAddMode(!addMode);
    }

    const handlerSuccessAddTag = (title: string, color: string) => {
        dispatch(fetchAddTag({title, color: color || '#007FFF'}))
            .unwrap()
            .then(() => {
                renderTags();
            })
            .finally(() => {
                setAddMode(!addMode);
            });
    }

    const handlerDialogAgree = () => {
        setOpenDialog(false);
        dispatch(removeTag({id: selectTag?.id!})).then(() => {
            renderTags();
            setOpenDialog(false);
            enqueueSnackbar(`Метка (${getTagTitle()}) успешно удалена!`, {variant: "success"});
        });
    }

    const getTagTitle = () => {
        const title = tags[tags.findIndex((tag) => {
            return tag.id === selectTag?.id;
        })].title;

        return title.length > 12 ? title.slice(0, 12).concat('...') : title;
    }

    const renderTags = () => {
        setLoading(true);
        dispatch(getAllTags()).then(() => {
            setLoading(false);
        });
        dispatch(incFailStatUser({
            userId: parseInt(user.userId),
            count: tasks.filter(element => new Date(element.term) < new Date() && !element.done).length
        }))
    }

    const handlerDialogDisagree = () => {
        setOpenDialog(false);
    }

    useEffect(() => {
        renderTags();
    }, []);

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
                    <Title text='Метки'/>
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
                    </Stack>
                </Stack>

                <Typography
                    textAlign='center'
                    color='secondary.main'
                    variant='subtitle1'>
                    Нажмите на метку, чтобы открыть дополнительную информацию.
                </Typography>
                {
                    addMode ?
                        <EditTag
                            label='Добавление'
                            handlerSuccess={(title, color) => {
                                handlerSuccessAddTag(title, color);
                            }}
                            handlerCancel={handlerAddTag}/>
                        :
                        <AddItem
                            title='Добавить метку'
                            OnClick={handlerAddTag}/>
                }
                <Divider/>
            </Stack>
            <LoaderContent isLoading={isLoading}>
                {
                    tags.length > 0 ?
                        [...tags].map((tag) => {
                            return (<TagItem key={tag.id} idTag={tag.id} title={tag.title} colorIcon={tag.color}
                                             onOpenModal={() => {
                                                 setSelectTag(tag);
                                                 setOpenModal(true);
                                             }}
                                             onDelete={() => {
                                                 setOpenDialog(true);
                                                 setSelectTag(tag);
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
                                Список меток пуст!
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
            </LoaderContent>
            <ModalTag
                open={openModal}
                tag={selectTag ? selectTag : {} as ITag}
                onClose={() => {
                    setOpenModal(false);
                }}
                tabName='Метки'/>
            <AlertDialog
                open={openDialog}
                title="Удаление метки"
                text="Подтвердите удаление метки"
                onAgree={handlerDialogAgree}
                onDisagree={handlerDialogDisagree}/>
        </Stack>
    );
};

export default TagsFrame;