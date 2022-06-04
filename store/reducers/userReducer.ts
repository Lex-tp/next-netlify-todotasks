import IUser from "../types/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    checkAuth,
    checkEmail,
    fetchAddTag,
    fetchAddTagForTask,
    fetchAddTask,
    fetchSendCode,
    fetchSendResetMail,
    fetchSignIn,
    fetchSignUp,
    getAllTags,
    getAllTasks,
    logout,
    removeTag,
    updateTag,
    removeTask,
    updateTask,
    fetchAddCommentForTask,
    getAllComments,
    removeComment,
    updateAvatar, getTasksWithTag, doneTask, updatePriorityTask, updateUserInfo, getStatUser, incFailStatUser
} from "../services/ActionCreator";
import AuthResponse from "../types/AuthResponse";
import {ITask} from "../types/ITask";
import {ITag} from "../types/ITag";
import {IComment} from "../types/IComment";
import {IStat} from "../types/IStat";

interface userState {
    user: IUser,
    isLoading: boolean,
    isAuth: boolean,
    tasks: Array<ITask>,
    tasksWithTag: Array<{title:string, dateCreate:string, term:string, done: boolean}>
    tags: Array<ITag>,
    error: string,
    selectTab: number;
    commentsForTask: Array<IComment>,
    sortType: string,
    priorityOnly: boolean,
    tagsSort: Array<ITag>,
    stat: IStat,
}

const initialState: userState = {
    user: {
        userId: '',
        login: "",
        surname: "",
        name: "",
        email: "",
        avatarUrl: "",
        accessToken: "",
        refreshToken: "",
        createdAt: new Date()
    },
    isLoading: false,
    isAuth: false,
    tasks: [],
    tasksWithTag: [],
    tags: [],
    selectTab: 0,
    commentsForTask: [],
    error: '',
    sortType: 'DESC',
    priorityOnly: false,
    tagsSort: [],
    stat: {} as IStat
}

const setUser = (state: userState, action: PayloadAction<AuthResponse>) => {
    state.isLoading = false;
    state.error = '';
    state.isAuth = true;
    state.user = action.payload.body.user;
    state.user.accessToken = action.payload.body.accessToken;
    state.user.refreshToken = action.payload.body.refreshToken;
    localStorage.setItem('token', action.payload.body.accessToken);
}

const cancelAuth = (url: string) => {
    localStorage.removeItem('token');
    window.location.href = url;
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError(state) {
            state.error = '';
        },
        selectTabFrame(state, action:PayloadAction<{numberTab:number}>) {
            state.selectTab = action.payload.numberTab;
        },
        errorEqualsPassword(state) {
            state.error = 'Пароли не совпадают';
        },
        setSortType(state,action:PayloadAction<{type:string}>) {
            state.sortType = action.payload.type;
        },
        setPriority(state,action:PayloadAction<{set:boolean}>) {
            state.priorityOnly = action.payload.set;
        },
        setTagsSort(state,action:PayloadAction<{array:Array<ITag>}>) {
            state.tagsSort = action.payload.array;
        },
        signInWithGitHub(state, action: PayloadAction<{ user: IUser, accessToken: string, refreshToken: string }>) {
            state.isAuth = true;
            state.user = action.payload.user;
            state.user.accessToken = action.payload.accessToken;
            state.user.refreshToken = action.payload.refreshToken;
            localStorage.setItem('token', action.payload.accessToken);
        }
    },
    extraReducers: {
        [fetchSignIn.fulfilled.type]: setUser,
        [fetchSignIn.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchSignIn.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
        },

        [updateAvatar.fulfilled.type]: (state, action: PayloadAction<{user: {avatarUrl: string}}>) => {
            state.isLoading = false;
            state.user.avatarUrl = action.payload.user.avatarUrl;
        },
        [updateAvatar.pending.type]: (state) => {
            state.isLoading = true;
        },
        [updateAvatar.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
        },

        [updateUserInfo.fulfilled.type]: (state, action: PayloadAction<{user: {surname: string, name:string, email:string}}>) => {
            state.isLoading = false;
            state.user.surname = action.payload.user.surname;
            state.user.name = action.payload.user.name;
            state.user.email = action.payload.user.email;
        },
        [updateUserInfo.pending.type]: (state) => {
            state.isLoading = true;
        },
        [updateUserInfo.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
        },

        [fetchSendCode.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [fetchSendCode.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchSendCode.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
        },

        [fetchSendResetMail.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [fetchSendResetMail.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchSendResetMail.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [fetchSignUp.fulfilled.type]: setUser,
        [fetchSignUp.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchSignUp.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = action.payload;
        },

        [checkAuth.fulfilled.type]: setUser,
        [checkAuth.pending.type]: (state) => {
            state.isLoading = true;
        },
        [checkAuth.rejected.type]: (state) => {
            state.isLoading = false;
            state.isAuth = false;
            state.error = '';
        },

        [logout.fulfilled.type]: (state) => {
            state.isAuth = false;
            state.isLoading = false;
            state.user = {} as IUser;
            state.error = '';
            cancelAuth('/');
        },
        [logout.pending.type]: (state) => {
            state.isLoading = true;
        },
        [logout.rejected.type]: (state) => {
            state.isLoading = false;
            state.isAuth = true;
        },

        [checkEmail.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [checkEmail.pending.type]: (state) => {
            state.isLoading = true;
        },
        [checkEmail.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [getAllTasks.fulfilled.type]: (state, action: PayloadAction<Array<ITask>>) => {
            state.isLoading = false;
            state.tasks = action.payload;
        },
        [getAllTasks.pending.type]: (state) => {
            state.isLoading = true;
        },
        [getAllTasks.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.tasks = [];
        },

        [getTasksWithTag.fulfilled.type]: (state, action: PayloadAction<Array<{title:string, dateCreate:string, term:string, done: boolean}>>) => {
            state.isLoading = false;
            state.tasksWithTag = action.payload;
        },
        [getTasksWithTag.pending.type]: (state) => {
            state.isLoading = true;
        },
        [getTasksWithTag.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.tasksWithTag = [];
        },

        [getAllComments.fulfilled.type]: (state, action: PayloadAction<Array<IComment>>) => {
            state.isLoading = false;
            state.commentsForTask = action.payload;
        },
        [getAllComments.pending.type]: (state) => {
            state.isLoading = true;
        },
        [getAllComments.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.commentsForTask = [];
        },

        [fetchAddTask.fulfilled.type]: (state, action: PayloadAction<ITask>) => {
            state.isLoading = false;
            state.tasks = [...state.tasks, action.payload];
        },
        [fetchAddTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchAddTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.tasks = [];
        },

        [fetchAddTagForTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [fetchAddTagForTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchAddTagForTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [fetchAddCommentForTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [fetchAddCommentForTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchAddCommentForTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [fetchAddTag.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [fetchAddTag.pending.type]: (state) => {
            state.isLoading = true;
        },
        [fetchAddTag.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [removeTag.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [removeTag.pending.type]: (state) => {
            state.isLoading = true;
        },
        [removeTag.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [removeTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [removeTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [removeTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [removeComment.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [removeComment.pending.type]: (state) => {
            state.isLoading = true;
        },
        [removeComment.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [updateTag.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [updateTag.pending.type]: (state) => {
            state.isLoading = true;
        },
        [updateTag.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [updateTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [updateTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [updateTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [updatePriorityTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [updatePriorityTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [updatePriorityTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [doneTask.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [doneTask.pending.type]: (state) => {
            state.isLoading = true;
        },
        [doneTask.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [getAllTags.fulfilled.type]: (state, action: PayloadAction<Array<ITag>>) => {
            state.isLoading = false;
            state.tags = action.payload;
        },
        [getAllTags.pending.type]: (state) => {
            state.isLoading = true;
        },
        [getAllTags.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.tags = [];
        },

        [getStatUser.fulfilled.type]: (state, action: PayloadAction<IStat>) => {
            state.isLoading = false;
            state.stat.userStat = action.payload.userStat;
        },
        [getStatUser.pending.type]: (state) => {
            state.isLoading = true;
        },
        [getStatUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [incFailStatUser.fulfilled.type]: (state) => {
            state.isLoading = false;
        },
        [incFailStatUser.pending.type]: (state) => {
            state.isLoading = true;
        },
        [incFailStatUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    }
});

export const {clearError, errorEqualsPassword, signInWithGitHub, selectTabFrame, setSortType, setPriority, setTagsSort} = userSlice.actions;
export default userSlice.reducer;
