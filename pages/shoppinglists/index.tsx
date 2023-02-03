import Layout from "@/components/Layout";
import { ShoppingList } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { query } from "../api/db";

export default function ShoppingLists({ shoppingLists }: {shoppingLists: ShoppingList[]}) {
    return (
        <Layout title="Shopping Lists">
            <h1>Shopping Lists</h1>
            <ul>
                {shoppingLists.map((shoppingList, index) => {
                    return (
                        <li key={index}>
                            <Link href={`/shoppinglists/${shoppingList.id}`}>
                                {shoppingList.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const result = await query("SELECT * FROM shoppinglists");
    const shoppingLists: ShoppingList[] = result.rows;

    return {
        props: {
            shoppingLists
        }
    };
};