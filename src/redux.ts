import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { getColorObj } from "./lib";
import { IColor } from "./type";

export interface IReduxStore {
  color: IColor;
}

const initState: IReduxStore = {
  color: getColorObj(0),
};

export const RSetColor = createAction<IColor>("RSetColor");

const reducer = createReducer(initState, (builder) => {
  builder.addCase(RSetColor, (state, action) => {
    state.color = action.payload;
  });
});

export default configureStore({
  reducer,
});
