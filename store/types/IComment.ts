export interface IComment {
    id: number,
    text: string,
    file: string,
    dateCreate: Date,
    taskId: number,
    userId: number
}
