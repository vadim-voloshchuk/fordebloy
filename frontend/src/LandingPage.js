import React from 'react';
import styles from './landingPage.module.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Footer from './Footer/footer';
import GraphBackground from './components/GraphBackground';
import { FaGithub, FaTelegramPlane, FaGlobe } from 'react-icons/fa';
import MicroGraphCircle from './components/MicroGraphCircle';

const LandingPage = () => {
    return (
        <div className={styles.landing_page}>
            <GraphBackground />
            <div className={styles.graph_background}></div>

            <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>О проекте</p>
            <section className={styles.first_section}>
                <MicroGraphCircle />
                <p className={styles.text_p}>
                    <strong>NeuroWeave</strong> — это веб-сервис для интерактивного анализа графов. Он объединяет мощный бэкенд на FastAPI
                    с визуальным фронтендом, предоставляя удобный способ создавать, исследовать и анализировать графовые модели
                    с учетом типов связей и узлов.
                </p>
            </section>

            <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>Разработчики</p>
            <section className={styles.section__aboutUs}>
                <div className={styles.about_team}>
                    <div className={styles.vadiv}>
                        <p>
                            <strong>Вадим Волощук</strong><br/>
                            Архитектура и алгоритмы графов, ML-интеграции, NeuroFlex<br/>
                            <a href="https://github.com/vadim-voloshchuk" target="_blank" rel="noreferrer">
                                <FaGithub /> GitHub
                            </a>{' '}
                            |
                            <a href="https://t.me/nosignalx2k" target="_blank" rel="noreferrer">
                                <FaTelegramPlane /> Telegram
                            </a>
                        </p>
                    </div>
                    <div className={styles.bars}>
                        <p>
                            <strong>Арслан Боваев</strong><br/>
                            Визуализация, UI, взаимодействие с пользователем<br/>
                            <a href="https://github.com/bovaev" target="_blank" rel="noreferrer">
                                <FaGithub /> GitHub
                            </a>{' '}
                            |
                            <a href="https://t.me/bovaev_ar" target="_blank" rel="noreferrer">
                                <FaTelegramPlane /> Telegram
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>Контакты</p>
            <section className={styles.section__aboutUs}>
                <div className={styles.about_team}>
                    <div className={styles.vadiv}>
                        <p>
                            <strong>NeuroFlex Project</strong><br/>
                            <a href="mailto:contact@neuroflex.ai">
                                contact@neuroflex.ai
                            </a><br/>
                            <a href="https://neuroflex.ai" target="_blank" rel="noreferrer">
                                <FaGlobe /> neuroflex.ai
                            </a><br/>
                            <a href="https://github.com/NeuroFlex-AI" target="_blank" rel="noreferrer">
                                <FaGithub /> GitHub
                            </a>{' '}
                            |
                            <a href="https://t.me/neuroflex_team" target="_blank" rel="noreferrer">
                                <FaTelegramPlane /> Telegram
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            <p style={{ paddingTop: '20px', textAlign: 'center' }}>
                Хотите начать работу с графами? Нажмите «Начать».<br/>
                Есть вопросы? Жмите «Узнать больше», чтобы получить помощь.
            </p>

            <section className={styles.third_section}>
                <Button sx={{ borderRadius: '100px', padding: '10px 15px' }} variant="contained" color="primary" component={Link} to="/workspace">
                    Начать
                </Button>
                <Button sx={{ borderRadius: '100px', padding: '10px 15px', marginTop: '10px' }} variant="outlined" color="primary" component={Link} to="/help">
                    Узнать больше
                </Button>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
