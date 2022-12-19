import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { ContractIcon } from 'assets';
import moment from 'moment';
import { ContractsSigningPage } from 'pages/ContractsSigningPage';
import { MainPage } from 'pages/MainPage';
import { ServicePage } from 'pages/ServicePage';
import { changeAuthorizedState } from 'store/reducers/auth';
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

    const { isAuthorized } = useAppSelector((store) => store.auth);

    const handleChangeAuthState = useCallback(() => {
        dispatch(changeAuthorizedState());
    }, [dispatch]);

    return (
        <div className={cnApp()}>
            <div className={cnApp('header')}>
                <h1 className={cnApp('title')}>HH.ru</h1>
                <button className={cnApp('button')} type="button" onClick={handleChangeAuthState}>
                    {isAuthorized ? 'Выйти' : 'Авторизация'}
                </button>
                <Link to="/contract-signing">
                    <ContractIcon width={28} height={28} className={cnApp('contracts')} />
                </Link>
            </div>
            <Routes>
                <Route path="/service/:id/" element={<ServicePage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/contract-signing" element={<ContractsSigningPage />} />
            </Routes>
        </div>
    );
};
