import React, { useCallback, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { cn } from '@bem-react/classname';
import { RegistrationParams, SEX } from 'api/services/user';
import { validateRegistrationForm } from 'pages/RegistrationPage/utils';
import { registrationAction } from 'store/actions/user';

import './RegistrationPage.scss';

const cnRegistrationPage = cn('registrationPage');

export const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch();

    const [registration, setRegistration] = useState(false);

    const onSubmit = useCallback(
        (values: RegistrationParams) => {
            dispatch(registrationAction(values));
            setRegistration(true);
        },
        [dispatch],
    );

    if (registration) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className={cnRegistrationPage()}>
            <div className={cnRegistrationPage('title')}>Регистрация</div>
            <Form<RegistrationParams> onSubmit={onSubmit} validate={validateRegistrationForm}>
                {({ handleSubmit, dirtySinceLastSubmit }) => (
                    <form onSubmit={handleSubmit} className={cnRegistrationPage('form')}>
                        <Field name="username">
                            {({ input, meta }) => (
                                <input
                                    {...input}
                                    placeholder="Введите имя пользователя"
                                    className={cnRegistrationPage('input', {
                                        error: meta.submitFailed && !meta.valid && !dirtySinceLastSubmit,
                                    })}
                                />
                            )}
                        </Field>
                        <Field name="password">
                            {({ input, meta }) => (
                                <input
                                    {...input}
                                    type="password"
                                    placeholder="Введите пароль"
                                    className={cnRegistrationPage('input', {
                                        error: meta.submitFailed && !meta.valid && !dirtySinceLastSubmit,
                                    })}
                                />
                            )}
                        </Field>
                        <Field name="email">
                            {({ input, meta }) => (
                                <input
                                    {...input}
                                    placeholder="Введите email"
                                    type="email"
                                    className={cnRegistrationPage('input', {
                                        error: meta.submitFailed && !meta.valid && !dirtySinceLastSubmit,
                                    })}
                                />
                            )}
                        </Field>
                        <Field name="birth_date">
                            {({ input, meta }) => (
                                <input
                                    {...input}
                                    type="date"
                                    className={cnRegistrationPage('input', {
                                        error: meta.submitFailed && !meta.valid && !dirtySinceLastSubmit,
                                    })}
                                />
                            )}
                        </Field>
                        <div className={cnRegistrationPage('radio-wrapper')}>
                            <div className={cnRegistrationPage('field-description')}>Пол:</div>
                            <div className={cnRegistrationPage('radio-input')}>
                                <label htmlFor="male" className={cnRegistrationPage('input-radio')}>
                                    М
                                </label>
                                <Field name="sex" type="radio" value={SEX.MALE}>
                                    {({ input }) => (
                                        <input
                                            {...input}
                                            id="male"
                                            type="radio"
                                            className={cnRegistrationPage('input-radio')}
                                        />
                                    )}
                                </Field>
                            </div>
                            <div className={cnRegistrationPage('radio-input')}>
                                <label htmlFor="female" className={cnRegistrationPage('input-radio-label')}>
                                    Ж
                                </label>
                                <Field name="sex" type="radio" value={SEX.FEMALE}>
                                    {({ input }) => (
                                        <input
                                            {...input}
                                            id="female"
                                            type="radio"
                                            className={cnRegistrationPage('input-radio')}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <button className={cnRegistrationPage('button')} type="submit">
                            Зарегистрироваться
                        </button>
                    </form>
                )}
            </Form>
        </div>
    );
};
