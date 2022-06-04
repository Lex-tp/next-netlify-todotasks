import React, {useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import PaletteIcon from '@mui/icons-material/Palette';

const colorOptions = [
    {id: 1,label: 'Золотой',value: '#FFD700'},
    {id: 2,label: 'Темно-Золотистый',value: '#B8860B'},
    {id: 3,label: 'Коралловый',value: '#FF7F50'},
    {id: 4,label: 'Оранжевый',value: '#FF8C00'},
    {id: 5,label: 'Оранжево-Красный',value: '#FF4500'},
    {id: 6,label: 'Малиновый',value: '#DC143C'},
    {id: 7,label: 'Огнеупорный кирпич',value: '#B22222'},
    {id: 8,label: 'Темно-Красный',value: '#8B0000'},
    {id: 9,label: 'Пурпурный',value: '#FF00FF'},
    {id: 10,label: 'Синий фиолет',value: '#8A2BE2'},
    {id: 11,label: 'Темно-Пурпурный',value: '#8B008B'},
    {id: 12,label: 'Небесно-Голубой',value: '#00BFFF'},
    {id: 13,label: 'Голубой',value: '#007FFF'},
    {id: 14,label: 'Королевский Синий',value: '#4169E1'},
    {id: 15,label: 'Темно-Голубой',value: '#008B8B'},
    {id: 16,label: 'Синий',value: '#0000FF'},
    {id: 17,label: 'Темно-синий',value: '#00008B'},
    {id: 18,label: 'Индиго',value: '#4B0082'},
    {id: 19,label: 'Зеленый Лайм',value: '#32CD32'},
    {id: 20,label: 'Морской Зеленый',value: '#3CB371'},
    {id: 21,label: 'Зеленый',value: '#008000'},
];

interface ColorPickerProps {
    getColor(color:string): void,
    colorHex?: string
}

const ColorPicker = (props:ColorPickerProps) => {
    const [color, setColor] = React.useState('13');

    const handleChange = (event: SelectChangeEvent) => {
        setColor(event.target.value as string);
        const hexCode = colorOptions.find((element)=> element.id === parseInt(event.target.value))?.value;
        props.getColor(hexCode!);
    };

    useEffect(()=>{
        if(props.colorHex) {
            setColor(colorOptions.find((element)=> element.value.toLowerCase() === props.colorHex!.toLowerCase())?.id.toString()!);
        }
    },[props.colorHex]);

    return (
        <FormControl
            size='small'
            sx={{ m: 1}}>
            <InputLabel id="color_label">Цвет</InputLabel>
            <Select
                labelId="color_label"
                id="color_select"
                value={color}
                defaultValue={color}
                label="Цвет"
                onChange={handleChange}
            >
                {
                    colorOptions.map((color)=>{
                        return (<MenuItem
                            key={color.id}
                            value={color.id}>
                            <Stack
                                spacing={1}
                                direction='row'>
                                <PaletteIcon sx={{color: `${color.value}`}}/>
                                <Typography
                                    color='secondary.dark'
                                    fontWeight={600}
                                    variant='body1'>
                                    {color.label}
                                </Typography>
                            </Stack>
                        </MenuItem>);
                    })
                }
            </Select>
        </FormControl>
    );
};

export default ColorPicker;