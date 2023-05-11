import React, { ChangeEvent, useState, MouseEvent } from 'react';
import styles from '@/styles/ingredients/add.module.css';
import { Category, Ingredient, Unit } from '@/lib/types';

interface Props {
    units: Unit[],
    categories: Category[],
    onSubmit(ingredient: Ingredient): void,
    initialIngredient?: Ingredient
    title: string
}

function IngredientForm(props: Props) {

    const [ ingredient, setIngredient ] = useState(props.initialIngredient ? props.initialIngredient : {
        name: "",
        unit_id: 0,
        category_id: 0
    });

    function handleChange({target}: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setIngredient(prevIngredient => {
            return {
                ...prevIngredient,
                [target.name]: target.value
            };
        });
    };

    function handleSubmit(e: MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        props.onSubmit(ingredient);
    }

    return (
        <>
            <h1 className={styles.heading}>{props.title}</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.formControl} name='name' id='name' type="text" value={ingredient.name} onChange={handleChange} placeholder="Name" />

                <select className={styles.formControl} name="unit_id" id="unit_id" onChange={handleChange} value={ingredient.unit_id}>
                    <option value="0" disabled>Select a unit</option>
                    {props.units.map(unit => {
                        return <option value={unit.id} key={unit.id}>{unit.name} ({unit.abbreviation})</option>
                    })}
                </select>

                <select className={styles.formControl} name="category_id" id="category_id" onChange={handleChange} value={ingredient.category_id}>
                    <option value="0" disabled>Select a category</option>
                    {props.categories.map(category => {
                        return <option value={category.id} key={category.id}>{category.name}</option>
                    })}
                </select>

                <input className={styles.button} type="submit" value="Save" />
            </form>
        </>
    )
}

export default IngredientForm
