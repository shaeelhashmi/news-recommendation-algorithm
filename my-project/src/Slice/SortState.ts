import { createSlice } from '@reduxjs/toolkit'

export const show = createSlice({
  name: 'SortState',
  initialState: {
    sort:false
  },
  reducers: {
    setShow: (state,actions) => {state.sort = actions.payload},
  },
})
export const { setShow } = show.actions

export default show.reducer