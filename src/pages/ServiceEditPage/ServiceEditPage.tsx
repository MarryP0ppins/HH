import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { useLoader } from 'hooks/useLoader';
import { ServiceEditPageProps, ServiceFormValue } from 'pages/ServiceEditPage/ServiceEditPage.types';
import { createServiceAction, editServiceByIdAction, getServiceByIdAction } from 'store/actions/services';
import { useAppSelector } from 'store/store';

const cnServiceEditPage = cn('service-edit-page');

import { FormApi } from 'final-form';
import { useRole } from 'hooks/useRole';
import { getUsersAction } from 'store/actions/user';
import { resetServicesState } from 'store/reducers/services';
import { FetchStatus } from 'types/api';

import { DropdownSelect } from 'components/DropdownSelect';

import './ServiceEditPage.scss';

export const ServiceEditPage: React.FC<ServiceEditPageProps> = ({ isCreateMode }) => {
    const dispatch = useDispatch();
    const { id: service_id } = useParams();

    const [workerId, setWorkerId] = useState<number>(-1);

    const { services, getServiceByIdStatus, createServiceStatus, patchServiceByIdStatus } = useAppSelector(
        (store) => store.services,
    );
    const { user, users, getUsersStatus } = useAppSelector((store) => store.user);
    const { isWorker, isStaff } = useRole();

    useEffect(() => {
        if (getServiceByIdStatus === FetchStatus.INITIAL && service_id) {
            dispatch(getServiceByIdAction(Number(service_id)));
        }
    }, [dispatch, getServiceByIdStatus, service_id]);

    useEffect(() => {
        dispatch(getUsersAction());
    }, [dispatch]);

    useLoader([getServiceByIdStatus, createServiceStatus, patchServiceByIdStatus, getUsersStatus]);

    const initialValue = useMemo(() => {
        return services?.length
            ? {
                  title: services[0].title,
                  description: services[0].description,
                  price: String(services[0].price),
                  city: services[0].city,
              }
            : undefined;
    }, [services]);

    const dropdownOptions = useMemo(
        () =>
            users
                ?.filter((user) => (isCreateMode ? user.is_worker : user.id !== services[0]?.user))
                .map((user) => user?.username),
        [isCreateMode, services, users],
    );

    const handleFormSubmit = useCallback(
        (value: ServiceFormValue, form: FormApi<ServiceFormValue, Partial<ServiceFormValue>>) => () => {
            if (isCreateMode && workerId) {
                dispatch(
                    createServiceAction({
                        user: isStaff ? workerId : user?.id ?? -1,
                        title: value.title,
                        description: value.description,
                        price: Number(value.price),
                        rating: 4,
                        city: value.city,
                    }),
                );
            }
            if (!isCreateMode && service_id && workerId && services?.length) {
                dispatch(
                    editServiceByIdAction({
                        id: Number(service_id),
                        user: services[0].user,
                        ...value,
                        price: Number(value.price),
                    }),
                );
            }
            form.reset();
        },
        [dispatch, isCreateMode, isStaff, service_id, services, user?.id, workerId],
    );

    const handleDropdownChange = useCallback(
        (value: string) => {
            setWorkerId(users?.find((user) => user.username === value)?.id ?? -1);
        },
        [users],
    );

    const handleEmptySubmit = useCallback(() => undefined, []);

    if (!((isWorker && (!isCreateMode || services[0]?.user === user?.id)) || isStaff)) {
        <Navigate to="/" />;
    }

    useEffect(
        () => () => {
            dispatch(resetServicesState());
        },
        [dispatch],
    );

    return (
        <div className={cnServiceEditPage()}>
            <div className={cnServiceEditPage('content')}>
                <div className={cnServiceEditPage('title')}>
                    {isCreateMode ? 'Создание новой услуги' : 'Редактирование услуги'}
                </div>
                {isCreateMode && isStaff && (
                    <DropdownSelect options={dropdownOptions} onChange={handleDropdownChange} />
                )}
                <Form<ServiceFormValue> onSubmit={handleEmptySubmit} initialValues={initialValue}>
                    {({ form, values }) => (
                        <form className={cnServiceEditPage('form')}>
                            <Field name="title">
                                {({ input: input_fields }) => (
                                    <input
                                        {...input_fields}
                                        className={cnServiceEditPage('input')}
                                        type="text"
                                        placeholder="Предоставляемая услуга"
                                    />
                                )}
                            </Field>
                            <Field name="description">
                                {({ input: input_fields }) => (
                                    <textarea
                                        {...input_fields}
                                        className={cnServiceEditPage('input', { textarea: true })}
                                        placeholder="Описание  услуги"
                                    />
                                )}
                            </Field>
                            <Field name="price">
                                {({ input: input_fields }) => {
                                    input_fields.onChange(
                                        input_fields.value < 1 && (input_fields.value as string).length
                                            ? 1
                                            : input_fields.value,
                                    );
                                    return (
                                        <input
                                            {...input_fields}
                                            className={cnServiceEditPage('input')}
                                            type="number"
                                            placeholder="Цена за час"
                                        />
                                    );
                                }}
                            </Field>
                            <Field name="city">
                                {({ input: input_fields }) => (
                                    <input
                                        {...input_fields}
                                        className={cnServiceEditPage('input')}
                                        type="text"
                                        placeholder="Город проживания"
                                    />
                                )}
                            </Field>
                            <button
                                type="button"
                                className={cnServiceEditPage('button')}
                                disabled={false}
                                onClick={handleFormSubmit(values, form)}
                            >
                                {isCreateMode ? 'Создать' : 'Сохранить'}
                            </button>
                            {!isCreateMode && (
                                <button type="button" className={cnServiceEditPage('button', { delete: true })}>
                                    Удалить
                                </button>
                            )}
                            <Link to="/" className={cnServiceEditPage('button')}>
                                Назад
                            </Link>
                        </form>
                    )}
                </Form>
            </div>
        </div>
    );
};
