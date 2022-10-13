import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { IHSL } from "./type";

export interface IReduxStore {
  color: IHSL;
}

const initState: IReduxStore = {
  color: {
    hue: 0,
    saturation: 100,
    lightness: 65,
  },
};

export const RSetColor = createAction<IHSL>("RSetColor");

const reducer = createReducer(initState, (builder) => {
  builder.addCase(RSetColor, (state, action) => {
    state.color = action.payload;
  });
});

export default configureStore({
  reducer,
});
