import React from 'react';
import { Link } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi';
import './style.css'

import logo from '../../assets/logo.svg'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>

                <main>

                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>
                        Ajudamos pessoas a encontrar pontos de coleta
                        de forma eficiente.
                    </p>

                    <Link to="/create">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>
                            Cadastre um  ponto de coleta
                        </strong>
                    </Link>
                </main>

            </div>
        </div>

    );
};

export default Home
