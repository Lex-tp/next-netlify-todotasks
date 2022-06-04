import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../../store";
import {getAllTags} from "../../../../../../../store/services/ActionCreator";
import {useAppSelector} from "../../../../../../../store/redux";
import Tag from "../Tag";
import {ITag} from "../../../../../../../store/types/ITag";
import EditItem from "../../../components/EditItem";
import validator from "validator";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ru from "date-fns/locale/ru"
import {endOfDay} from "date-fns";

interface EditTaskProps {
    label: string,
    title?: string,
    content?: string,
    selectTags?: Array<{ tagId: number, tagData: ITag }>,
    term?: string,

    handlerSuccess(title: string, description: string, term: string, tags: Array<ITag>): void,

    handlerCancel(): void,

    onlyTerm?: boolean
}

const EditTask = (props: EditTaskProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [term, setTerm] = React.useState<Date>(new Date());
    const [selectedTags, setSelectedTags] = useState<Array<ITag>>([]);
    const [error, setError] = useState(false);
    const [errorTerm, setErrorTerm] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const {tags} = useAppSelector(state => state.user);

    const handleChange = (newValue: Date | null) => {
        if(newValue && newValue > new Date()) {
            setTerm(newValue!);
            setErrorTerm(false);
        }else {
            setErrorTerm(true);
        }
    };

    useEffect(() => {
        setTitle(props.title || '');
        setDescription(props.content || '');
        handleChange(props.term ? new Date(props.term) : endOfDay(new Date()));
        dispatch(getAllTags());
        if (props.selectTags) {
            setSelectedTags([...props.selectTags.map((item) => {
                return Object.assign({id: item.tagId}, item.tagData);
            })]);
        }
    }, [props.title]);

    const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError(false);
        }
        setTitle(event.target && event.target.value);
    }

    const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target && event.target.value);
    }

    return (
        <EditItem
            label={props.label}
            confirmHandler={
                () => {
                    if (!validator.isEmpty(title)) {
                        if (!errorTerm) {
                            props.handlerSuccess(title, description, term.toISOString(), selectedTags);
                        }
                    } else {
                        setError(true);
                    }
                }
            }
            cancelHandler={props.handlerCancel}>
            {
                !props.onlyTerm ?
                    <>
                        <TextField
                            fullWidth
                            size='small'
                            placeholder='Заголовок'
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
                        <TextField
                            fullWidth
                            size='small'
                            placeholder='Описание'
                            multiline
                            rows={2}
                            value={description}
                            onChange={onChangeDescription}/>
                        <Stack
                            spacing={2}
                            direction='row'>
                            <Autocomplete
                                multiple
                                limitTags={3}
                                value={selectedTags}
                                getOptionLabel={(tags) => tags.title}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                fullWidth
                                size='small'
                                options={tags}
                                onChange={(event: React.SyntheticEvent, values: Array<ITag>) => {
                                    setSelectedTags(values);
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((tags, index) => (
                                        <Tag
                                            titleTag={tags.title}
                                            colorMain={tags.color}
                                            {...getTagProps({index})}
                                            key={tags.id}
                                        />
                                    ))
                                }
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            spacing={1}>
                                            <CircleIcon
                                                fontSize='small'
                                                sx={{color: `${option.color}`}}/>
                                            <Typography
                                                color='secondary.dark'
                                                variant='subtitle1'>
                                                {option.title}
                                            </Typography>
                                        </Stack>
                                    </li>
                                )}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Теги"
                                    placeholder='Добавить тег'
                                    fullWidth/>}
                            />
                        </Stack>
                    </>
                    :
                    null
            }
            <LocalizationProvider locale={ru} dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    mask='__.__.____ __:__'
                    ampm={false}
                    minDateTime={new Date()}
                    label="Срок выполнения"
                    value={term}
                    onChange={handleChange}
                    renderInput={(params) => <TextField
                        sx={{
                            color: '#395A66',
                            '& .MuiSvgIcon-root': {
                                color: '#395A66',
                            }
                        }}
                        helperText={
                            errorTerm ?
                                <Typography
                                    variant="caption"
                                    color='primary.main'
                                    component="span">
                                    Срок не должен быть раньше текущего времени!
                                </Typography>
                                :
                                null
                        }
                        size='small'
                        {...params} />}/>
            </LocalizationProvider>
        </EditItem>
    );
};

export default EditTask;