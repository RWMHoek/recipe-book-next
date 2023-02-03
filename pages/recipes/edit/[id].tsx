/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '@/components/Layout'
import { query } from '@/pages/api/db'
import { GetServerSidePropsContext } from 'next'
import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useReducer, useState } from 'react'
import styles from "./[id].module.css";
import reducer, { ACTION } from '../recipeReducer'
import { getTargetValue } from '@/lib/utils';
import { useRouter } from 'next/router'
import { Course, Ingredient, Recipe, RecipeIngredient, Step } from '@/lib/types';

interface Props {
    recipe: Recipe,
    ingredients: Ingredient[],
    courses: Course[]
}

export default function EditRecipe(props: Props) {

    const router = useRouter();

    const [isUpdated, setIsUpdated] = useState(false);

    const [recipe, dispatch] = useReducer(reducer, props.recipe);

    function infoChangeHandler({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        dispatch({
            type: ACTION.CHANGE_INFO,
            payload: {
                name: target.name,
                value: getTargetValue(target)
            } 
        });
    }

    function addIngredient(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        dispatch({
            type: ACTION.ADD_INGREDIENT
        });
    }

    function ingredientChangeHandler({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        dispatch({
            type: ACTION.CHANGE_INGREDIENT,
            payload: {
                index: Number(target.dataset.index),
                name: target.name,
                value: getTargetValue(target)
            }
        });
    }

    function deleteIngredient(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        dispatch({
            type: ACTION.DELETE_INGREDIENT,
            payload: {
                index: Number(target.dataset.index)
            }
        });
    }

    function addStep(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        dispatch({
            type: ACTION.ADD_STEP,
            payload: {
                index: Number(target.dataset.index)
            }
        });
    }

    function changeStep({ target }: ChangeEvent<HTMLTextAreaElement>) {
        dispatch({
            type: ACTION.CHANGE_STEP,
            payload: {
                index: Number(target.dataset.index),
                value: getTargetValue(target)
            }
        });
    }

    function deleteStep(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;

        dispatch({
            type: ACTION.DELETE_STEP,
            payload: {
                index: Number(target.dataset.index)
            }
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/recipes`, {
                method: "PUT",
                body: JSON.stringify(recipe),
                headers: {
                  "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
            console.log(`%c${jsonResponse.message}`, "color: green");
            setIsUpdated(true);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`%c${error.message}`, "color: red");
            }
        }
    }
        
    useEffect(() => {
        if (isUpdated) {
            router.push(`/recipes/${recipe.id}`);    
        }
    }, [isUpdated]);
  
    return (
        <Layout title="Edit Recipe">

            <h1 className={styles.heading}>Edit Recipe</h1>

            <form className={styles.form} action="submit" onSubmit={handleSubmit}>
                <input className={styles.name} type="text" name='name' id='name' value={recipe.name} onChange={infoChangeHandler} placeholder='Name' data-type='string' />

                <fieldset className={styles.recipeInfo}>
                    <textarea className={styles.description} name='description' id='description' placeholder='Recipe description' value={recipe.description} onChange={infoChangeHandler} data-type='string'></textarea>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>Course</th>
                                <td>
                                    <select className={styles.formControl} name="course_id" id="course_id" value={recipe.course_id} onChange={infoChangeHandler} data-type="number" >
                                        <option value="-1" disabled>Select a course</option>
                                        {props.courses.map((course, index) => {
                                            return (
                                                <option key={index} value={course.id}>{course.name}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Serves</th>
                                <td>
                                    <input className={styles.formControl} type="number" name='serves' id='serves' value={recipe.serves} onChange={infoChangeHandler} data-type='number' />
                                </td>
                            </tr>
                            <tr>
                                <th>Preparation Time</th>
                                <td>
                                    <input className={styles.formControl} type="number" name='prep_time' id='prep_time' value={recipe.prep_time} onChange={infoChangeHandler} data-type='number' />
                                </td>
                            </tr>
                            <tr>
                                <th>Cooking Time</th>
                                <td>
                                    <input className={styles.formControl} type="number" name='cook_time' id='cook_time' value={recipe.cook_time} onChange={infoChangeHandler} data-type='number' />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>

                <fieldset className={styles.ingredients}>
                    <h2 className={styles.heading2}>Ingredients</h2>
                    <ul>
                        {recipe.ingredients.map((recipeIngredient, index) => {
                            return (
                                <li key={index}>
                                    <select className={styles.ingredientFormControl} name="id" value={recipeIngredient.id} onChange={ingredientChangeHandler} data-type='number' data-index={index}>
                                        <option value={-1} disabled>Select Ingredient</option>
                                        {props.ingredients.map((ingredient, i) => {
                                            return (
                                                <option key={i} value={ingredient.id}>{ingredient.name}</option>
                                            )
                                        })}
                                    </select>
                                    <input className={styles.ingredientFormControl} type="number" name='amount' value={recipeIngredient.amount} onChange={ingredientChangeHandler} data-type='number' data-index={index} />
                                    <span key={index}>
                                        {props.ingredients.map(ingredient => ingredient.id === recipeIngredient.id && ingredient.unit)}
                                    </span>
                                    <button className={styles.deleteButton} onClick={deleteIngredient} data-index={index} >x</button>
                                </li>
                            )
                        })}
                    </ul>
                    <button className={styles.addButton} onClick={addIngredient}>+</button>
                </fieldset>

                <fieldset className={styles.steps}>
                    <h2 className={styles.heading2}>Steps</h2>
                    <button className={styles.addButton} onClick={addStep}>+</button>
                    <ol className={styles.stepList}>
                        {recipe.steps.map((step, index) => {
                            return (
                                <li key={index}>
                                    <textarea className={styles.description} name="step" value={step} onChange={changeStep} placeholder='Instruction' data-type='string' data-index={index}></textarea>
                                    <button className={styles.deleteButton} onClick={deleteStep} data-index={index}>x</button><br />
                                    <button className={styles.addButton} onClick={addStep} data-index={index + 1}>+</button>
                                </li>
                            );
                        })}
                    </ol>
                </fieldset>
                <button type='submit' className={styles.saveButton}>Save</button>
            </form>
          
        </Layout>
    )
}

export async function getServerSideProps({params}: GetServerSidePropsContext) {

    let result = await query("SELECT * FROM recipes WHERE id = $1", [params?.id]);
    const recipe: Recipe = result.rows[0];

    result = await query("SELECT ingredient_id AS id, amount FROM recipes_ingredients WHERE recipe_id = $1", [params?.id]);
    const recipeIngredients: RecipeIngredient[] = result.rows;
    recipe.ingredients = recipeIngredients.sort((a, b) => a.name! > b.name! ? 1 : a.name === b.name ? 0 : -1);

    result = await query("SELECT * FROM steps WHERE recipe_id = $1", [params?.id]);
    const steps: Step[] = result.rows;
    steps.sort((a, b) => a.step_number > b.step_number ? 1 : a.step_number === b.step_number ? 0 : -1);
    recipe.steps = steps.map((step) => step.description);

    result = await query("SELECT * FROM courses");
    const courses: Course[] = result.rows;

    result = await query("SELECT ingredients.id, ingredients.name, units.name AS unit FROM ingredients JOIN units ON ingredients.unit_id = units.id");
    const ingredients: Ingredient[] = result.rows;

    return {
        props: {
            recipe,
            courses,
            ingredients
        }
    }
}
