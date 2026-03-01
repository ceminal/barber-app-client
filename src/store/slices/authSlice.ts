import { createSlice, createAsyncThunk, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';


export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role?: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}


const storage = {
    getUser: (): User | null => {
        try {
            const savedUser = localStorage.getItem('user');
            return (savedUser && savedUser !== "undefined") ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error parsing user from storage:', error);
            localStorage.removeItem('user');
            return null;
        }
    },
    getToken: () => localStorage.getItem('token'),
    setAuth: (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

const initialState: AuthState = {
    user: storage.getUser(),
    token: storage.getToken(),
    loading: false,
    error: null,
    isAuthenticated: !!storage.getToken(),
};


export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { phoneNumber: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: { firstName: string; lastName: string; phoneNumber: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed.');
        }
    }
);

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not fetch profile info.');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/update-profile', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not update profile.');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            storage.clearAuth();
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            storage.setUser(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                storage.clearAuth();
            })

            .addMatcher(
                isAnyOf(login.fulfilled, register.fulfilled),
                (state, action: PayloadAction<{ token: string; user: User }>) => {
                    const { token, user } = action.payload;
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user = user;
                    state.token = token;
                    storage.setAuth(token, user);
                }
            )

            .addMatcher(
                isAnyOf(updateProfile.fulfilled, fetchMe.fulfilled),
                (state, action: PayloadAction<User>) => {
                    state.loading = false;
                    state.user = action.payload;
                    state.isAuthenticated = true;
                    storage.setUser(action.payload);
                }
            )

            .addMatcher(
                isAnyOf(login.pending, register.pending, fetchMe.pending, updateProfile.pending),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addMatcher(
                isAnyOf(login.rejected, register.rejected, updateProfile.rejected),
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
