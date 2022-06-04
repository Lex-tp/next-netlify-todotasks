export type validationFields = 'login'| 'password'|'repeatPassword'|'email'|'surname'|'name'|'code';
export interface validationState {
    valid: boolean,
    message: string
}
export const emptyValidObj:validationState = {
    valid: true,
    message: ''
}