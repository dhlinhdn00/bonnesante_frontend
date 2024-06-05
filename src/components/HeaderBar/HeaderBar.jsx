import React from 'react'
import style from './HeaderBar.module.css'
import { Link } from 'react-router-dom'
import useUserContext from '../../hooks/useUserContext'
import LogoBK from "../../assets/images/LogoDHBK.jpg";
import LogoFast from "../../assets/images/FAST.png";
import { get } from 'lodash';

const HeaderBar = () => {
    const { user, saveUser } = useUserContext();
    const username = user ? user.username : null;
    function logout() {
        saveUser(null);
    }
    const getUrl = window.location.href;

    if (getUrl.includes('home')) {
        return (
            <div className={style.header}>
                <Link to={username ? '/user' : '/login'}>
                    <ion-icon name="person-circle-outline"></ion-icon>
                </Link>
                <img src={LogoFast} alt="logoFast" className={style.logoFast} />
                <h3>{username ? 'Hello, ' + username : 'Blood Pressure'}</h3>
                <img src={LogoBK} alt="logoBk" className={style.logoBk} />
                {username ?
                    <Link onClick={logout} to='/' className={style.logout}>
                        <ion-icon name="log-out-outline"></ion-icon>
                    </Link> : <ion-icon name="settings-outline"></ion-icon>}
            </div>
        )
    }
    return (
        <div className={style.header}>
            <Link to='/home'>
                <ion-icon name="home-outline"></ion-icon>
            </Link>
            <img src={LogoFast} alt="logoFast" className={style.logoFast} />
            <h3>{username ? 'Hello, ' + username : 'Blood Pressure'}</h3>
            <img src={LogoBK} alt="logoBk" className={style.logoBk} />
            {username ?
                <Link onClick={logout} to='/' className={style.logout}>
                    <ion-icon name="log-out-outline"></ion-icon>
                </Link> : null}
        </div>
    )
}
export default HeaderBar
