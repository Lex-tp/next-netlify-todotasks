import React, {useEffect, useState} from 'react';
import {Reorder} from "@mui/icons-material";
import {
    Autocomplete,
    Button,
    IconButton,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    Stack, Switch, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {setPriority, setSortType, setTagsSort} from "../../../store/reducers/userReducer";
import {useAppSelector} from "../../../store/redux";
import Tag from "../Dashboard/Items/Task/modules/Tag";
import {ITag} from "../../../store/types/ITag";
import CircleIcon from "@mui/icons-material/Circle";
import {useSnackbar} from "notistack";

const SortButton = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const [selectedTags, setSelectedTags] = useState<Array<ITag>>([]);
    const [typeSort, setTypeSort] = useState('DESC');
    const [priority, setPrioritySort] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const {sortType, priorityOnly, tags, tagsSort} = useAppSelector(state => state.user);
    const {enqueueSnackbar} = useSnackbar();

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrioritySort(event.target.checked);
        dispatch(setPriority({set: event.target.checked}));
    }

    const handleTypeChange = (event: SelectChangeEvent) => {
            setTypeSort(event.target.value);
            dispatch(setSortType({type: event.target.value}));
    };

    useEffect(() => {
        setTypeSort(sortType);
        setSelectedTags(tagsSort);
        setPrioritySort(priorityOnly);
    }, [sortType, priorityOnly, tagsSort]);

    return (
        <>
            <Tooltip title='Параметры отображения'>
                <Stack direction='row' alignItems='center'>
                    {
                        priorityOnly ||
                        tagsSort.length>0 ||
                        sortType!=='DESC' ?
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                sx={{color: '#FE4F5A'}}
                                noWrap>
                                Применены параметры
                            </Typography>
                            :
                            null
                    }
                    <IconButton
                        color='secondary'
                        size='large'
                        onClick={(e) => handlePopoverOpen(e)}>
                            <Reorder sx={{
                                color: priorityOnly ||
                                tagsSort.length>0 ||
                                sortType!=='DESC' ? '#FE4F5A': null}}/>
                    </IconButton>
                </Stack>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handlePopoverClose}>
                <Stack py={1} px={2} width={320}>
                    <Stack spacing={0.5}>
                        <Stack
                            spacing={1}
                            alignItems='center'
                            justifyContent='space-between'
                            direction='column'>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color='secondary'
                                noWrap>
                                Параметры отображения
                            </Typography>
                            <Stack
                                width='100%'
                                direction='column'
                                spacing={1.5}>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    color='secondary'
                                    noWrap>
                                    Сортировать
                                </Typography>
                                <Select
                                    fullWidth
                                    size='small'
                                    value={typeSort}
                                    onChange={handleTypeChange}
                                    displayEmpty
                                >
                                    <MenuItem
                                        color='secondary'
                                        value={'DESC'}>Сначала новые</MenuItem>
                                    <MenuItem
                                        color='secondary'
                                        value={'ASC'}>Сначала старые</MenuItem>
                                </Select>
                                <Stack
                                    direction='column'>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        color='secondary'
                                        noWrap>
                                        Только приоритетные задачи
                                    </Typography>
                                    <Switch checked={priority} onChange={handleSwitchChange}/>
                                </Stack>
                                <Stack
                                    direction='column'
                                    spacing={0.5}
                                    pb={1}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        color='secondary'
                                        noWrap>
                                        Фильтрация по тегам
                                    </Typography>
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
                                                    dispatch(setTagsSort({array: [...values]}));
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
                                                    placeholder='Выбрать тег'
                                                    fullWidth/>}
                                            />
                                        </Stack>
                                </Stack>
                                <Stack
                                    direction='column'
                                    spacing={0.5}
                                    pb={1}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        onClick={()=>{
                                            dispatch(setSortType({type: 'DESC'}));
                                            dispatch(setTagsSort({array: []}));
                                            dispatch(setPriority({set: false}));
                                            enqueueSnackbar(`Все параметры отображения восстановлены`, {variant: "success"});
                                        }}>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            textTransform='none'
                                            noWrap>
                                            Сбросить параметры
                                        </Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>

                    </Stack>
                </Stack>
            </Popover>
        </>
    );
};

export default SortButton;