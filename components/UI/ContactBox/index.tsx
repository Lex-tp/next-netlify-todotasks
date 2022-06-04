import {Box, IconButton, Stack, SvgIcon, Tooltip, Typography} from "@mui/material";
import styles from "./ContactBox.module.scss";
import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon, Facebook as FacebookIcon, Email as EmailIcon } from "@mui/icons-material";

interface Contacts {
    title: string,
    href: string,
    icon: any,
    classSelector:string
}

const contactsItem:Array<Contacts> = [
    { title: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100077823717548', icon: FacebookIcon, classSelector: styles.facebookIcon},
    { title: 'GitHub', href: 'https://github.com/Lex-tp', icon: GitHubIcon, classSelector: styles.githubIcon},
    { title: 'Google Mail', href: 'mailto: volk.denis98@gmail.com', icon: EmailIcon, classSelector: styles.googleMailIcon},
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/denis-korotkevich-164999218/', icon: LinkedInIcon, classSelector: styles.linkedinIcon}
]

//TODO: fix bags in the build script
const ContactBox = () => {
    return (
        <Stack spacing={0.5}>
            <Typography
                className='while_text'
                variant="subtitle1"
                component="p"
                textAlign='center'
                fontWeight='bold'>
                Developer contacts
            </Typography>
            <Stack
                direction='row'
                justifyContent='center'
                spacing={2}>
                {
                    contactsItem.map((item,index)=>{
                       return(
                           <Box key={index}>
                               <Tooltip title={item.title}>
                                   <IconButton className={item.classSelector} href={item.href}>
                                       <SvgIcon
                                           component={item.icon}
                                           fontSize='large'/>
                                   </IconButton>
                               </Tooltip>
                           </Box>
                       );
                    })
                }
            </Stack>
        </Stack>
    );
};

export default ContactBox;