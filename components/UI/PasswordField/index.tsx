import React, { useState } from 'react';
import {
    Box,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    OutlinedInputProps
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface PasswordProps extends OutlinedInputProps {
    value:string,
    validObj: { valid: boolean, message: string },
    onChangePassword(event:React.ChangeEvent<HTMLInputElement>):void;
}

const PasswordField = (props:PasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <FormControl
            size='small'
            variant="outlined"
            onChange={props.onChangePassword}
            error ={ !props.validObj.valid }
            color='secondary'>
            <InputLabel htmlFor={props.id}>{props.label || 'Пароль'}</InputLabel>
            <OutlinedInput
                id={props.id}
                type={showPassword ? 'text' : 'password'}
                value={props.value}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            color='secondary'
                            edge="end">
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                }
                label={props.label || 'Пароль'}
            />
            {
                !props.validObj.valid ?
                    <FormHelperText id={props.id}>
                        {
                            `* ${props.validObj.message}`
                        }
                    </FormHelperText>
                    :
                    null
            }
        </FormControl>
    );
};

export default PasswordField;