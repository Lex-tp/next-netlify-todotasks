import {Container, Stack, Typography} from "@mui/material";
import Image from 'next/image';
import timeoutPicture from '../../public/static/timeout.jpg';
import Head from "next/head";
import ButtonLink from "../../components/UI/ButtonLink";
import React from "react";
import {useRouter} from "next/router";

const SessionUp = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Время сессии истекло</title>
            </Head>
            <Container maxWidth="xl">
                <Stack
                    alignItems='center'
                    spacing={2}
                    p={3}>
                    <Typography
                        variant='h2'
                        fontWeight='600'
                        component="h1"
                        textAlign='center'
                        color='secondary'>
                        Время сессии истекло
                    </Typography>
                    <Image
                        src={timeoutPicture}
                        width={550}
                        height={550}
                        placeholder='blur'
                        alt='Image for page not found'/>
                    <Typography
                        variant='h4'
                        component="span"
                        fontWeight='600'
                        textAlign='center'
                        color='secondary'>
                        Выполните повторно вход
                    </Typography>
                    <Stack
                        spacing={2}
                        direction='row'>
                        <ButtonLink
                            sx={{ width: '140px'}}
                            variant='contained'
                            size='small'
                            onClick={()=>{
                                router.push('/users/signin');
                            }}>
                            Вход
                        </ButtonLink>
                        <ButtonLink
                            sx={{ width: '140px'}}
                            variant='contained'
                            size='small'
                            onClick={()=>{
                                router.push('/');
                            }}>
                            На главную
                        </ButtonLink>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default SessionUp;