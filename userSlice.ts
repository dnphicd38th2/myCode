import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { put, takeEvery } from 'redux-saga/effects';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserState {
    users: User[];
    error: string | null;
}

const initialState: UserState = {
    users: [],
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUsersSuccess: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.error = null;
        },
        getUsersFailure: (state, action: PayloadAction<string>) => {
            state.users = [];
            state.error = action.payload;
        },
        addUserSuccess: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
            state.error = null;
        },
        addUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
            const updatedUser = action.payload;
            const index = state.users.findIndex(
                (user) => user.id === updatedUser.id,
            );
            state.users[index] = updatedUser;
            state.error = null;
        },
        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        deleteUserSuccess: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.users = state.users.filter((user) => user.id !== id);
            state.error = null;
        },
        deleteUserFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const {
    getUsersSuccess,
    getUsersFailure,
    addUserSuccess,
    addUserFailure,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;

function* getUsersSaga() {
    try {
        const response = yield fetch('/api/users');
        const data: User[] = yield response.json();
        yield put(getUsersSuccess(data));
    } catch (error) {
        yield put(getUsersFailure(error.message));
    }
}

function* addUserSaga(action: PayloadAction<User>) {
    try {
        const response = yield fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action.payload),
        });
        const data: User = yield response.json();
        yield put(addUserSuccess(data));
    } catch (error) {
        yield put(addUserFailure(error.message));
    }
}

function* updateUserSaga(action: PayloadAction<User>) {
    try {
        const response = yield fetch(`/api/users/${action.payload.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action.payload),
        });
        const data: User = yield response.json();
        yield put(updateUserSuccess(data));
    } catch (error) {
        yield put(updateUserFailure(error.message));
    }
}

function* deleteUserSaga(action: PayloadAction<number>) {
    try {
        yield fetch(`/api/users/${action.payload}`, { method: 'DELETE' });
        yield put(deleteUserSuccess(action.payload));
    } catch (error) {
        yield put(deleteUserFailure(error.message));
    }
}

export function* userSagas() {
    yield takeEvery('GET_USERS', getUsersSaga);
    yield takeEvery('ADD_USER', addUserSaga);
    yield takeEvery('UPDATE_USER', updateUserSaga);
    yield takeEvery('DELETE_USER', deleteUserSaga);
}
