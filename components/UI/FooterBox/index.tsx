import {Box, Container, Stack, Typography} from "@mui/material";
import styles from './FooterBox.module.scss'
import Image from "next/image";
import logoApp from '../../../public/static/iconFooterApp.svg'
import ContactBox from "../ContactBox";

const FooterBox = () => {
    return (
        <Box className={styles.footer_wrapper}
             bgcolor='secondary.main'
             color='text.primary'
             component='footer'>
            <Container maxWidth='xl'>
                <Stack m={2} spacing={2}>
                    <Image src={logoApp} width={80} height={80} alt='Footer logo for app'/>
                    <Typography
                        variant="h4"
                        component="p"
                        textAlign='center'
                        fontWeight='bold'
                        textTransform='uppercase'
                        color='#f5f5f5'
                        gutterBottom>
                        ToDoTasks
                    </Typography>
                    <ContactBox />
                </Stack>
            </Container>
            <Box
                bgcolor='secondary.dark'
                color='text.secondary'
                component='div'>
                <Typography
                    variant="subtitle2"
                    component="p"
                    textAlign='center'>
                    Copyright © 2022 Korotkevich Denis.
                </Typography>
            </Box>
        </Box>
    );
};

export default FooterBox;