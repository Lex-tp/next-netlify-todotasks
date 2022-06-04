import React from 'react';
import Layout from "../../components/UI/Layout";
import {Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Link from 'next/link'
import ref1Image from "../../public/static/ref1.png";
import ref2Image from "../../public/static/ref2.png";
import ref3Image from "../../public/static/ref3.png";
import Image from "next/image";

const ReferencePage = () => {
    return (
        <Layout
            title='Справка'>
            <Stack
                py={2}
                alignItems='center'>
                <Typography
                    textAlign='center'
                    py={2}
                    variant='h4'
                    fontWeight='600'
                    color='secondary'>
                    Руководство по использованию
                </Typography>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Что делать после входа в учетную запись?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                        <Typography
                                    variant='subtitle1'
                                    color='secondary'>
                            После входа в систему <strong style={{color: '#FE4F5A'}}>ToDoTasks</strong>:
                            <Typography variant='subtitle1' color='secondary'>1. Есть возможность заполнить <Link href='/users/profile'>Профиль</Link>;</Typography>
                            <Typography variant='subtitle1' color='secondary'>2. Можно начать работу перейдя на страницу <Link href='/dashboard'>Рабочая область</Link>;</Typography>
                            <Typography variant='subtitle1' fontWeight={600} color='secondary'>Пора начать полностью контролировать ситуацию и создайте свой список дел!</Typography>
                        </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как начать работу?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' py={1} color='secondary'>Чтобы начать работу необходимо перейти на страницу <strong style={{color: '#FE4F5A'}}>[Рабочий стол]</strong>.</Typography>
                                <Typography variant='subtitle1' py={1} color='secondary'>После перехода на <strong style={{color: '#FE4F5A'}}>[Рабочий стол]</strong> появиться боковая панель с категориями:</Typography>
                                <Typography variant='subtitle1' color='secondary'>1. <strong style={{color: '#FE4F5A'}}>[Все задачи]</strong> (здесь хранятся все созданные задачи);</Typography>
                                <Typography variant='subtitle1' color='secondary'>2. <strong style={{color: '#FE4F5A'}}>[Сегодня]</strong> (здесь хранятся все задачи у которых срок выполнения заканчивается сегодня);</Typography>
                                <Typography variant='subtitle1' color='secondary'>3. <strong style={{color: '#FE4F5A'}}>[Предстоящие]</strong> (здесь хранятся все задачи в виде календаря и отмечены предстоящие задачи);</Typography>
                                <Typography variant='subtitle1' color='secondary'>4. <strong style={{color: '#FE4F5A'}}>[Выполненные]</strong> (здесь хранятся все выполненные задачи);</Typography>
                                <Typography variant='subtitle1' color='secondary'>5. <strong style={{color: '#FE4F5A'}}>[Пропущенные]</strong> (здесь хранятся все пропущенные задачи);</Typography>
                                <Typography variant='subtitle1' color='secondary'>6. <strong style={{color: '#FE4F5A'}}>[Метки]</strong> (здесь хранятся все метки).</Typography>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как редактировать профиль?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                        <Typography variant='subtitle1'
                                    color='secondary'>
                            <Typography variant='subtitle1' py={1} color='secondary'>1. Чтобы редактировать профиль необходимо щелкнуть на аватар профиля.</Typography>
                            <Image
                                src={ref1Image}
                                alt='Image reference 1'
                                placeholder='blur'
                                width={800}
                                height={218}
                            />
                            <Typography variant='subtitle1' color='secondary'>2. На странице профиля можно изменить изображение профиля нажав кнопку <strong style={{color: '#FE4F5A'}}>[Сменить изображение]</strong>.</Typography>
                            <Typography variant='subtitle1' py={1} fontWeight={600} color='primary'>(ВАЖНО! Картинка не должна превышать 3МБ и иметь расширение png/jpg/jpeg!)</Typography>
                            <Typography variant='subtitle1' color='secondary'>Для редактирования данных пользователя, необходимо нажать кнопку в правом верхнем углу <strong style={{color: '#FE4F5A'}}>[Редактировать]</strong>.</Typography>
                            <Typography variant='subtitle1' py={1} color='secondary'>Для завершения редактирования профиля необходимо нажать на кнопку <strong style={{color: '#FE4F5A'}}>[Сохранить изменения]</strong>.</Typography>
                            <Image
                                src={ref2Image}
                                alt='Image reference 2'
                                placeholder='blur'
                                width={800}
                                height={252}
                            />
                            <Typography variant='subtitle1' color='secondary'>Ниже по странице профиля находится статистика пользователя,
                                которая в постоянно собирает информацию о работе с задачами.</Typography>
                        </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как добавить или редактировать метки?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' color='secondary'>Чтобы добавить или редактировать метки необходимо перейти на страницу <strong style={{color: '#FE4F5A'}}>
                                    [Рабочий стол]</strong> и выбрать в боковом меню <strong style={{color: '#FE4F5A'}}>[Метки]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для добавления метки нужно нажать на клавишу <strong style={{color: '#FE4F5A'}}>[Добавить метку]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>В окне добавления нужно написать имя метки и выбрать из выпадающего списка цвет метки и для завершения нужно нажать на кнопку <strong style={{color: '#FE4F5A'}}>[Добавить]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для редактирования существующей метки нужно навести курсор на метку и нажать иконку <strong style={{color: '#FE4F5A'}}>[Редактирование]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>При нажатии на метку откроется модальное окно с задачами использующеми данную метку.</Typography>
                                <Image
                                    src={ref3Image}
                                    alt='Image reference 3'
                                    placeholder='blur'
                                />
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как добавить или редактировать задачу?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' color='secondary'>Чтобы добавить или редактировать задачу необходимо перейти на страницу <strong style={{color: '#FE4F5A'}}>
                                    [Рабочий стол]</strong> и выбрать в боковом меню нужный пункт меню.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для добавления задачи нужно нажать на клавишу <strong style={{color: '#FE4F5A'}}>[Добавить задачу]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>В окне добавления нужно написать заголовок задачи и детальное описание и выбрать из выпадающего списка можно выбрать метки и задать срок выполнения задачи. Для завершения добавления нужно нажать на кнопку <strong style={{color: '#FE4F5A'}}>[Добавить]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для редактирования существующей задачи нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Редактирование]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для конкретной задачи можно переназначить срок, нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Переназначить срок]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для конкретной задачи можно задать приоритет, нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Дополнительно]</strong> и после выбрать пункт <strong style={{color: '#FE4F5A'}}>[Добавить приоритет]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Есть возможность дублирования задачи, нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Дополнительно]</strong> и после выбрать пункт <strong style={{color: '#FE4F5A'}}>[Дублировать]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для переназначения срока задачи в пункте меню <strong style={{color: '#FE4F5A'}}>[Предстоящие]</strong>, нужно перетянуть задачу в нужную ячейку и заполнить время в модальном окне и нажать кнопку <strong style={{color: '#FE4F5A'}}>[Добавить]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для назначения статуса выполненой задачи нужно отметить нажав на квадрат возле заголовка в нужной задаче или навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Дополнительно]</strong> и после выбрать пункт <strong style={{color: '#FE4F5A'}}>[Отметить как выполнено]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Таким же способом можно и снять статус выполненой задачи, нажав на квадрат возле заголовка в нужной задаче или навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Снять метку о выполнении]</strong>.</Typography>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как добавить приоритет к задаче?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' color='secondary'>Для конкретной задачи можно задать приоритет, нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Дополнительно]</strong> и после выбрать пункт <strong style={{color: '#FE4F5A'}}>[Добавить приоритет]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Главная задача метки приоритета - вывод поверху списка задач и возможность фильтрации по приоритетным задачам.</Typography>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как добавить заметки к задаче?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' color='secondary'>Для конкретной задачи можно добавить пользовательские заметки, для этого нужно навести курсор на задачу и нажать иконку <strong style={{color: '#FE4F5A'}}>[Дополнительно]</strong> и после выбрать пункт <strong style={{color: '#FE4F5A'}}>[Добавить заметку]</strong> или нажать на саму задачу.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Откроется модальное окно с основной информацией задачи и областью для добавления заметок.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Чтобы добавить заметку необходимо ввести суть заметки в поле ввода или воспользоваться голосовым вводом <strong style={{color: '#FE4F5A'}}>(Важно! Не все браузеры поддерживают непрерывную голосовую диктовку)</strong>, также можно прикрепить к заметкам различные файлы, для завершения добавления заметки нужно нажать на <strong style={{color: '#FE4F5A'}}>[Добавить]</strong>.</Typography>
                                <Typography variant='subtitle1' py={1} fontWeight={600} color='primary'>(Важно! Файлы не должны превышать 8МБ и иметь расширение png/jpg/jpeg/doc/docx/xls/xlsx/pdf).</Typography>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                    >
                        <Typography variant='h6'
                                    color='secondary'>Как сортировать или фильтровать задачи?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxWidth={800}>
                            <Typography variant='subtitle1'
                                        color='secondary'>
                                <Typography variant='subtitle1' color='secondary'>Что применить сортировку или фильтрацию нужно нажать на иконку сортировки в верхнем правом углу и выбрать нужный пункт сортировки или фильтрациии.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Сортировка и фильтрация одна для всех пунктов меню кроме <strong style={{color: '#FE4F5A'}}>[Метки]</strong>.</Typography>
                                <Typography variant='subtitle1' color='secondary'>Для отмены параметров отображения нужно нажать на кнопку <strong style={{color: '#FE4F5A'}}>[Сбросить параметры]</strong>.</Typography>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Typography
                    textAlign='center'
                    variant='h5'
                    py={3}
                    color='secondary'
                    fontWeight={600}
                    component="h2">
                    Начните полностью контролировать ситуацию и создайте свой список дел.
                </Typography>
            </Stack>
        </Layout>
    );
};

export default ReferencePage;