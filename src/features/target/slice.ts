import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

type targetType = {
  lat: number;
  lon: number;
  id: string;
};

type targetCNFType = {
  target: targetType[] | [];
};

const initialState: targetCNFType = {
  target: [],
};

const { actions, reducer } = createSlice({
  name: 'targetCNF',
  initialState,
  reducers: {
    addtargetCNF(state, action: PayloadAction<Omit<targetType, 'id'>>) {
      const tar = { ...action.payload, id: nanoid(10) } as targetType;
      (state.target as targetType[]).push(tar);
    },
    removetargetCNF(state, action: PayloadAction<string>) {
      state.target = state.target.filter(
        (target) => target.id !== action.payload
      );
    },
  },
});

export const { addtargetCNF, removetargetCNF } = actions;

export default reducer;
