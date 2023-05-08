import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
  // currentWorkspaceID: 0,
  token: "",
  userData: {},
} as any

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // setCurrentWorkspace: (state, action) => {
    //   state.currentWorkspaceID = action.payload
    // },
    initUser: (state, action) => {
      state.userData = action.payload.user
      // state.currentWorkspaceID = action.payload.user.Workspaces[0].ID
      state.token = action.payload.token
      // console.log(action.payload.Workspaces[0].ID)
    },
    logoutUser: (state, action: {}) => {
      state.token = ""
      state.userData = {}
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchUsers.fulfilled, (state, action) => {
  //     state.loading = false
  //     state.entities.push(...action.payload)
  //   })

  //   builder.addCase(fetchUsers.pending, (state, action) => {
  //     state.loading = true
  //   })
  // },
})

export const { initUser, logoutUser } = userSlice.actions

export default userSlice.reducer
