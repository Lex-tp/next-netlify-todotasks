import {Stack} from "@mui/material";
import ButtonLink from "../ButtonLink";
import Link from 'next/link';
import styles from './AuthButton.module.scss';

//TODO: fix bags with styles in script for build
const AuthButton = () => {
    return (
            <Stack direction='row' spacing={1}>
                <Link href='/users/signin' passHref>
                <ButtonLink
                    variant='text'
                    size='medium'
                    className={styles.auth_btn}>Войти</ButtonLink>
                </Link>
                <Link href='/users/signup' passHref>
                <ButtonLink
                    className={styles.auth_btn}
                    variant='text'
                    size='medium'>Регистрация</ButtonLink>
                </Link>
            </Stack>
    );
};

export default AuthButton;