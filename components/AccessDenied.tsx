import { signIn } from 'next-auth/react';
import React from 'react';
import styles from '@/styles/components/accessDenied.module.css';

function AccessDenied() {
    return (
        <>
            <h1>Access Denied</h1>
            <p>Please log in to view this page</p>
            <button className={styles.loginButton} onClick={() => signIn()}>Log In</button>
        </>
    );
}

export default AccessDenied