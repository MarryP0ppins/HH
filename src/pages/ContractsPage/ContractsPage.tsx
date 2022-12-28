import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { ContractStatus } from 'api/services/contracts';
import { AvatarIcon } from 'assets';
import { useLoader } from 'hooks/useLoader';
import { useRole } from 'hooks/useRole';
import moment from 'moment';
import {
    deleteContractAction,
    getContractsAction,
    getContractStatusesAction,
    getRequestContractsAction,
    getWorkerActualContractsAction,
    patchContractAction,
} from 'store/actions/contracts';
import { getServicesAction } from 'store/actions/services';
import { resetContractsState } from 'store/reducers/contracts';
import { resetServicesState } from 'store/reducers/services';
import { useAppSelector } from 'store/store';
import { FetchStatus } from 'types/api';

import { DropdownSelect } from 'components/DropdownSelect';

import './ContractsPage.scss';

const cnContractsPage = cn('contracts-page');

export const ContractsPage: React.FC = () => {
    const dispatch = useDispatch();

    const [dropdownValue, setDropdownValue] = useState<string>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const {
        contracts,
        getContractsStatus,
        updateContractStatus,
        deleteContractStatus,
        getContractStatusesStatus,
        contractStatuses,
        getRequestContractsStatus,
        workerContracts,
        getWorkerContracts,
    } = useAppSelector((store) => store.contracts);

    const { services, getServicesStatus } = useAppSelector((store) => store.services);

    const { user } = useAppSelector((store) => store.user);

    const { isStaff, isWorker } = useRole();

    useLoader([
        getContractsStatus,
        updateContractStatus,
        deleteContractStatus,
        getServicesStatus,
        getContractStatusesStatus,
        getRequestContractsStatus,
    ]);

    useEffect(() => {
        if (getContractsStatus === FetchStatus.INITIAL && user) {
            dispatch(getContractsAction({ client: user?.id }));
        }
    }, [dispatch, getContractsStatus, user]);

    useEffect(() => {
        if (getContractStatusesStatus === FetchStatus.INITIAL) {
            dispatch(getContractStatusesAction());
        }
    }, [dispatch, getContractStatusesStatus]);

    useEffect(() => {
        if (getRequestContractsStatus === FetchStatus.INITIAL) {
            dispatch(getRequestContractsAction());
        }
    }, [dispatch, getRequestContractsStatus]);

    useEffect(() => {
        if (getWorkerContracts === FetchStatus.INITIAL) {
            dispatch(getWorkerActualContractsAction(user?.id ?? -1));
        }
    }, [dispatch, getWorkerContracts, user?.id]);

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
            if (dropdownValue === ContractStatus.REQUEST) {
                dispatch(
                    patchContractAction({
                        id: contract_id,
                        status: ContractStatus.SIGN,
                    }),
                );
            } else {
                dispatch(
                    patchContractAction({
                        id: contract_id,
                        status: ContractStatus.SIGN,
                        date_of_signing: moment().format(),
                    }),
                );
            }
        },
        [dispatch, dropdownValue],
    );

    const handleRejectingContract = useCallback(
        (contract_id: number) => () => {
            if (dropdownValue === ContractStatus.SIGN) {
                dispatch(
                    patchContractAction({
                        id: contract_id,
                        status: ContractStatus.REQUEST,
                    }),
                );
            } else {
                dispatch(deleteContractAction(contract_id));
            }
        },
        [dispatch, dropdownValue],
    );

    const handleDropDownChange = useCallback(
        (value: string) => {
            setDropdownValue(contractStatuses.find((status) => status.label === value)?.value);
        },
        [contractStatuses],
    );

    const dropdownOptions = useMemo(
        () =>
            contractStatuses
                ?.filter((status) => (!isStaff ? status.value !== ContractStatus.REQUEST : true))
                ?.map((status) => status.label),
        [contractStatuses, isStaff],
    );

    const contractsFiltered = useMemo(
        () =>
            contracts.concat(isWorker ? workerContracts : []).filter((contract) => {
                return (
                    contract.status === dropdownValue &&
                    (startDate && dropdownValue === ContractStatus.SIGN
                        ? moment(contract.date_of_signing).isSameOrAfter(startDate, 'days')
                        : true) &&
                    (endDate && dropdownValue === ContractStatus.SIGN
                        ? moment(contract.date_of_signing).isSameOrBefore(endDate, 'days')
                        : true)
                );
            }),
        [contracts, dropdownValue, endDate, isWorker, startDate, workerContracts],
    );

    const handleStartDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    }, []);

    const handleEndDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    }, []);

    useEffect(
        () => () => {
            dispatch(resetContractsState());
            dispatch(resetServicesState());
        },
        [dispatch],
    );

    return (
        <div className={cnContractsPage()}>
            <div className={cnContractsPage('breadcrumbs')}>
                <Link to={'/'}>Каталог</Link>
                <div>{'/'}</div>
                <div>Управление договорами</div>
            </div>

            <div className={cnContractsPage('scroll-container')}>
                <div className={cnContractsPage('container')}>
                    <div className={cnContractsPage('filters')}>
                        {dropdownOptions?.length && (
                            <DropdownSelect options={dropdownOptions} onChange={handleDropDownChange} />
                        )}
                        {dropdownValue === ContractStatus.SIGN && (
                            <>
                                <input
                                    type="date"
                                    className={cnContractsPage('date')}
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                                <input
                                    type="date"
                                    className={cnContractsPage('date')}
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </>
                        )}
                    </div>
                    <div className={cnContractsPage('orders')}>
                        {Boolean(contractsFiltered?.length) &&
                            Boolean(services?.length) &&
                            contractsFiltered.map((contract, index) => {
                                const service = services.find((service) => service.id === contract.service);
                                return (
                                    <>
                                        {service && (
                                            <div key={index}>
                                                <div className={cnContractsPage('mainInfo')}>
                                                    <AvatarIcon className={cnContractsPage('avatar')} />
                                                    <div className={cnContractsPage('info')}>
                                                        <div className={cnContractsPage('info-row')}>
                                                            <div className={cnContractsPage('info-title')}>
                                                                Название услуги:
                                                            </div>
                                                            <span className={cnContractsPage('info-description')}>
                                                                {service.title}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsPage('info-row')}>
                                                            <div className={cnContractsPage('info-title')}>
                                                                Дата оформления договора:
                                                            </div>
                                                            <span className={cnContractsPage('info-description')}>
                                                                {moment(contract.date_of_execution).format(
                                                                    'D MMMM YYYY',
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsPage('info-row')}>
                                                            <div className={cnContractsPage('info-title')}>
                                                                Продолжительность контракта:
                                                            </div>
                                                            <span className={cnContractsPage('info-description')}>
                                                                {`${contract.duration} дней`}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsPage('info-row')}>
                                                            <div className={cnContractsPage('info-title')}>
                                                                Дата окончания договора:
                                                            </div>
                                                            <span className={cnContractsPage('info-description')}>
                                                                {moment(contract.date_of_execution)
                                                                    .add(contract.duration, 'd')
                                                                    .format('D MMMM YYYY')}
                                                            </span>
                                                        </div>
                                                        <div className={cnContractsPage('info-row')}>
                                                            <div className={cnContractsPage('info-title')}>
                                                                Суммарная стоимость:
                                                            </div>
                                                            <span className={cnContractsPage('info-description')}>
                                                                {`${contract.duration * service.price}руб.`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={cnContractsPage('buttons')}>
                                                    {dropdownValue !== ContractStatus.SIGN && (
                                                        <button
                                                            type="button"
                                                            className={cnContractsPage('button', { action: true })}
                                                            onClick={handleSigningContract(contract.id)}
                                                        >
                                                            {dropdownValue === ContractStatus.REQUEST
                                                                ? 'Отказать в расторжении'
                                                                : 'Подписать договор'}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={cnContractsPage('button')}
                                                        onClick={handleRejectingContract(contract.id)}
                                                    >
                                                        {dropdownValue === ContractStatus.SIGN
                                                            ? 'Запрос на расторжение'
                                                            : 'Расторгнуть договор'}
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
