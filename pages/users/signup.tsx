import Head from 'next/head'
import AuthBox from "../../components/AuthBox";
import {Container} from "@mui/material";

const SignUp = () => {
    return (
        <>
            <Head>
                <title>Регистрация</title>
            </Head>
            <Container maxWidth="xl">
                <AuthBox type='signUp'/>
            </Container>
        </>
    )
};

export default SignUp;