import React, {useEffect, useState} from 'react';
import {
    Box,
    Checkbox,
    Divider,
    Fade,
    IconButton,
    Modal, Paper,
    Stack,
    Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Tabs,
    Tooltip,
    Typography
} from "@mui/material";
import styles from "./ModalTag.module.scss";
import {Close, Description} from "@mui/icons-material";
import {ITag} from "../../../../../../../store/types/ITag";
import {style} from "../../../settings/style/ModalWindow";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {getAllComments, getTasksWithTag} from "../../../../../../../store/services/ActionCreator";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../../store";
import {useAppSelector} from "../../../../../../../store/redux";
import LoaderContent from "../../../../../LoaderContent";

interface ModalTagProps {
    open: boolean,
    tabName: string,
    onClose(): void,
    tag: ITag
}

const ModalTag = (props: ModalTagProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {tasksWithTag} = useAppSelector(state => state.user);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (props.tag.id) {
            dispatch(getTasksWithTag({tagId: props.tag.id})).then(() => {
                setLoading(false);
            })
        }
    }, [props.tag]);

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
                                direction='row'
                                alignItems='flex-start'>
                                <LocalOfferIcon
                                    id='icon-item'
                                    sx={{
                                        m: '10px',
                                        color: `${props.tag.color}`
                                    }}/>
                                <Stack
                                    spacing={1}
                                    direction='column'>
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                        my={0.5}
                                        component="h2">
                                        {props.tag.title}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            sx={{width: '100%'}}>
                            <Typography
                                p={1}
                                pb={1.5}
                                color='primary'
                                textTransform='uppercase'
                                variant='subtitle2'>
                                {`Задачи c текущим тегом (${tasksWithTag.length})`}
                            </Typography>
                            <Divider/>
                            <LoaderContent isLoading={isLoading}>
                            <TableContainer component={Paper} sx={{maxHeight: '300px'}}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Заголовок</TableCell>
                                            <TableCell>Срок выполнения</TableCell>
                                            <TableCell>Дата создания</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            tasksWithTag.length > 0 ?
                                                tasksWithTag.map((row)=>{
                                                    return (
                                                        <TableRow key={row.title}>
                                                            <TableCell sx={{
                                                                width: '30px'
                                                            }}>
                                                                <Checkbox checked={row.done} />
                                                            </TableCell>
                                                            <TableCell sx={{
                                                                maxWidth: '150px',
                                                                overflow: "hidden",
                                                                textOverflow: 'ellipsis'
                                                            }}>
                                                                {row.title}
                                                            </TableCell>
                                                            <TableCell>{new Date(row.term).toLocaleString('ru-RU')}</TableCell>
                                                            <TableCell>{new Date(row.dateCreate).toLocaleDateString('ru-RU')}</TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </LoaderContent>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ModalTag;