import React, { useCallback, useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { useLoader } from 'hooks/useLoader';
import { FilterFormValues } from 'pages/MainPage/MainPage.types';
import { getServicesAction, getServicesPriceRangeAction } from 'store/actions/services';
import { resetServicesState } from 'store/reducers/services';
import { useAppSelector } from 'store/store';
import { FetchStatus } from 'types/api';

import { PageLoader } from 'components/PageLoader';
import { ServiceCard } from 'components/ServiceCard';

import './MainPage.scss';

const cnMainPage = cn('main-page');

export const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const { services, getServicesStatus, servicesPriceRange, getServicesPriceRangeStatus } = useAppSelector(
        (store) => store.services,
    );
    const { isAuthorized } = useAppSelector((store) => store.auth);

    useLoader([getServicesStatus, getServicesPriceRangeStatus]);

    useEffect(() => {
        if (getServicesStatus === FetchStatus.INITIAL) {
            dispatch(getServicesAction());
        }
    }, [dispatch, getServicesStatus]);

    useEffect(() => {
        if (getServicesPriceRangeStatus === FetchStatus.INITIAL) {
            dispatch(getServicesPriceRangeAction());
        }
    }, [dispatch, getServicesPriceRangeStatus]);

    const handleFormSubmit = useCallback(
        (values: FilterFormValues) =>
            dispatch(
                getServicesAction({
                    title: values?.title,
                    price_min: values?.priceMin,
                    price_max: values?.priceMax,
                }),
            ),
        [dispatch],
    );

    useEffect(
        () => () => {
            dispatch(resetServicesState());
        },
        [dispatch],
    );

    return (
        <div className={cnMainPage()}>
            <PageLoader />
            <Form<FilterFormValues> onSubmit={handleFormSubmit}>
                {({ handleSubmit }) => (
                    <>
                        {servicesPriceRange && (
                            <form onSubmit={handleSubmit} className={cnMainPage('filter-row')}>
                                <Field name="title">
                                    {({ input: input_fields }) => (
                                        <input
                                            {...input_fields}
                                            className={cnMainPage('filter-input')}
                                            type="text"
                                            placeholder="Сфера деятельности"
                                            disabled={!isAuthorized}
                                        />
                                    )}
                                </Field>
                                <Field name="priceMin">
                                    {({ input: input_fields }) => {
                                        input_fields.onChange(
                                            input_fields.value < servicesPriceRange.price_min &&
                                                (input_fields.value as string).length
                                                ? servicesPriceRange?.price_min
                                                : input_fields.value,
                                        );
                                        return (
                                            <input
                                                {...input_fields}
                                                className={cnMainPage('filter-input')}
                                                type="number"
                                                placeholder={`Мин. цена ${servicesPriceRange.price_min}руб.`}
                                                disabled={!isAuthorized}
                                            />
                                        );
                                    }}
                                </Field>
                                <Field name="priceMax">
                                    {({ input: input_fields }) => {
                                        input_fields.onChange(
                                            input_fields.value > servicesPriceRange?.price_max
                                                ? servicesPriceRange?.price_max
                                                : input_fields.value,
                                        );
                                        return (
                                            <input
                                                {...input_fields}
                                                className={cnMainPage('filter-input')}
                                                type="number"
                                                placeholder={`Макс. цена ${servicesPriceRange.price_max}руб.`}
                                                disabled={!isAuthorized}
                                            />
                                        );
                                    }}
                                </Field>
                                <button type="submit" className={cnMainPage('filter-button')} disabled={!isAuthorized}>
                                    Поиск
                                </button>
                            </form>
                        )}
                    </>
                )}
            </Form>
            <div className={cnMainPage('services-wrapper')}>
                {services.map((service, serviceIndex) => (
                    <Link
                        key={serviceIndex}
                        to={`/service/${service.id}`}
                        className={cnMainPage('link', { disabled: !isAuthorized })}
                    >
                        <ServiceCard serviceInfo={service} />
                    </Link>
                ))}
            </div>
        </div>
    );
};
