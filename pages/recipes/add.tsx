import Layout from '@/components/Layout';
import { GetServerSidePropsContext } from 'next';
import React, { ChangeEvent, MouseEvent, useReducer } from 'react';
import { query } from '../api/db';
import { Ingredient } from '../ingredients';
import styles from './add.module.css';
import reducer, { ACTION, initialState } from './recipeReducer';

interface Props {
    ingredients: Ingredient[];
}

export default function Add(props: Props) {

    const [ recipe, dispatch ] = useReducer(reducer, initialState);

    function getTargetValue(target: EventTarget & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)) {
        let value;

        switch (target.dataset.type) {
            case 'string':
                value = target.value.toString();
                break;
            case 'number':
                value = Number(target.value);
                break;
        }
        return value;
    }

    function infoChangeHandler({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
        console.log(target.dataset.index);
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

    return (
        <Layout title={`Add Recipe`}>

            <h1 className={styles.heading}>Add Recipe</h1>

            <form className={styles.form} action="submit">
                <input className={styles.name} type="text" name='name' id='name' value={recipe.name} onChange={infoChangeHandler} placeholder='Name' data-type='string' />

                <fieldset className={styles.recipeInfo}>
                    <textarea className={styles.description} name='description' id='description' placeholder='Recipe description' value={recipe.description} onChange={infoChangeHandler} data-type='string'></textarea>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>Course</th>
                                <td>
                                    <input className={styles.formControl} type="text" name='course' id='course' value={recipe.course} onChange={infoChangeHandler} data-type='string' />
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
                                    <select className={styles.ingredientFormControl} name="ingredient_id" value={recipeIngredient.ingredient_id} onChange={ingredientChangeHandler} data-type='number' data-index={index}>
                                        <option value={-1} disabled>Select Ingredient</option>
                                        {props.ingredients.map((ingredient, i) => {
                                            return (
                                                <option key={i} value={ingredient.id}>{ingredient.name}</option>
                                            )
                                        })}
                                    </select>
                                    <input className={styles.ingredientFormControl} type="number" name='amount' value={recipeIngredient.amount} onChange={ingredientChangeHandler} data-type='number' data-index={index} />
                                    <span key={index}>{props.ingredients.map(ingredient => ingredient.id === recipeIngredient.ingredient_id && ingredient.unit)}</span>
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
            </form>
        
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let result;

    result = await query("SELECT ingredients.id AS id, ingredients.name AS name, units.name AS unit FROM ingredients JOIN units ON ingredients.unit_id = units.id");
    const ingredients = result.rows.sort((a: Ingredient, b: Ingredient) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);

    return {
        props: {
            ingredients
        }
    };
};
