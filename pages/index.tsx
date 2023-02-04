import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import styles from '@/styles/Home.module.css';
import { useState, MouseEvent } from 'react';

export default function Home() {

    const [isOpen, setIsOpen] = useState(false);

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsOpen(true);
    }
    
    return (
        <>
            <Layout title='Home'>
                <h1>Modal test</h1>
                <button onClick={handleClick}>Open Modal</button>
                <Modal open={isOpen} setOpen={setIsOpen}>
                </Modal>
            </Layout>
        </>
    )
}
