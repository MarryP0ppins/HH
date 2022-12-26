import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { ContractStatus } from 'api/services/contracts';
import { AvatarIcon, StarIcon } from 'assets';
import { useLoader } from 'hooks/useLoader';
import moment from 'moment';
import { createExecutionContractAction } from 'store/actions/contracts';
import { getServiceByIdAction } from 'store/actions/services';
import { resetContractsState } from 'store/reducers/contracts';
import { useAppSelector } from 'store/store';
import { FetchStatus } from 'types/api';

import './ServicePage.scss';

const cnServicePage = cn('service-page');

export const ServicePage: React.FC = () => {
    const dispatch = useDispatch();

    const params = useParams();
    const { id: service_id } = params;

    const [hiringDuration, setHiringDuration] = useState<number | string>();
    const { services, getServiceByIdStatus } = useAppSelector((store) => store.services);
    const { createExecutionContractStatus } = useAppSelector((store) => store.contracts);
    const { user } = useAppSelector((store) => store.user);

    useLoader([createExecutionContractStatus, getServiceByIdStatus]);

    useEffect(() => {
        if (getServiceByIdStatus === FetchStatus.INITIAL && service_id) {
            dispatch(getServiceByIdAction(Number(service_id)));
        }
    }, [dispatch, getServiceByIdStatus, service_id]);

    const serviceInfo = useMemo(() => {
        return services.length ? services[0] : undefined;
    }, [services]);

    const onHiringDurationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setHiringDuration(Number(event.target.value) < 1 ? '' : Number(event.target.value));
    }, []);

    const handleExecutedService = useCallback(() => {
        if (service_id && user?.id) {
            dispatch(
                createExecutionContractAction({
                    client: user.id,
                    service: Number(service_id),
                    date_of_execution: moment().format(),
                    status: ContractStatus.EXECUTION,
                    duration: Number(hiringDuration),
                }),
            );
        }
    }, [dispatch, hiringDuration, service_id, user?.id]);

    useEffect(
        () => () => {
            dispatch(resetContractsState());
        },
        [dispatch],
    );

    return (
        <div className={cnServicePage()}>
            <div className={cnServicePage('breadcrumbs')}>
                <Link to={'/'}>Каталог</Link>
                <div>{'/'}</div>
                {serviceInfo?.title && <div>{serviceInfo.title}</div>}
            </div>
            <div className={cnServicePage('scroll-container')}>
                <div className={cnServicePage('container')}>
                    {serviceInfo && (
                        <>
                            <div className={cnServicePage('title')}>{serviceInfo.title}</div>
                            <div className={cnServicePage('mainInfo')}>
                                <AvatarIcon className={cnServicePage('avatar')} />
                                <div className={cnServicePage('info')}>
                                    <div className={cnServicePage('stars-wrapper')}>
                                        <div className={cnServicePage('info-title')}>Рейтинг:</div>
                                        <div className={cnServicePage('info-description', { stars: true })}>
                                            {[...Array<number>(serviceInfo.rating < 0 ? 0 : serviceInfo.rating)].map(
                                                (_, index) => (
                                                    <StarIcon key={index} width={18} height={18} />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={cnServicePage('info-title')}>Город предоставления услуги:</div>
                                        <span className={cnServicePage('info-description')}>{serviceInfo.city}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cnServicePage('about')}>
                                <div className={cnServicePage('about-title')}>Стоимость услуги</div>
                                <div className={cnServicePage('about-description')}>
                                    <div
                                        className={cnServicePage('hiring-info')}
                                    >{`Стоимость  - ${serviceInfo.price}руб./день`}</div>
                                    <input
                                        className={cnServicePage('hiring-duration')}
                                        type={'number'}
                                        value={hiringDuration}
                                        onChange={onHiringDurationChange}
                                        placeholder="Кол-во дней"
                                    />
                                    <Link to="/">
                                        <button
                                            disabled={!hiringDuration || hiringDuration < 1}
                                            className={cnServicePage('hiring-button', {
                                                active: hiringDuration && hiringDuration >= 1,
                                            })}
                                            onClick={handleExecutedService}
                                        >
                                            Оформить контракт
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className={cnServicePage('about')}>
                                <div className={cnServicePage('about-title')}>Описание услуги</div>
                                <div className={cnServicePage('about-description')}>{serviceInfo.description}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
