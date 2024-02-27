import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Box,
    Button,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import axios from 'axios';
import getConfig from 'next/config'

const Page = () => {
    const router = useRouter();
    const auth = useAuth();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup
                .string()
                .max(255)
                .required('Password is required')
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = await onLogin(values.email, values.password);
                if (result != null) {
                    if (result.status === 'success') {
                        await auth.signIn(result.user);
                        router.push('/');
                    } else {
                        setErrorMessage(result.comment);
                        helpers.setStatus({ success: false });
                        helpers.setErrors({ submit: result.comment });
                        helpers.setSubmitting(false);
                    }
                }
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });
    const [errorMessage, setErrorMessage] = useState('');

    const { publicRuntimeConfig } = getConfig();

    const onLogin = async (email, password) => {
        try {
            return (await axios.post(`${publicRuntimeConfig.SERVER_URL}login`, {email, password})).data;
        } catch (e) {
            return null;
        }
    }

    const handleClose = useCallback((event, reason) => {
        if (reason == 'clicaway') return;
        setErrorMessage('');
    })

    return (
        <>
            <Head>
                <title>
                    Login | Sapien Eleven
                </title>
            </Head>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div>
                        <Stack
                            spacing={1}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="h4">
                                Login
                            </Typography>
                        </Stack>
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack spacing={3}>
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
                                <TextField
                                    error={!!(formik.touched.password
                                        && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password
                                        && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
                                />
                            </Stack>
                            {formik.errors.submit && (
                                <Typography
                                    color="error"
                                    sx={{ mt: 3 }}
                                    variant="body2"
                                >
                                    {formik.errors.submit}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                size="large"
                                sx={{ mt: 5 }}
                                type="submit"
                                variant="contained"
                            >
                                Continue
                            </Button>
                        </form>
                    </div>
                </Box>
            </Box>
            <Snackbar open={errorMessage !== ''} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant={'filled'} >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

Page.getLayout = (page) => (
    <AuthLayout>
        {page}
    </AuthLayout>
);

export default Page;
