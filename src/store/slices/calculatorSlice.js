import { createSlice } from '@reduxjs/toolkit'

// 📐 Утилита для расчёта площади
const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setWorktops: (state, action) => {
      state.worktops = action.payload.map(w => ({
        ...w,
        calculatedArea: calculateAreaByShape(w.shape?.name, w.dimensions, w.thickness)
      }))
    },

    updateWorktop: (state, action) => {
      const { index, data } = action.payload
      const current = state.worktops[index]
      const updated = { ...current, ...data }

      const shape = data.shape?.name || current.shape?.name
      const dims = data.dimensions || current.dimensions
      const t = data.thickness || current.thickness

      updated.calculatedArea = calculateAreaByShape(shape, dims, t)
      state.worktops[index] = updated
    },

    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload
    },

    addWorktop: (state) => {
      if (state.worktops.length >= 3) return
      state.worktops.push({
        id: Date.now(),
        shape: null,
        dimensions: { length: 1000, width: 600 },
        thickness: 40,
        corners: [],
        material: null,
        edgeProfiles: [],
        backsplash: null,
        sink: { type: [], models: [] },
        accessories: {},
        extraWorks: [],
        calculatedArea: 0,
      })
    },

    removeWorktop: (state, action) => {
      const index = action.payload
      if (index === 0) return
      state.worktops.splice(index, 1)
    },

    setDimensionsData: (state, action) => {
      state.dimensionsData = action.payload
    },

    setCalculatedArea: (state, action) => {
      state.calculatedArea = action.payload
    },

    setEdgeProfiles: (state, action) => {
      state.edges = action.payload
    },

    setBacksplashes: (state, action) => {
      state.backsplashes = action.payload
    },

    setAccessoryCategory: (state, action) => {
      state.accessoryCategory = action.payload
      state.accessoryItems = []
      state.selectedAccessory = null
    },

    setAccessoryItems: (state, action) => {
      state.accessoryItems = action.payload
    },

    setSelectedAccessory: (state, action) => {
      const { type, item } = action.payload
      state.selectedAccessories[type] = item
    },

    setSelectedAccessories: (state, action) => {
      state.selectedAccessories = action.payload
    },

    clearAccessory: (state) => {
      state.accessoryCategory = null
      state.accessoryItems = []
    }
  }
})

export const {
  setWorktops,
  updateWorktop,
  setActiveIndex,
  addWorktop,
  removeWorktop,
  setDimensionsData,
  setCalculatedArea,
  setEdgeProfiles,
  setBacksplashes,
  setAccessoryCategory,
  setAccessoryItems,
  setSelectedAccessory,
  setSelectedAccessories, // ✅ добавлен
  clearAccessory
} = calculatorSlice.actions

export default calculatorSlice.reducer
