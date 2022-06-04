import React from 'react';
import {Stack, Typography} from "@mui/material";

interface TitleProps {
    text: string,
    subText?: string
}

const Title = (props:TitleProps) => {
    return (
        <Stack
            direction='row'
            spacing={1}
            m={2}
            mb={3}
            alignItems='end'>
            <Typography
                variant="h4"
                fontWeight={600}
                color='secondary.dark'
                component="h2">
                {props.text}
            </Typography>
            {
                props.subText ?
                    <Typography
                        variant="h6"
                        color='secondary'
                        component="span">
                        {props.subText}
                    </Typography>
                    :
                    null
            }
        </Stack>
    );
};

export default Title;