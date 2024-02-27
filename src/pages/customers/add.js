import Head from 'next/head';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import {
    Box, Button,
    Card, CardContent,
    CardHeader,
    Container, Divider,
    Link,
    Paper,
    Stack,
    SvgIcon, TextField,
    Typography
} from '@mui/material';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

const Page = () => {
    const router = useRouter();
    const {publicRuntimeConfig} = getConfig();
    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirm_password: '',
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
                .required('Password is required'),
            confirm_password: Yup
                .string()
                .max(255)
                .required('Confirm password is required')
                .oneOf([Yup.ref('password'), null], 'Password not match')
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}signup`, {
                    name: values.name,
                    email: values.email,
                    password: values.password
                })).data;
                if (result.status === 'success') {
                    enqueueSnackbar('Successfully added!', {variant: 'success'});
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
                    Add Customer | Sapien Eleven
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
                    <Stack spacing={4}>
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
                        <form onSubmit={formik.handleSubmit}>
                            <Paper elevation={1} >
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Add Customer'} />
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
                                                md={6}
                                                lg={6}
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
                                                md={6}
                                                lg={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.confirm_password && formik.errors.confirm_password)}
                                                    fullWidth
                                                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                                                    label="Confirm Password"
                                                    name="confirm_password"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="password"
                                                    value={formik.values.confirm_password}
                                                />
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
                                                Add
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