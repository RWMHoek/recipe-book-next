import Layout from '@/components/Layout';
import React from 'react';
import styles from '@/styles/login.module.css';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';

function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <Layout title='Log In'>
            <h1 className={styles.heading}>Log In</h1>

            <form className={styles.form} method='POST' action='/api/auth/callback/credentials'>

                <input type="hidden" name='csrfToken' defaultValue={csrfToken} />

                <input className={styles.formControl} type="text" name='username' id='username' placeholder='Username' />

                <input className={styles.formControl} type="password" name="password" id="password" placeholder='Password' />

                <input className={styles.button} type="submit" value='Log In' />
            </form>

            <Link href='/users/register'>New here? Click to register!</Link>
        </Layout>
    );
}

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context)
        }
    }
};