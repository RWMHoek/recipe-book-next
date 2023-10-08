import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";
import { capitalize } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";

interface LayoutComponentProps {
    children: React.ReactNode,
    title: string
}

const Layout = ({ children, title }: LayoutComponentProps) => {

    const { data: session } = useSession();

    const router = useRouter();

    const links = [ "ingredients", "recipes", "shoppinglists" ];

    return (
        <>
            <Head>
                <link rel="icon" href="/cookbook.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{`RecipeBook - ${title}`}</title>
            </Head>

            <nav className={styles.navBarDesktop}>
                <Link className={styles.homeLink} href="/"><Image src="/cookbook.ico" width="50" height="50" alt="Cook book"></Image></Link>
                <ul className={styles.navList}>
                    {links.map((link, index) => {
                        const matchLink = new RegExp(`/${link}`);
                        const linkText = link === 'shoppinglists' ? 'shopping lists' : link;
                        return (
                            <li key={index} className={styles.navListItem}>
                                <Link className={router.pathname.match(matchLink) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink} href={`/${link}`}>{capitalize(linkText, {all: true})}</Link>
                            </li>
                        )
                    })}
                    <li key={"login"}>
                        {session ? (
                            <Link className={styles.navLink} onClick={() => signOut()} href='#'>{session.user.username}</Link>
                        ) : (
                            <Link className={styles.navLink} onClick={() => signIn()} href='#'>Log In</Link>
                        )}
                    </li>
                </ul>
            </nav>

            <nav className={styles.navBarMobile}>
                <Link className={styles.homeLink} href="/"><Image src="/cookbook.ico" width="50" height="50" alt="Cook book"></Image></Link>
                <ul className={styles.navList}>
                    {links.map((link, index) => {
                        const matchLink = new RegExp(`/${link}`);
                        const linkText = link === 'shoppinglists' ? 'shopping lists' : link;
                        return (
                            <li key={index} className={styles.navListItem}>
                                <Link className={router.pathname.match(matchLink) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink} href={`/${link}`}>
                                    <Image src={`/${link}.png`} width="48" height="48" alt={link}></Image>
                                </Link>
                            </li>
                        )
                    })}
                    <li key={"login"}>
                        {session ? (
                            <Link className={styles.navLink} onClick={() => signOut()} href='#'>{session.user.username}</Link>
                        ) : (
                            <Link className={styles.navLink} onClick={() => signIn()} href='#'>Log In</Link>
                        )}
                    </li>
                </ul>
            </nav>

            <main className={styles.children}>{children}</main>

        </>
    );
}

export default Layout;