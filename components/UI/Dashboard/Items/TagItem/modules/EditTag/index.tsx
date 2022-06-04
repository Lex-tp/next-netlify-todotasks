import React, {useEffect, useState} from 'react';
import {TextField, Typography} from "@mui/material";
import EditItem from "../../../components/EditItem";
import ColorPicker from "../../../../../ColorPicker";
import validator from "validator";

interface EditTagProps {
    label: string,
    title?: string,
    color?: string,
    handlerSuccess(title: string, color: string): void,
    handlerCancel(): void,
}

const EditTag = (props: EditTagProps) => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');
    const [error,setError] = useState(false);

    const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(error) {
            setError(false);
        }
        setTitle(event.target && event.target.value);
    }

    useEffect(()=>{
        setTitle(props.title || '');
        setColor(props.color || '');
    },[]);

    return (
        <EditItem
            label={props.label}
            confirmHandler={() => {
                if(!validator.isEmpty(title)) {
                    props.handlerSuccess(title, color);
                }else {
                    setError(true);
                }
            }}
            cancelHandler={() => {
                props.handlerCancel();
            }}
        >
            <TextField
                fullWidth
                size='small'
                placeholder='Название метки'
                id="fullWidth"
                value={title}
                autoComplete='off'
                error={error}
                helperText={
                    error ?
                        <Typography
                            variant="caption"
                            color='primary.main'
                            component="span">
                            Необходимо обязательно заполнить заголовок!
                        </Typography>
                        :
                        null
                }
                onChange={onChangeTitle}/>
            <ColorPicker
                colorHex={color}
                getColor={(hexCode) => {
                    setColor(hexCode);
                }}/>
        </EditItem>
    );
};

export default EditTag;