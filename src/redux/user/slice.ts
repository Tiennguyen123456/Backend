import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IUserProfile } from "../../models/User";
import { RootState } from "../root/store";
import { getProfile } from "./action";
import { mergePermissionFromRoles } from "@/utils/common";
import Cookies from "js-cookie";

export interface UserState {
    userProfile: IUserProfile | null;
    userPermissions: string[];
}

const initialState: UserState = {
    userProfile: null,
    userPermissions: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getProfile.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
                state.userProfile = action.payload;

                const userPermissions = mergePermissionFromRoles(action.payload.roles);
                state.userPermissions = userPermissions;
                Cookies.set("userPermissions", JSON.stringify(userPermissions));
            })
            .addCase(getProfile.rejected, (state) => {
                state.userProfile = null;
            });
    },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
