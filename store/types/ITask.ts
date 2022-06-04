import {ITag} from "./ITag";
import {IComment} from "./IComment";

export interface ITask {
    id: number,
    title: string,
    description: string,
    dateCreate: string,
    done: boolean,
    task_tags: Array<{tagId: number, tagData: ITag}>,
    term: string,
    priority: boolean,
    task_comments: Array<IComment>
}