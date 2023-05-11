import { Ingredient } from '@/lib/types'
import React from 'react'
import styles from '@/styles/ingredients/ingredient.module.css'

interface Props {
    ingredient: Ingredient
}

function IngredientInfo(props: Props) {
    return (
        <>
            <h1 className={styles.heading}>
                {props.ingredient.name}
            </h1>

            <p>{props.ingredient.unit}</p>

            <p>{props.ingredient.category}</p>
        </>
    )
}

export default IngredientInfo
