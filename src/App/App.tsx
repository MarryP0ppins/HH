import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { ContractIcon } from 'assets';
import moment from 'moment';
import { AuthPage } from 'pages/AuthPage';
import { ContractsSigningPage } from 'pages/ContractsSigningPage';
import { MainPage } from 'pages/MainPage';
import { RegistrationPage } from 'pages/RegistrationPage';
import { ServicePage } from 'pages/ServicePage';
import { unAuthorizeAction } from 'store/actions/user';
import { useAppSelector } from 'store/store';

import 'moment-timezone';
import 'moment/locale/ru';

import './App.scss';

moment.locale('ru');
moment.tz.load({
    version: '2021e',
    zones: [
        'Europe/Moscow|MMT MMT MST MDST MSD MSK +05 EET EEST MSK|-2u.h -2v.j -3v.j -4v.j -40 -30 -50 -20 -30 -40|012132345464575454545454545454545458754545454545454545454545454545454545454595|-2ag2u.h 2pyW.W 1bA0 11X0 GN0 1Hb0 c4v.j ik0 3DA0 dz0 15A0 c10 2q10 iM10 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|16e6',
    ],
    links: ['Europe/Moscow|W-SU'],
});
moment.tz.setDefault('Europe/Moscow');

const cnApp = cn('app');

export const App: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { isAuthorized } = useAppSelector((store) => store.user);

    const handleLogout = useCallback(() => {
        dispatch(unAuthorizeAction());
    }, [dispatch]);

    return (
        <div className={cnApp()}>
            <div className={cnApp('header')}>
                <Link to="/" className={cnApp('title-wrapper')}>
                    <h1 className={cnApp('title')}>PROFI.ru</h1>
                </Link>
                {!['/auth', '/registration'].includes(location.pathname) && (
                    <>
                        {isAuthorized ? (
                            <button className={cnApp('button')} onClick={handleLogout}>
                                Выйти
                            </button>
                        ) : (
                            <Link to="/auth" className={cnApp('button')}>
                                Авторизация
                            </Link>
                        )}
                        <Link to="/contract-signing">
                            <ContractIcon width={28} height={28} className={cnApp('contracts')} />
                        </Link>
                    </>
                )}
            </div>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/service/:id/" element={isAuthorized ? <ServicePage /> : <AuthPage />} />
                <Route path="/contract-signing" element={isAuthorized ? <ContractsSigningPage /> : <AuthPage />} />
                <Route path="*" element={<MainPage />} />
            </Routes>
        </div>
    );
};
