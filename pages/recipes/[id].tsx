/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'
import { Recipe, RecipeStep } from '.'
import { query } from '../api/db'
import styles from './[id].module.css'
import { toFraction } from '@/lib/utils'

interface Props {
    recipe: Recipe
}

export default function RecipePage({ recipe }: Props) {

    console.log(JSON.stringify(recipe));

    const router = useRouter();

    const [ isDeleted, setIsDeleted ] = useState(false);

    async function handleDelete(e: MouseEvent) {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/recipes`, {
                method: "DELETE",
                body: JSON.stringify({ id: recipe.id}),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
    
            console.log(`%c${jsonResponse.message}`, "color:green");
            setIsDeleted(true);
        } catch (error) {
            console.log({error});
        }
    }

    useEffect(() => {
        if (isDeleted) {
            router.push("/recipes");
        }
    }, [isDeleted])

    return (
        <Layout title={`Recipe - ${recipe.name}`}>
            <h1 className={styles.heading}>{recipe.name}</h1>

            <section className={styles.recipeInfo}>
                <p className={styles.description}>{recipe.description}</p>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>Course</th>
                            <td>{recipe.course_id}</td>
                        </tr>
                        <tr>
                            <th>Serves</th>
                            <td>{recipe.serves}</td>
                        </tr>
                        <tr>
                            <th>Preparation Time</th>
                            <td>{recipe.prep_time} minutes</td>
                        </tr>
                        <tr>
                            <th>Cooking Time</th>
                            <td>{recipe.cook_time} minutes</td>
                        </tr>
                    </tbody>
                </table>

            </section>

            <section className={styles.ingredients}>
                <h2 className={styles.heading2}>Ingredients</h2>
                <ul className={styles.ingredientList}>
                    {recipe.ingredients?.map((ingredient, index) => {
                        return (
                            <li key={index} className={styles.ingredientListItem}>{`${toFraction(ingredient.amount)} ${ingredient.unit} - ${ingredient.name}`}</li>
                        );
                    })}
                </ul>
            </section>

            <section className={styles.steps}>
                <h2 className={styles.heading2}>Steps</h2>
                <ol className={styles.stepList}>
                    {(recipe.steps as RecipeStep[]).map((step, index) => {
                        return (
                            <li key={index} className={styles.stepListItem}>{step.description}</li>
                        );
                    })}
                </ol>
            </section>

            <input className={styles.editButton} type="button" value="Edit" onClick={() => {router.push(`/recipes/edit/${recipe.id}`)}} />
            <input className={styles.deleteButton} type="button" value="Delete" onClick={handleDelete} />
            
        </Layout>
    )
};

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    let result;

    result = await query("SELECT * FROM recipes WHERE id = $1", [params?.id]);
    const recipe = result.rows[0];

    result = await query("SELECT ingredients.name AS name, units.name AS unit, recipes_ingredients.amount AS amount FROM recipes_ingredients JOIN ingredients ON recipes_ingredients.ingredient_id = ingredients.id JOIN units ON ingredients.unit_id = units.id WHERE recipes_ingredients.recipe_id = $1", [params?.id]);
    recipe.ingredients = result.rows.sort((a: {name: string}, b: {name: string}) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);

    result = await query("SELECT id, step_number, description FROM steps WHERE recipe_id = $1", [params?.id]);
    recipe.steps = result.rows.sort((a: {step_number: number}, b: {step_number: number}) => a.step_number > b.step_number ? 1 : a.step_number === b.step_number ? 0 : -1);

    return {
        props: {
            recipe
        }
    };
};
