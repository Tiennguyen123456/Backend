import userApi from "@/services/user-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProfile = createAsyncThunk("user/profile", async (_body, thunkAPI) => {
    try {
        const response = await userApi.getProfile();
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});
