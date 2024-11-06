import React from 'react';
import styles from './landingPage.module.css';
import tanya from './assets/tanya.png';
import bovaev from './assets/bovaev.png';
import vadim from './assets/vadim.png';
import land2 from './assets/land2.png';
import {  Button } from '@mui/material'; // Импортируем компоненты Material UI
import { Link } from 'react-router-dom'; // Импортируем компонент Link для маршрутизации
import Footer from './Footer/footer';

const LandingPage = () => {
    return (
        <div className={styles.landing_page}>
          <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>О проекте</p>
          <section className={styles.first_section}>
            <img src={land2} alt='land2' />
            <p className={styles.text_p}>
              Веб-сервис состоит из трех ключевых компонентов,
              которые взаимосвязаны между собой и представляют
              единый продукт. Проект состоит из: модуля хранения данных,
              блока обработки и расчета параметров графов, а также секции визуализации
              графических моделей. Этот инструмент предназначен для интерактивного исследования и анализа
              графовых данных, улучшая тем самым процесс анализа информации через удобный интерфейс работы
              с графическими моделями.
            </p>
            {/* <img src={land} alt='land' style={{ width: '500px' }} /> */}

          </section>

          <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>О команде</p>
            <section className={styles.section__aboutUs}>
              <div className={styles.about_team}>
                <div className={styles.tanya}>
                  <img className={styles.team_img} src={tanya} alt='tanya' />
                  <p>
                    <p>Татьяна Прожик Владимировна,</p>
                    Реализовала модуль алгоритмов хранения и обработки
                    графов с учетом множественных разнотипных связей
                  </p>
                </div>

                <div className={styles.bars}>
                  <img className={styles.team_img} src={bovaev} alt='bovaev' />
                  <p>
                    <p>Боваев Арслан Батырович,</p>
                    Реализовал модуль динамической и интерактивной визуализации графов
                    с множественными разнотипными связями
                  </p>
                </div>

                <div className={styles.vadiv}>
                  <img className={styles.team_img} src={vadim} alt='vadim' />
                  <p>
                    <p>Волощук Вадим Игоревич,</p>
                    Программная реализация специализированных алгоритмов анализа графов в формате интегрируемого модуля
                  </p>
                </div>
              </div>
            </section>

            <p style={{ paddingTop: '20px', textAlign: 'center' }}>
            Если вы хотите начать работу с графами,
            то нажимайте кнопку "Начать". <p>Если все еще остались вопросы, тогда переходите по кнопки "Узнать больше",
            чтобы узнать нас получше</p></p>
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
