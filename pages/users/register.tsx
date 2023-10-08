import Layout from '@/components/Layout';
import React, { ChangeEvent, FocusEvent, FormEvent, useState } from 'react'
import styles from '@/styles/users/register.module.css';
import { useRouter } from 'next/router';

function Register() {

    const router = useRouter();

    const [ data, setData ] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [ errors, setErrors ] = useState<{[key: string]: string[]}>({
        username: [],
        email: [],
        password: [],
        confirmPassword: [],
        api: []
    });

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        setData({
            ...data,
            [target.name]: target.value
        });

        if (target.name === 'username' || target.name === 'email') {
            setErrors({
                ...errors,
                api: []
            });
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!isDataValid()) {
            console.log('Unable to proceed due to errors in data.');
            return;
        }

        setErrors({
            ...errors,
            api: []
        });

        try {
            const response = await fetch(`${window.location.origin}/api/users`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const jsonResponse = await response.json();

            if(response.ok) {
                console.log(jsonResponse);
                router.push('/');
            } else {
                setErrors({
                    ...errors,
                    api: jsonResponse.errors
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    function handleBlur({target}: FocusEvent<HTMLInputElement>) {
        const { name, value } = target;

        const specialChars = /[ `!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~-]/;
        const passwordSpecialChars =  /[!#\$%&\(\)\*\+,.:;<=>\?@\[\]\^_\|~-]/;
        const passwordForbiddenChars = /[^!#\$%&\(\)\*\+,.:;<=>\?@\[\]\^_\|~a-zA-Z0-9-]/;
        const validEmail = /^[a-zA-Z0-9`~!@#$%^&*_+={}|/?-]+(?:\.[a-zA-Z0-9`~!@#$%^&*_+={}|/?-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        
        setErrors({
            ...errors,
            [name]: []
        });

        if (!value) return;

        const e: string[] = []

        switch (name) {
            case "username":

                if (value.length < 6) e.push('Username must be at least 6 characters long.');
                if (value.length > 20) e.push('Username Cannot have more than 20 characters.');
                if (specialChars.test(value)) e.push('Username cannot contain any special characters');

                break;
            case "email":

                if (!validEmail.test(value)) e.push('Invalid email address.');

                break;
            case "password":

                if (!/[a-z]/.test(value)) e.push('Password must contain at least one lower case letter.');
                if (!/[A-Z]/.test(value)) e.push('Password must contain at least one upper case letter.');
                if (!/[0-9]/.test(value)) e.push('Password must contain at least one numerical character.');
                if (!passwordSpecialChars.test(value)) e.push('Password must contain at least one special character.');
                if (passwordForbiddenChars.test(value)) e.push('Password cannot contain characters other than letters, numbers, or the following special characters: !#$%&()*+,.:;<=>?@[]^_|~-');
                if (value.length < 10) e.push('Password must be at least 10 characters long.');

                break;
            case "confirmPassword":

                break;
            default:
                console.log(`Unhandled blur case for ${name} field!`);
                break;
        }

        setErrors({
            ...errors,
            [name]: e,
            confirmPassword: (data.password && data.confirmPassword && data.password !== data.confirmPassword) ? ['Passwords do not match.'] : []
        });
    }

    function isDataValid(): Boolean {
        const currentErrors = Object.keys(errors).reduce((prev, curr) => {
            return prev + errors[curr].length;
        }, 0);

        return currentErrors ? false : true;
    }

    return (
        <Layout title='Register'>
            <h1 className={styles.heading}>New User</h1>

            <form className={styles.form} onSubmit={handleSubmit}>

                {errors.api.map((error, index) => {
                    return (
                        <p key={index} className={styles.error}>{error}</p>
                    );
                })}

                <input className={styles.formControl} type="text" name='username' id='username' placeholder='Username' onChange={handleChange} value={data.username} onBlur={handleBlur} />
                {errors.username.map((error, index) => {
                    return (
                        <p key={index} className={styles.error}>{error}</p>
                    );
                })}

                <input className={styles.formControl} type="email" name='email' id='email' placeholder='Email Address' onChange={handleChange} value={data.email} onBlur={handleBlur} />
                {errors.email.map((error, index) => {
                    return (
                        <p key={index} className={styles.error}>{error}</p>
                    );
                })}

                <input className={styles.formControl} type="password" name="password" id="password" placeholder='Password' onChange={handleChange} value={data.password} onBlur={handleBlur} />
                {errors.password.map((error, index) => {
                    return (
                        <p key={index} className={styles.error}>{error}</p>
                    );
                })}

                <input className={styles.formControl} type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm Password' onChange={handleChange} value={data.confirmPassword} onBlur={handleBlur} />
                {errors.confirmPassword.map((error, index) => {
                    return (
                        <p key={index} className={styles.error}>{error}</p>
                    );
                })}

                <input className={styles.button} type="submit" value='Register' />
            </form>
        </Layout>
    );
}

export default Register;
