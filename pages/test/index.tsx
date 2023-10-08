import Field from '@/components/Field';
import Form from '@/components/Form'
import FormList from '@/components/FormList';
import FormSet from '@/components/FormSet';
import Layout from '@/components/Layout'
import React from 'react'

function Test() {

    const state = {
        email: "",
        username: "",
        age: 0,
        friends: [
            {name: 'Rob', age: 33},
            {name: 'Daniel', age: 35}
        ],
        lists2: [
            [1,2,3],
            [4,5,6]
        ]
    }

    function handleSubmit(values: any) {
        alert(JSON.stringify(values));
    }

    return (
        <Layout title="test">

            <h1>Testing Components</h1>

            <h2>Form</h2>
            <Form initialState={state} onSubmit={handleSubmit}>
                <Field type="email" name="email"></Field>
                <Field type="text" name="username"></Field>
                <Field type="number" name="age"></Field>
                <button type='submit'>submit</button>

                <h3>FormList</h3>
                <FormList name='friends'>
                    <FormSet name="">
                        <Field type="text" name="name" />
                        <Field type="number" name='age' />
                    </FormSet>
                </FormList>

                <h3>FormList in FormList</h3>
                <FormList name='lists2'>
                    <FormList name=''>
                        <Field type="number" />
                    </FormList>
                </FormList>
            </Form>
        
        </Layout>
    )
}

export default Test
