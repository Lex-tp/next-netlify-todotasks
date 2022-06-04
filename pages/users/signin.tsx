import {Container} from "@mui/material";
import Head from 'next/head'
import AuthBox from "../../components/AuthBox";

const SignIn = () => {
    return (
        <>
            <Head>
                <title>Вход</title>
            </Head>
            <Container maxWidth="xl">
                <AuthBox type='signIn'/>
            </Container>
        </>
    );
};

export default SignIn;