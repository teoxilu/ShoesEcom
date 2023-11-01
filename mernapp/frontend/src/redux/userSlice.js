import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  _id: "",
  loggedIn: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action.payload.data);
      state._id = action.payload.data._id
      state.email = action.payload.data.email
      state.firstName = action.payload.data.firstName
      state.lastName = action.payload.data.lastName
      state.loggedIn = true;
    },
    logoutRedux: (state, action) => {
      state._id = ""
      state.email = ""
      state.firstName = ""
      state.lastName = ""
      state.loggedIn = false;
    }
  },
});

export const { loginRedux , logoutRedux } = userSlice.actions;

export default userSlice.reducer;
