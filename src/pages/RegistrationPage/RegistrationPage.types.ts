import { RegistrationParams } from "api/services/user";

export type RegistrationFormErrors = Record<keyof RegistrationParams, string | undefined>;