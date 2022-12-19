import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { ContractStatus } from 'api/services/contracts';
import { AvatarIcon } from 'assets';
import { useLoader } from 'hooks/useLoader';
import moment from 'moment';
import { deleteContractAction, getContractsAction, patchContractAction } from 'store/actions/contracts';
import { getServicesAction } from 'store/actions/services';
import { resetContractsState } from 'store/reducers/contracts';
import { resetServicesState } from 'store/reducers/services';
import { useAppSelector } from 'store/store';
import { FetchStatus } from 'types/api';

import './ContractsSigningPage.scss';

const cnContractsSigningPage = cn('contracts-signing-page');

export const ContractsSigningPage: React.FC = () => {
    const dispatch = useDispatch();

    const { contracts, getContractsStatus, updateContractStatus, deleteContractStatus } = useAppSelector(
        (store) => store.contracts,
    );
    const { services, getServicesStatus } = useAppSelector((store) => store.services);

    useLoader([getContractsStatus, updateContractStatus, deleteContractStatus, getServicesStatus]);

    useEffect(() => {
        if (getContractsStatus === FetchStatus.INITIAL) {
            dispatch(getContractsAction({ id_client: 1, status: ContractStatus.EXECUTION }));
        }
    }, [dispatch, getContractsStatus]);

    useEffect(() => {
        if (getServicesStatus === FetchStatus.INITIAL && Boolean(contracts?.length)) {
            dispatch(
                getServicesAction({
                    services_ids: contracts.map((contract) => contract.id),
                    all: true,
                }),
            );
        }
    }, [contracts, dispatch, getServicesStatus]);

    const handleSigningContract = useCallback(
        (contract_id: number) => () => {
            dispatch(
                patchContractAction({
                    id: contract_id,
                    status: ContractStatus.SIGN,
                    date_of_signing: moment().format(),
                }),
            );
        },
        [dispatch],
    );

    const handleRejectingContract = useCallback(
        (contract_id: number) => () => {
            dispatch(deleteContractAction(contract_id));
        },
        [dispatch],
    );

    useEffect(
        () => () => {
            dispatch(resetContractsState());
            dispatch(resetServicesState());
        },
        [dispatch],
    );
    return (
        <div className={cnContractsSigningPage()}>
            <div className={cnContractsSigningPage('breadcrumbs')}>
                <Link to={'/'}>Каталог</Link>
                <div>{'/'}</div>
                <div>Управление договорами</div>
            </div>
            <div className={cnContractsSigningPage('scroll-container')}>
                <div className={cnContractsSigningPage('container')}>
                    <div className={cnContractsSigningPage('title')}>Оформленные договоры</div>
                    <div className={cnContractsSigningPage('orders')}>
                        {Boolean(contracts?.length) &&
                            Boolean(services?.length) &&
                            contracts.map((contract, index) => {
                                const service = services.find((service) => service.id === contract.id_service);
                                return (
                                    <>
                                        {service && (
                                            <div key={index}>
                                                <div className={cnContractsSigningPage('mainInfo')}>
                                                    <AvatarIcon className={cnContractsSigningPage('avatar')} />
                                                    <div className={cnContractsSigningPage('info')}>
                                                        <div className={cnContractsSigningPage('info-row')}>
                                                            <div className={cnContractsSigningPage('info-title')}>
                                                                Название:
                                                            </div>
                                                            <span
                                                                className={cnContractsSigningPage('info-description')}
                                                            >
                                                                {service.title}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsSigningPage('info-row')}>
                                                            <div className={cnContractsSigningPage('info-title')}>
                                                                Дата оформления договора:
                                                            </div>
                                                            <span
                                                                className={cnContractsSigningPage('info-description')}
                                                            >
                                                                {moment(contract.date_of_execution).format(
                                                                    'D MMMM YYYY',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsSigningPage('info-row')}>
                                                            <div className={cnContractsSigningPage('info-title')}>
                                                                Продолжительность контракта:
                                                            </div>
                                                            <span
                                                                className={cnContractsSigningPage('info-description')}
                                                            >
                                                                {`${contract.duration} дней`}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsSigningPage('info-row')}>
                                                            <div className={cnContractsSigningPage('info-title')}>
                                                                Дата окончания договора:
                                                            </div>
                                                            <span
                                                                className={cnContractsSigningPage('info-description')}
                                                            >
                                                                {moment(contract.date_of_execution)
                                                                    .add(contract.duration, 'd')
                                                                    .format('D MMMM YYYY')}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsSigningPage('info-row')}>
                                                            <div className={cnContractsSigningPage('info-title')}>
                                                                Суммарная стоимость:
                                                            </div>
                                                            <span
                                                                className={cnContractsSigningPage('info-description')}
                                                            >
                                                                {`${contract.duration * service.price}руб.`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cnContractsSigningPage('buttons')}>
                                                    <button
                                                        type="button"
                                                        className={cnContractsSigningPage('button', { action: true })}
                                                        onClick={handleSigningContract(contract.id)}
                                                    >
                                                        Подписать договор
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={cnContractsSigningPage('button')}
                                                        onClick={handleRejectingContract(contract.id)}
                                                    >
                                                        Расторгнуть договор
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};
