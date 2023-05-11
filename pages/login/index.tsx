import Layout from '@/components/Layout';
import React, { useState } from 'react';
import styles from '@/styles/login.module.css';
import { useRouter } from 'next/router';
import { getTargetValue } from '@/lib/utils';

function Login() {

    const router = useRouter();

    const [ creds, setCreds ] = useState({
        username: '',
        password: ''
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCreds(prev => {
            return {
                ...prev,
                [e.target.name]: getTargetValue(e.target)
            }
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await fetch(`${window.location.origin}/api/login`, {
                method: 'POST',
                body: JSON.stringify(creds),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error("Log in error");
            }

            router.push('/');

        } catch(error) {
            if (error instanceof Error) console.log(error.message);
        }
    }


    return (
        <Layout title='Log In'>
            <h1 className={styles.heading}>Log In</h1>

            <form className={styles.form} action="submit" onSubmit={handleSubmit}>

                <input className={styles.formControl} type="text" name='username' id='username' value={creds.username} onChange={handleChange} data-type='string' placeholder='Username' />

                <input className={styles.formControl} type="password" name="password" id="password" value={creds.password} onChange={handleChange} data-type='string' placeholder='Password' />

                <input className={styles.button} type="submit" value='Log In' />
            </form>
        </Layout>
    );
}

export default Login;
