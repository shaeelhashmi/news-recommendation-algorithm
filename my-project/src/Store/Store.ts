import { configureStore } from '@reduxjs/toolkit'
import SortState from '../Slice/SortState'
export default configureStore({
  reducer: {
    SortState:SortState
  },
})