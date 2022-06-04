import {Container, Stack, Typography} from "@mui/material";
import Image from 'next/image';
import errorPicture from '../public/static/404.jpg';
import Head from "next/head";

const Custom404 = () => {
    return (
        <>
            <Head>
                <title>Ошибка (404)</title>
            </Head>
            <Container maxWidth="xl">
                <Stack
                    alignItems='center'
                    spacing={2}
                    p={3}>
                    <Typography
                        variant='h1'
                        fontWeight='600'
                        component="span"
                        color='secondary'>
                        404
                    </Typography>
                    <Typography
                        variant='h2'
                        fontWeight='600'
                        component="span"
                        textAlign='center'
                        color='secondary'>
                        Страница не найдена!
                    </Typography>
                    <Image
                        src={errorPicture}
                        width={850}
                        height={567}
                        placeholder='blur'
                        alt='Image for page not found'/>
                </Stack>
            </Container>
        </>
    );
};

export default Custom404;