import Link from "next/link";
import Layout from "@/components/Layout";
import React from 'react'

export default function PageNotFound() {
    return (
        <Layout title="Page Not Found">
            <h1>404 - Page Not Found</h1>
            <Link href="/">Back to home</Link>
        </Layout>
    )
}
