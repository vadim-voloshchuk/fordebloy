import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.company}>
                <div className={styles.logo}>

                </div>

                <h1 className={styles.title}>© GNETWORK, 2024</h1>
            </div>

            <div className={styles.contact}>
                <h1 className={styles.contact_text}>
                    Связаться с нами:<br/>
                    bovaev@sfedu.ru<br/>
                    +7 (988) 515 34 20
                </h1>
            </div>
        </div>
    );
};

export default Footer;
