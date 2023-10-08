/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'
import { query } from '../../lib/db'
import styles from '@/styles/recipes/recipe.module.css'
import { capitalize, toFraction } from '@/lib/utils'
import { Recipe, RecipeIngredient, Step } from '@/lib/types'
import { useSession } from 'next-auth/react'
import AccessDenied from '@/components/AccessDenied'

interface Props {
    recipe: Recipe
}

export default function RecipePage({ recipe }: Props) {

    const router = useRouter();

    const [ isDeleted, setIsDeleted ] = useState(false);

    useEffect(() => {
        if (isDeleted) {
            router.push("/recipes");
        }
    }, [isDeleted])

    const { data: session } = useSession();
    if (!session) {
        return (
            <Layout title="Access Denied">
                <AccessDenied />
            </Layout>
        );
    }

    async function handleDelete(e: MouseEvent) {
        e.preventDefault();

        try {
            const response = await fetch(`${window.location.origin}/api/recipes`, {
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

    return (
        <Layout title={`Recipe - ${recipe.name}`}>
            <h1 className={styles.heading}>{recipe.name}</h1>

            <section className={styles.recipeInfo}>
                <p className={styles.description}>{recipe.description}</p>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>Course</th>
                            <td>{capitalize(recipe.course!)}</td>
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
                    {recipe.ingredients.map((ingredient, index) => {
                        return (
                            <li key={index} className={styles.ingredientListItem}>{`${toFraction(ingredient.amount)} ${ingredient.unit} - ${ingredient.name}`}</li>
                        );
                    })}
                </ul>
            </section>

            <section className={styles.steps}>
                <h2 className={styles.heading2}>Steps</h2>
                <ol className={styles.stepList}>
                    {recipe.steps.map((step, index) => {
                        return (
                            <li key={index} className={styles.stepListItem}>{step}</li>
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

    result = await query("SELECT recipes.id, recipes.name, recipes.description, courses.name AS course, recipes.serves, recipes.prep_time, recipes.cook_time FROM recipes JOIN courses ON recipes.course_id = courses.id WHERE recipes.id = $1", [params?.id] as string[]);
    const recipe: Recipe = result.rows[0];

    result = await query("SELECT ingredients.name AS name, units.name AS unit, recipes_ingredients.amount AS amount FROM recipes_ingredients JOIN ingredients ON recipes_ingredients.ingredient_id = ingredients.id JOIN units ON ingredients.unit_id = units.id WHERE recipes_ingredients.recipe_id = $1", [params?.id] as string[]);
    const ingredients: RecipeIngredient[] = result.rows;
    recipe.ingredients = ingredients.sort((a, b) => a.name! > b.name! ? 1 : a.name === b.name ? 0 : -1);

    result = await query("SELECT id, step_number, description FROM steps WHERE recipe_id = $1", [params?.id] as string[]);
    const steps: Step[] = result.rows;
    steps.sort((a, b) => a.step_number > b.step_number ? 1 : a.step_number === b.step_number ? 0 : -1);
    recipe.steps = steps.map(step => step.description);

    return {
        props: {
            recipe
        }
    };
};
