import Head from 'next/head';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { useRouter } from 'next/router';
import {
    Avatar,
    Box,
    Button, Card, CardContent, CardHeader,
    Chip,
    Container, Divider,
    Link, Paper,
    Stack,
    SvgIcon, TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { getInitials } from '../../utils/get-initials';
import axios from 'axios';
import getConfig from 'next/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';

const Page = () => {
    const router = useRouter();
    const user = JSON.parse(router.query.user);
    const { publicRuntimeConfig } = getConfig();
    const formik = useFormik({
        initialValues: {
            email: user.email,
            name: user.name,
            password: '',
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup
                .string()
                .max(255)
                .required('Name is required'),
            password: Yup
                .string()
                .max(255)
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}updateUser`, {
                    id: user._id,
                    name: values.name,
                    email: values.email,
                    password: values.password
                })).data;
                if (result.status === 'success') {
                    enqueueSnackbar('Successfully updated!', {variant: 'success'});
                    router.back();
                } else {
                    enqueueSnackbar(result.comment, {variant: 'error'});
                }
            } catch (e) {
                enqueueSnackbar(e.toString(), {variant: 'error'});
            }
        }
    });
    const goBackCustomers = useCallback(
        () => {
            router.back();
        },
        []
    )
    return (
        <>
            <Head>
                <title>
                    Edit Customer | Sapien Eleven
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={'lg'}>
                    <Stack
                        spacing={4}
                    >
                        <div>
                            <Link
                                color={'inherit'}
                                underline={'hover'}
                                component={'button'}
                                onClick={goBackCustomers}
                            >
                                <Stack
                                    direction={'row'}
                                    alignItems={'flex-start'}
                                    justifyContent={'center'}
                                    spacing={2}
                                >
                                    <SvgIcon fontSize={'medium'}>
                                        <ArrowLeftIcon />
                                    </SvgIcon>
                                    <Typography variant={'h6'}>
                                        Customers
                                    </Typography>
                                </Stack>
                            </Link>
                        </div>
                        <Stack
                            direction={'row'}
                            spacing={2}
                        >
                            <Avatar
                                src={user.avatar}
                                sx={{width: 80, height: 80}}
                            >
                                {getInitials(user.name)}
                            </Avatar>
                            <Stack spacing={2}>
                                <Typography variant={'h4'}>
                                    {user.name}
                                </Typography>
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                >
                                    <Typography variant={'subtitle1'}>
                                        user_id:
                                    </Typography>
                                    <Chip
                                        label={user._id}
                                        variant={'outlined'}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                        <form onSubmit={formik.handleSubmit}>
                            <Paper elevation={1} >
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Edit Customer'} />
                                    <CardContent>
                                        <Grid
                                            container
                                            spacing={2}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.name && formik.errors.name)}
                                                    fullWidth
                                                    helperText={formik.touched.name && formik.errors.name}
                                                    label="Name"
                                                    name="name"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.name}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.email && formik.errors.email)}
                                                    fullWidth
                                                    helperText={formik.touched.email && formik.errors.email}
                                                    label="Email Address"
                                                    name="email"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="email"
                                                    value={formik.values.email}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.password && formik.errors.password)}
                                                    fullWidth
                                                    helperText={formik.touched.password && formik.errors.password}
                                                    label="Password"
                                                    name="password"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="password"
                                                    value={formik.values.password}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <Divider />
                                                <Typography
                                                    variant={'body2'}
                                                    sx={{mt: 2}}
                                                >
                                                    Password input is optional. If it's empty, it is not updated.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardContent>
                                        <Stack
                                            direction={'row'}
                                            spacing={3}
                                        >
                                            <Button
                                                type={'submit'}
                                                variant={'contained'}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant={'text'}
                                                onClick={goBackCustomers}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </form>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;