import React, {useState} from 'react';
import {
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import styles from "./TagItem.module.scss";
import {
    Delete,
    Edit,
} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../store";
import {getAllTags, updateTag} from "../../../../../store/services/ActionCreator";
import EditTag from "./modules/EditTag";

interface TagItemProps {
    colorIcon: string,
    title: string,
    idTag: number,

    onDelete(): void,

    onOpenModal(): void
}

const TagItem = (props: TagItemProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [editMode, setEditMode] = useState(false);

    const handlerDelete = () => {
        props.onDelete();
    }

    const handlerEdit = () => {
        setEditMode(!editMode);
    }

    const handlerUpdateTag = (title: string, color: string) => {
        dispatch(updateTag({id: props.idTag, title: title, color: color})).then(() => {
            dispatch(getAllTags());
            setEditMode(false);
        });
    }

    return (
        <Stack>
            {
                editMode ?
                    <EditTag
                        label='Редактирование'
                        title={props.title}
                        color={props.colorIcon}
                        handlerSuccess={handlerUpdateTag}
                        handlerCancel={handlerEdit}/>
                    :
                    <Stack
                        onClick={(e:React.MouseEvent) => {
                            if (!(e.target as HTMLElement).parentElement?.getAttribute('data-clicked-pass') &&
                                !(e.target as HTMLElement).getAttribute('data-clicked-pass')) {
                                props.onOpenModal();
                            }
                        }}
                        className={styles.static_tag}
                        direction='row'
                        spacing={1}>
                        <LocalOfferIcon
                            id='icon-item'
                            sx={{
                                m: '10px',
                                color: `${props.colorIcon}`
                            }}/>
                        <Stack
                            className={styles.tag_content}>
                            <Typography
                                variant="h6"
                                color='secondary.dark'
                                component='p'>
                                {props.title}
                            </Typography>
                        </Stack>
                            <Tooltip title='Редактировать'>
                            <IconButton
                                data-clicked-pass={true}
                                color='secondary'
                                onClick={handlerEdit}>
                                <Edit data-clicked-pass={true}/>
                            </IconButton>
                            </Tooltip>
                            <Tooltip title='Удалить'>
                            <IconButton
                                data-clicked-pass={true}
                                color='secondary'
                                onClick={handlerDelete}>
                                <Delete data-clicked-pass={true}/>
                            </IconButton>
                            </Tooltip>
                    </Stack>
            }
        </Stack>
    );
};

export default TagItem;