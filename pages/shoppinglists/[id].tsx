import Layout from '@/components/Layout';
import { RecipeIngredient, ShoppingList, ShoppingListRecipe } from '@/lib/types';
import { toFraction } from '@/lib/utils';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { query } from '../../lib/db';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/AccessDenied';

interface Props {
    shoppingList: ShoppingList
};

export default function ShoppingListPage({shoppingList}: Props) {

    const { data: session } = useSession();
    if (!session) {
        return (
            <Layout title="Access Denied">
                <AccessDenied />
            </Layout>
        );
    }

    return (
        <Layout title={`Shopping Lists - ${shoppingList.name}`}>
            
            <h1>{shoppingList.name}</h1>
            <h2>Recipes</h2>
            <ul>
                {shoppingList.recipes?.map((recipe: ShoppingListRecipe, index: number) => {
                    return (
                        <li key={index}>{recipe.name}</li>
                    )
                })}
            </ul>

            <h2>Ingredients</h2>
            <ul>
                {shoppingList.totalIngredients?.map((ingredient: RecipeIngredient, index: number) => {
                    return (
                        <li key={index}>{`${toFraction(ingredient.amount)} ${ingredient.unit} - ${ingredient.name}`}</li>
                    )
                })}
            </ul>
        
        </Layout>
    );
};

export async function getServerSideProps({params}: GetServerSidePropsContext) {
    let result = await query("SELECT * FROM shoppinglists WHERE id = $1", [params?.id] as string[]);
    const shoppingList: ShoppingList = result.rows[0];

    result = await query("SELECT shoppinglists_recipes.recipe_id AS id, recipes.name, shoppinglists_recipes.serves FROM shoppinglists_recipes JOIN recipes ON shoppinglists_recipes.recipe_id = recipes.id WHERE shoppinglist_id = $1", [params?.id] as string[]);
    shoppingList.recipes = result.rows;

    result = await query("SELECT shoppinglists_ingredients.ingredient_id AS id, ingredients.name, units.abbreviation AS unit, shoppinglists_ingredients.amount FROM shoppinglists_ingredients JOIN ingredients ON shoppinglists_ingredients.ingredient_id = ingredients.id JOIN units ON ingredients.unit_id = units.id WHERE shoppinglist_id = $1", [params?.id] as string[]);
    shoppingList.extraIngredients = result.rows;
    shoppingList.extraIngredients.sort((a, b) => a.name! > b.name! ? 1 : a.name === b.name ? 0 : -1);

    const conditions: string[] = shoppingList.recipes.map((recipe: ShoppingListRecipe, index: number) => {
        return `recipe_id = $${index + 1}`;
    });
    const parameters: number[] = shoppingList.recipes.map((recipe: ShoppingListRecipe) => {
        return recipe.id;
    });
    const queryString: string = "SELECT recipes_ingredients.ingredient_id AS id, ingredients.name, units.abbreviation AS unit, recipes_ingredients.amount FROM recipes_ingredients JOIN ingredients ON recipes_ingredients.ingredient_id = ingredients.id JOIN units ON ingredients.unit_id = units.id WHERE " + conditions.join(" OR ");

    result = await query(queryString, parameters);
    shoppingList.totalIngredients = result.rows.reduce((list: RecipeIngredient[], value: RecipeIngredient) => {
        let isNew = true;

        list.forEach(ingredient => {
            if (ingredient.id === value.id) {
                isNew = false;
                ingredient.amount += value.amount;
            }
        });

        if (isNew) {
            list.push(value);
        }

        return list;

    }, [...shoppingList.extraIngredients]);

    return {
        props: {
            shoppingList
        }
    };
};