import Image from "next/image";
import welcomePicture from '../../public/static/welcome.jpg';
import possibilityPicture from '../../public/static/possibility.jpg';
import StyleIcon from '@mui/icons-material/Style';
import AddBoxIcon from '@mui/icons-material/AddBox';
import BallotIcon from '@mui/icons-material/Ballot';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import styles from './HomeContent.module.scss'
import ButtonLink from "../UI/ButtonLink";
import Link from 'next/link';
import {Box, List, ListItem, ListItemIcon, ListItemText, Stack, SvgIcon, Typography} from "@mui/material";
import {useAppSelector} from "../../store/redux";

interface Scope {
    primary: string,
    secondary: string,
    icon: any
}

const scopeElements:Array<Scope> = [
    {primary:"Быстрое добавление", secondary:"Позволяет зафиксировать и организовать задачи.", icon:AddBoxIcon  },
    {primary:"Заметки и файлы", secondary:"Помогают прикреплять заметки к задачам.", icon:BallotIcon  },
    {primary:"Умное напоминание", secondary:"Сигнализируют о срочных задачах.", icon:NotificationsActiveIcon  },
    {primary:"Расстановка приоритета", secondary:"Выделяют самые важные задачи на день.", icon:GppMaybeIcon  },
    {primary:"Система меток", secondary:"Помогают мгновенно группировать задачи.", icon:StyleIcon }
]


const HomeContent = () => {
    const {isAuth} = useAppSelector(state => state.user);

    return (
        <Stack
            component='section'
            className={styles.wrapper}
            my={5}
            spacing={2}>
            <Stack
                component='article'
                className={styles.welcome_description}
                spacing={2}>
                <Typography
                    variant='h4'
                    fontWeight='bold'
                    textAlign='center'
                    component="h2">
                    Приведите все в порядок
                </Typography>
                <Typography
                    variant='h5'
                    textAlign='center'
                    component="p"
                    maxWidth={1000}>
                    Разгрузите свой ум - переместите свои задачи из головы в список дел.
                </Typography>
                <Typography
                    variant='h5'
                    textAlign='center'
                    component="p"
                    maxWidth={1000}>
                    ToDoTasks дает уверенность в том, что все организовано и принято во внимание, чтобы вы могли
                    преуспеть в важных для себя делах.
                </Typography>
                <Link href={isAuth ? '/dashboard': '/users/signin'} passHref>
                <ButtonLink
                    variant='contained'
                    size='medium'
                    color='primary'>
                    Начать</ButtonLink>
                </Link>
            </Stack>
            <Box component='article'>
                <Image
                    src={welcomePicture}
                    alt='Image about ToDoTasks'
                    placeholder='blur'
                    width={1050}
                    height={700}
                />
            </Box>
            <Stack
                direction={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row' }}
                alignItems='center'
                spacing={2}
                component='article'>
                <Image
                    src={possibilityPicture}
                    alt='Image about ToDoTasks'
                    placeholder='blur'
                    width={800}
                    height={800}/>
                <Stack
                    spacing={2}
                    alignItems='center'
                    maxWidth={650}>
                    <Typography
                        variant='h4'
                        fontWeight='bold'
                        textAlign='center'
                        component="h2">
                        Начинайте день, чувствуя покой и контроль над ситуацией
                    </Typography>
                    <Typography variant='h5'
                                textAlign='center'
                                component="p">
                        Получайте ясное представление обо всем, что нужно сделать, и не упускайте из вида важные задачи.
                    </Typography>
                    <List
                        sx={{
                            maxWidth: 500
                        }}>
                        {
                            scopeElements.map((item,index)=>{
                                return (
                                    <ListItem divider={ scopeElements.length !== index} key={index}>
                                        <ListItemIcon>
                                            <SvgIcon component={item.icon}  fontSize='large'
                                                     color='primary' />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.primary}
                                            secondary={item.secondary}/>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Stack>
            </Stack>
            <Stack
                component='article'
                className={styles.welcome_description}
                spacing={2}>
                <Typography
                    variant='h4'
                    fontWeight='bold'
                    textAlign='center'
                    component="h2"
                    maxWidth={1000}>
                    Начните полностью контролировать ситуацию и создайте свой список дел.
                </Typography>
                <Link href='/dashboard' passHref>
                <ButtonLink
                    variant='contained'
                    size='medium'
                    color='primary'>
                    Начать</ButtonLink>
                </Link>
            </Stack>
        </Stack>
    );
};

export default HomeContent;