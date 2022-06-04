import {createAsyncThunk} from "@reduxjs/toolkit";
import IUser from "../types/IUser";
import axios from "axios";
import $api, {API_URL} from "../../http";
import AuthResponse from "../types/AuthResponse";


export const fetchSignIn = createAsyncThunk(
    'user/fetchSignIn',
    async (data:{login:string, password:string}, thunkApi) => {
        try {
            const response = (await axios.post<IUser>(`${API_URL}/auth/login`, data, {withCredentials: true}));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, thunkApi) => {
        try {
            const response = (await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials: true}));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async (_, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/logout`));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const checkEmail = createAsyncThunk(
    'user/checkEmail',
    async (data: {email: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/check_email`,data));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const fetchSignUp = createAsyncThunk(
    'user/fetchSignUp',
    async (data: {login:string, password:string, surname:string, name:string, email:string, avatarUrl:string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/register`,data));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const fetchSendResetMail = createAsyncThunk(
    'user/fetchSendResetMail',
    async (data: {email:string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/reset_password`,data));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const fetchSendCode = createAsyncThunk(
    'user/fetchSendCode',
    async (data: {email: string,code:string, password: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/reset/check_code`,data));
            return response.data;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const getAllTasks = createAsyncThunk(
    'user/getAllTasks',
    async (data: {sort:string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks`, data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const getTasksWithTag = createAsyncThunk(
    'user/getTasksWithTag',
    async (data: {tagId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasksWithTag`, data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const getAllTags = createAsyncThunk(
    'user/getAllTags',
    async (_, thunkApi) => {
        try {
            const response = (await $api.get(`${API_URL}/dashboard/tags`));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue('');
        }
    }
);

export const fetchAddTask = createAsyncThunk(
    'user/fetchAddTask',
    async (data: {title: string, description: string, term: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/add`,data));

            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const fetchAddTagForTask = createAsyncThunk(
    'user/fetchAddTagForTask',
    async (data: {tagId:number, taskId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/addTag`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const getAllComments = createAsyncThunk(
    'user/getAllComments',
    async (data: {taskId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/comments`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue('');
        }
    }
);

export const fetchAddCommentForTask = createAsyncThunk(
    'user/fetchAddCommentForTask',
    async (data: {text:string, file:string, taskId:number, userId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/addComment`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const fetchAddTag = createAsyncThunk(
    'user/fetchAddTag',
    async (data: {title: string, color: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tags/add`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const removeTag = createAsyncThunk(
    'user/removeTag',
    async (data: {id:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tags/remove`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const updateTag = createAsyncThunk(
    'user/updateTag',
    async (data: {id:number, title:string, color: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tags/update`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'user/updateTask',
    async (data: {id:number, title:string, description: string, term: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/update`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const updatePriorityTask = createAsyncThunk(
    'user/updatePriorityTask',
    async (data: {id:number, priority:boolean}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/priority`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const doneTask = createAsyncThunk(
    'user/doneTask',
    async (data: {id:number, done:boolean}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/done`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const removeTask = createAsyncThunk(
    'user/removeTask',
    async (data: {id:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/remove`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const removeComment = createAsyncThunk(
    'user/removeComment',
    async (data: {commentId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/dashboard/tasks/removeComment`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (data: {file: string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/profile/updateAvatar`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const updateUserInfo = createAsyncThunk(
    'user/updateUserInfo',
    async (data: {surname:string, name:string, email:string}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/profile/updateUser`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const getStatUser = createAsyncThunk(
    'user/getStatUser',
    async (data: {userId:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/profile/stat`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);

export const incFailStatUser = createAsyncThunk(
    'user/incFailStatUser',
    async (data: {userId:number, count:number}, thunkApi) => {
        try {
            const response = (await $api.post(`${API_URL}/auth/profile/stat/fail`,data));
            return response.data.body;
        } catch (error:any) {
            return thunkApi.rejectWithValue(error.response.data.body.message);
        }
    }
);