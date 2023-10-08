import Layout from "@/components/Layout";
import { ShoppingList } from "@/lib/types";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { query } from "../../lib/db";
import { useSession } from "next-auth/react";
import AccessDenied from "@/components/AccessDenied";

export default function ShoppingLists({ shoppingLists }: {shoppingLists: ShoppingList[]}) {

    const { data: session } = useSession();
    if (!session) {
        return (
            <Layout title="Access Denied">
                <AccessDenied />
            </Layout>
        );
    }

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