import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const AppointmentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    CONFIRMED: 'CONFIRMED',
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export interface Appointment {
    _id: string;
    customerId: any;
    barberName: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    date: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AppointmentState {
    appointments: Appointment[];
    myAppointments: Appointment[];
    loading: boolean;
    error: string | null;
}

const initialState: AppointmentState = {
    appointments: [],
    myAppointments: [],
    loading: false,
    error: null,
};

export const createAppointment = createAsyncThunk(
    'appointments/create',
    async (appointmentData: { barberName: string; serviceName: string; appointmentDate: string; appointmentTime: string; notes?: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/appointments', appointmentData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not create appointment.');
        }
    }
);

export const fetchMyAppointments = createAsyncThunk(
    'appointments/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/appointments/my');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not fetch your appointments.');
        }
    }
);

export const fetchAllAppointments = createAsyncThunk(
    'appointments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/appointments/all');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not fetch all appointments.');
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    'appointments/updateStatus',
    async ({ id, status }: { id: string; status: AppointmentStatus }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/appointments/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Could not update status.');
        }
    }
);

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(createAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.myAppointments.push(action.payload);
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMyAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.myAppointments = action.payload;
            })
            .addCase(fetchMyAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                const updatedApp = action.payload;
                state.appointments = state.appointments.map(app =>
                    app._id === updatedApp._id ? updatedApp : app
                );
                state.myAppointments = state.myAppointments.map(app =>
                    app._id === updatedApp._id ? updatedApp : app
                );
            });
    },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
