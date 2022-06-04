import {Button, ButtonProps, Tooltip} from "@mui/material";

interface ServicesProps extends ButtonProps {
    serviceTitle: string,
}
const ServiceButton = (props:ServicesProps) => {
    return (
        <Tooltip title={`Авторизация с помощью ${props.serviceTitle}`}>
            <Button
                variant='outlined'
                color='secondary'
                size='medium'
                sx={{textTransform: 'none'}}
                disableRipple={true}
                onClick={props.onClick}
                startIcon={props.startIcon}>
                { `Продолжить через ${props.serviceTitle}`}
            </Button>
        </Tooltip>
    );
};

export default ServiceButton;