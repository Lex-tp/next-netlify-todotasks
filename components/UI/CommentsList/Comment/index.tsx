import React, {useState} from 'react';
import {
    Avatar,
    Box, Button,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText, Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {useAppSelector} from "../../../../store/redux";
import {stringAvatar} from "../../ProfileMenu/settings";
import styles from "./Comment.module.scss";
import {AttachFile, Delete} from "@mui/icons-material";
import {API_URL} from "../../../../http";
import {overflowFileName} from "../settings";

interface CommentProps {
    text: string,
    dateCreate: string,
    file:string,
    onDelete():void
}

const Comment = (props: CommentProps) => {
    const {user} = useAppSelector(state => state.user);
    const [visibleAction,setVisibleAction] = useState(false);

    const onMouseEnter = () => {
        setVisibleAction(true);
    }

    const onMouseLeave = () => {
        setVisibleAction(false);
    }


    return (
        <Box
            className={styles.comment_block}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            m={1}
            component='li'>
        <ListItem
            component='div'
            secondaryAction={
                visibleAction ?
                    <Tooltip title='Удалить комментарий'>
                        <IconButton
                            onClick={()=>{
                                props.onDelete();
                            }}
                            size='small'
                            edge="end"
                            aria-label="delete">
                            <Delete color='secondary'/>
                        </IconButton>
                    </Tooltip>
                    :
                    null
            }>
            <Tooltip title={user.login}>
                <ListItemAvatar>
                    <Avatar
                        className={styles.avatar_comment}
                        sx={{
                            width: 45,
                            height: 45,
                        }}
                        alt={user.login}
                        src={user.avatarUrl}
                        {...user.avatarUrl !== '' ? null : stringAvatar(`${user.surname} ${user.name}`)}/>
                </ListItemAvatar>
            </Tooltip>
            <ListItemText
                sx={{overflowWrap: "anywhere"}}
                primary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            fontWeight={600}
                            color="secondary"
                        >
                            {`${user.surname} ${user.name}`}
                        </Typography>
                        <Typography
                            component="span"
                            variant='caption'
                            mx={1}
                        >
                            {props.dateCreate.slice(0,-3)}
                        </Typography>
                    </React.Fragment>}
                disableTypography
                secondary={
                    <>
                        <Typography
                            component="p"
                            variant="subtitle2"
                            color="secondary"
                        >
                            {props.text}
                        </Typography>
                            {
                                props.file ?
                                    <Stack
                                        alignItems='center'
                                        direction='row'>
                                        <AttachFile fontSize='small'/>
                                        <Tooltip title={overflowFileName(props.file)}>
                                            <Button
                                                size='small'
                                                variant='text'
                                                target='_blank'
                                                href={`${API_URL}/files/${props.file}`}>
                                                {overflowFileName(props.file)}
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                    :
                                    null
                            }
                    </>
                }
            />
        </ListItem>
        </Box>
    );
};

export default Comment;