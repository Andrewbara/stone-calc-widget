import { configureStore } from '@reduxjs/toolkit'
import calculatorReducer from './slices/calculatorSlice'

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
})
