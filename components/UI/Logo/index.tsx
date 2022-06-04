import styles from './Logo.module.scss'
import Image from "next/image";
import {Box, Typography, Link as LinkMui} from "@mui/material";
import Link from 'next/link'

interface LogoProps {
    icon: string,
    title: string,
    iconWidth: number,
    iconHeight: number,
    isResponsive: boolean,
    color?: string,
}

const Logo = (props:LogoProps) => {
    return (
        <Link href='/' passHref>
            <LinkMui underline="none">
                <Box className={styles.logo}>
                    <Image src={props.icon} alt='Logo for app' height={props.iconHeight} width={props.iconWidth}/>
                    <Typography
                        variant='h4'
                        fontWeight='bold'
                        noWrap
                        component="h1"
                        color={props.color}
                        mr={2}
                        sx={props.isResponsive? {display: { xs: 'none', md: 'flex' }}: null}>
                        {props.title}
                    </Typography>
                </Box>
            </LinkMui>
        </Link>
    );
};

export default Logo;