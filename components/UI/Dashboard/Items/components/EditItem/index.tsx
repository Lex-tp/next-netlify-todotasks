import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import styles from "./EditItem.module.scss";

interface EditItemProps {
    label: string,
    children?: React.ReactNode
    confirmHandler(): void,
    cancelHandler(): void
}

const EditItem = (props: EditItemProps) => {
    return (
        <>
            <Stack
                p={1}
                spacing={1.5}
                className={styles.task_wrapper}>
                <Typography
                    color='secondary'
                    variant='h6'>
                    {props.label}
                </Typography>
                {
                    props.children
                }
            </Stack>
            <Stack
                direction='row'
                justifyContent='flex-end'
                m={1}
                spacing={1}>
                <Button
                    size='small'
                    variant='contained'
                    onClick={props.confirmHandler}>Подтвердить</Button>
                <Button
                    size='small'
                    variant='outlined'
                    onClick={props.cancelHandler}>Отмена</Button>
            </Stack>
        </>
    );
};

export default EditItem;