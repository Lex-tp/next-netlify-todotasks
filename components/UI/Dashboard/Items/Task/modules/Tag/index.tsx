import React from 'react';
import {Chip, ChipProps, Tooltip} from "@mui/material";
import styles from './Tag.module.scss';
import {Tag as TagIcon} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../../store";
import {selectTabFrame} from "../../../../../../../store/reducers/userReducer";

interface TagProps extends ChipProps {
    titleTag?: string,
    colorMain?: string,
}

const Tag = (props:TagProps) => {
    const { titleTag, colorMain, ...rest } = props;
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Tooltip title='Перейти к меткам'>
        <Chip
            {...rest}
            onClick={()=>{
                dispatch(selectTabFrame({numberTab: 6}));
            }}
            variant='outlined'
            size='small'
            className={styles.tag}
            sx={{
                color: `${props.colorMain}`,
            }}
            icon={<TagIcon sx={{color: `${props.colorMain} !important`}}/>}
            label={
                <span className={styles.tag_title}>
                    {props.titleTag}
                </span>
            }/>
        </Tooltip>
    );
};

export default Tag;