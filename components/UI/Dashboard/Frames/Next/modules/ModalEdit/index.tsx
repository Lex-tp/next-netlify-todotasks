import React from 'react';
import {Box, Fade, Modal, Stack, Typography} from "@mui/material";
import {style} from "../../../../Items/settings/style/ModalWindow";
import {ITask} from "../../../../../../../store/types/ITask";
import {ITag} from "../../../../../../../store/types/ITag";
import EditTask from "../../../../Items/Task/modules/EditTask";
import {fetchAddTagForTask, fetchAddTask, updateTask} from "../../../../../../../store/services/ActionCreator";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../../store";

interface ModalEditProps {
    open: boolean,
    tabName: string,

    onClose(): void,

    onChange(): void,

    task: ITask,
    addMethod: boolean,
    onlyTerm?: boolean,
}

const ModalEdit = (props: ModalEditProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handlerSuccessEdit = (title: string, description: string, term: string, tags: Array<ITag>) => {
        if (!props.addMethod) {
            dispatch(updateTask({id: props.task.id, title, description, term}))
                .then(() => {
                    if (tags.length > 0) {
                        tags.forEach((tag) => {
                            dispatch(fetchAddTagForTask({taskId: props.task.id, tagId: tag.id}))
                                .unwrap()
                                .then(() => {
                                    props.onClose();
                                    props.onChange();
                                });
                        })
                    } else {
                        props.onChange();
                        props.onClose();
                    }
                });
        } else {
            dispatch(fetchAddTask({title, description, term}))
                .unwrap()
                .then((data: ITask) => {
                    if (tags.length > 0) {
                        tags.forEach((tag) => {
                            dispatch(fetchAddTagForTask({taskId: data.id, tagId: tag.id}))
                                .unwrap()
                                .then(() => {
                                    props.onClose();
                                    props.onChange();
                                });
                        })
                    } else {
                        props.onChange();
                        props.onClose();
                    }
                })
        }
    }

    const handlerCancelEdit = () => {
        props.onClose();
    }

    return (
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
                        <EditTask
                            label={props.tabName}
                            title={props.task.title}
                            term={props.task.term}
                            onlyTerm={props.onlyTerm}
                            content={props.task.description}
                            selectTags={props.task.task_tags}
                            handlerSuccess={(title, description, term, tags: Array<ITag>) => {
                                handlerSuccessEdit(title, description, term, tags);
                            }}
                            handlerCancel={handlerCancelEdit}/>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ModalEdit;