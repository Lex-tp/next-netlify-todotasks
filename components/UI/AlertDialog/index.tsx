import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import confirmImage from "../../../public/static/confirm.png";
import Image from "next/image";

interface AlertDialogProps {
    open: boolean,
    title: string,
    text: string,
    onAgree(): void,
    onDisagree(): void
}

const AlertDialog = (props: AlertDialogProps) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                { props.title }
            </DialogTitle>
            <DialogContent>
                <Stack
                    spacing={1}
                    direction='column'>
                    <Box textAlign='center'>
                        <Image
                            src={confirmImage}
                            alt='Image confirm'
                            placeholder='blur'
                            width={90}
                            height={90}
                        />
                    </Box>
                    <DialogContentText textAlign='center' id="alert-dialog-description">
                        { props.text }
                    </DialogContentText>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onAgree}>Подтвердить</Button>
                <Button onClick={props.onDisagree} autoFocus>
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;