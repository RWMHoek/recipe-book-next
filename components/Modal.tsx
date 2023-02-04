import React, { ReactNode } from 'react';
import styles from '@/styles/ingredients/modal.module.css';
import ReactDOM from 'react-dom';

function Modal({ open, setOpen, children }: {open: boolean, setOpen(b: boolean): void, children: ReactNode}) {

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div className={styles.overlay}></div>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={() => setOpen(false)}>x</button>
                {children}
            </div>
        </>,
        document.getElementById('portal')!
    );
}

export default Modal;
