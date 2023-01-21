import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";

interface LayoutComponentProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutComponentProps) => {

    const router = useRouter();

    return (
        <>
            <Head>
                <link rel="icon" href="/cookbook.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <nav className={styles.navBar}>
                <Link className={styles.homeLink} href="/"><Image src="/cookbook.ico" width="50" height="50" alt="Cook book"></Image></Link>
                <ul className={styles.navList}>
                    <li className={styles.navListItem}>
                        <Link className={router.pathname.match(/\/ingredients/) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink} href="/ingredients">Ingredients</Link>
                    </li>
                </ul>
            </nav>

            <main className={styles.children}>{children}</main>

            
        </>
    );
}

export default Layout;