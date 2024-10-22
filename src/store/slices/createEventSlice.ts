import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface createEventState {
  value: boolean;
  sidebarValue: boolean;
}

const initialState: createEventState = {
  value: false,
  sidebarValue: false
}

export const createEventSlice = createSlice({
    name: 'createEvent',
    initialState,
    reducers: {
      openSidebar: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.sidebarValue = true;
      },
      toggleSidebar: (state, action: PayloadAction<boolean>) => {
        state.sidebarValue = action.payload;
      },
      toggleEventState: (state, action: PayloadAction<boolean>) => {
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { toggleSidebar, toggleEventState } = createEventSlice.actions


  
  export default createEventSlice.reducer
