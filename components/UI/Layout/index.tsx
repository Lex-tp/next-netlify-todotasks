import React, {ReactFragment, useEffect} from 'react';
import {Box, Container} from "@mui/material";
import Head from "next/head";
import NavBar from "../NavBar";
import FooterBox from "../FooterBox";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {checkAuth} from "../../../store/services/ActionCreator";

interface LayoutProps {
    title:string,
    children?: React.ReactNode;
    footerOff?: boolean
}

const Layout = (props:LayoutProps) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
        if(localStorage.getItem('token') &&
            localStorage.getItem('token')!=='undefined') {
            dispatch(checkAuth());
        }
    },[]);

    return (
        <Box className='wrapper'>
            <Head>
                <title>{props.title}</title>
            </Head>
            <NavBar/>
            <Container maxWidth='xl' component='main'>
                {props.children}
            </Container>
            {
                props.footerOff?
                     null
                    :
                    <FooterBox/>
            }
        </Box>
    );
};

export default Layout;