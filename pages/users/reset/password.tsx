import Head from "next/head";
import {Container} from "@mui/material";
import ResetPassword from "../../../components/ResetPassword";

const ResetPasswordPage = () => {
    return (
        <>
            <Head>
                <title>Восстановление пароля</title>
            </Head>
            <Container maxWidth="xl">
                <ResetPassword/>
            </Container>
        </>
    );
};

export default ResetPasswordPage;