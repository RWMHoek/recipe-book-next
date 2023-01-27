import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import React, { Key } from 'react'
import { query } from '../api/db'
import styles from './index.module.css';
import Link from 'next/link';

export interface RecipeIngredient {
    ingredient_id?: number,
    name?: string,
    unit?: string,
    amount: number
}

export interface RecipeStep {
    id?: number,
    recipe_id?: number,
    step_number: number,
    description: string
}

export interface Recipe {
    id?: number,
    name: string,
    description: string,
    course_id: number,
    serves: number,
    prep_time: number,
    cook_time: number,
    ingredients: RecipeIngredient[],
    steps: RecipeStep[] | string[]
};

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
    const recipes = result.rows;

    recipes.sort((a:Recipe, b: Recipe) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });

    console.log(recipes);

    return {
        props: {
            recipes
        }
    };
};
