import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import React, { Key } from 'react'
import { query } from '../../lib/db'
import styles from '@/styles/recipes/index.module.css';
import Link from 'next/link';
import { Recipe } from '@/lib/types';

interface Props {
    recipes: Recipe[]
};

export default function Recipes({ recipes }: Props) {
    return (
        <Layout title='Recipes'>
            <h1 className={styles.heading}>Recipes</h1>
            <ul className={styles.list}>
                {recipes.map(recipe => {
                    return (
                    <li className={styles.listItem} key={recipe.id as Key}>
                        <Link className={styles.listLink} href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                    </li>
                )})}
            </ul>
            <Link className={styles.button} href="/recipes/add">Add Recipe</Link>           
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const result = await query("SELECT * FROM recipes");
    const recipes: Recipe[] = result.rows;

    recipes.sort((a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });

    return {
        props: {
            recipes
        }
    };
};
