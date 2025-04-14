import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.company}>
                <h1 className={styles.title}>© NeuroFlex, 2025</h1>
            </div>

            <div className={styles.contact}>
                <h1 className={styles.contact_text}>
                    Связаться с нами:<br />
                    contact@neuroflex.ai<br />
                    @neuroflex_team
                </h1>
            </div>
        </div>
    );
};

export default Footer;