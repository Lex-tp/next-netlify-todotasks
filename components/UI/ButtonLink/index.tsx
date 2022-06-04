import styled from "@emotion/styled";
import {Button, ButtonProps} from "@mui/material";
import {ForwardedRef, forwardRef} from "react";

const CustomButton = styled(Button)({
    textTransform: 'none',
    fontSize: '1.2rem'
});

const ButtonLink = forwardRef(function ButtonLink (props: ButtonProps, ref:ForwardedRef<HTMLButtonElement>) {
        return (
            <CustomButton {...props} ref={ref}>
                {props.children}
            </CustomButton>
        );
});

export default ButtonLink;