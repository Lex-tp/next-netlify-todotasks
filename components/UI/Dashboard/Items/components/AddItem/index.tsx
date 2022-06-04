import React from 'react';
import {Button, Divider, Stack} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface AddItemProps {
    title: string,
    OnClick(): void
}

const AddItem = (props: AddItemProps) => {
    return (
        <Stack
            py={2}
            alignItems='center'>
                <Button
                    sx={{width: 'max-content'}}
                    size='small'
                    variant='contained'
                    onClick={props.OnClick}
                    startIcon={<AddIcon/>}>{props.title}
                </Button>
        </Stack>
    );
};

export default AddItem;