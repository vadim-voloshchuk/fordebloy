import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import styles from './help.module.css';
import graph_model from './assets/graph_model.png';
import jsImage from './assets/js.png';
import flask from './assets/flask.png';
import mysql from './assets/Mysql.png';
import networkx from './assets/networkx.png';
import python from './assets/Python.png';
import reactImg from './assets/React.png';
import visjs from './assets/visjs.png';
import Footer from './Footer/footer';

const HelpPage = () => {
    return (
    <>
        <Container>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px' }}>Основная информация</p>
                <p style={{ textAlign: 'justify' }}>
                    Данный проект реализован в рамках выпускной квалификационной работы и
                    предназначена для исследователей и аналитиков, работающих с крупными и сложными графами,
                    и предоставляет мощный инструмент для визуального анализа взаимосвязей и структур в графовых данных.
                </p>
                <p style={{ textAlign: 'justify' }}>
                    Работа включает в себя разработку подхода CRUD для всех элементов графа,
                    что позволяет пользователям создавать, просматривать, обновлять и удалять узлы и связи.
                    Также в работе детально описываются настройки физических параметров визуализации и
                    подмодули системы, обеспечивающие полное управление данными графа.
                </p>
                <p style={{ textAlign: 'justify' }}>
                    Граф представлен в виде математической структуры, называемой «граф» или «сеть»,
                    которая состоит из набора узлов (также известных как вершины) и набора ребер (также известных
                    как связи или соединения), которые соединяют пары узлов.
                    Для моделирования взаимодействия субъектов в организационных системах используется нечеткий граф
                    с множественными и разнотипными связями:
                </p>
                <img src={graph_model} alt='graph_model' />
                <p style={{ textAlign: 'justify' }}>заданный нечеткими множествами вершин и связей Gʹv и Gʹe, соответственно.
                    Вершины и связи в таком графе являются разнотипными.
                </p>
            </div>

            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px' }}>Стэк технологий</p>
                <div className={styles.cont_image}>
                    <img className={styles.stack_img} src={jsImage} alt="js" />
                    <img className={styles.stack_img} src={flask} alt="js" />
                    <img className={styles.stack_img} src={networkx} alt="js" />
                    <img className={styles.stack_img} src={python} alt="js" />
                    <img className={styles.stack_img} src={reactImg} alt="js" />
                </div>
                <div className={styles.cont_image_big}>
                    <img className={styles.stack_img_big} src={mysql} alt="js" />
                    <img className={styles.stack_img_big_vis} src={visjs} alt="js" />
                </div>
            </div>

        </Container>
        <Footer />
    </>
    );
};

export default HelpPage;
