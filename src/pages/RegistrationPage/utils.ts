import { RegistrationParams } from 'api/services/user';
import { RegistrationFormErrors } from 'pages/RegistrationPage/RegistrationPage.types';

export const validateRegistrationForm = (values: RegistrationParams): RegistrationFormErrors => {
    const errors: RegistrationFormErrors = {
        username: undefined,
        password: undefined,
        email: undefined,
        birth_date: undefined,
        sex: undefined,
    };

    if (!values.username) {
        errors.username = 'Пожалуйста укажите имя пользователя';
    }

    if (!values.password) {
        errors.password = 'Пожалуйста укажите пароль';
    }

    if (!values.email) {
        errors.email = 'Пожалуйста укажите email';
    }

    if (!values.birth_date) {
        errors.birth_date = 'Пожалуйста укажите дату рождения';
    }

    if (!values.sex) {
        errors.sex = 'Пожалуйста укажите ваш пол';
    }

    return errors;
};
