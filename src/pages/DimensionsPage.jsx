import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  updateWorktop,
  addWorktop,
  removeWorktop,
  setWorktops
} from "../store/slices/calculatorSlice"
import WorktopCanvas from "../components/WorktopCanvas"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/dimensions.css"

const DEFAULT_DIMENSIONS = {
  length: 1000,
  width: 600,
  length1: 1000,
  length2: 600,
  length3: 600,
  width1: 600,
  width2: 600,
  width3: 600
}

const DimensionsPage = ({ setDimensionsData }) => {
  const dispatch = useDispatch()
  const worktops = useSelector((state) => state.calculator.worktops)
  const [shapes, setShapes] = useState([])

  const { data: shapeList, loading } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/shapes/",
    "shapes"
  )

  useEffect(() => {
    if (shapeList.length) {
      setShapes(shapeList)
      if (worktops.length === 0) {
        const initialShape = shapeList[0]
        dispatch(setWorktops([{
          id: Date.now(),
          shape: initialShape,
          dimensions: DEFAULT_DIMENSIONS,
          thickness: 40,
          corners: [],
          material: null,
          edgeProfiles: [],
          backsplash: null,
          sink: { type: null, models: [] },
          accessories: {},
          extraWorks: []
        }]))
      }
    }
  }, [shapeList])

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Загрузка форм столешниц...</div>
  }

  const handleInputChange = (index, field, value) => {
    const updatedDims = {
      ...worktops[index].dimensions,
      [field]: value
    }

    const shapeName = worktops[index].shape?.name
    const toMM = (v) => parseFloat(v) || 0

    let area = 0
    let perimeter = 0

    if (shapeName === "Прямая" || shapeName === "Радиальная") {
      const l = toMM(updatedDims.length)
      const w = toMM(updatedDims.width)
      area = (l * w) / 1_000_000
      perimeter = (l + w) * 2
    }

    if (shapeName === "Г - образная") {
      const l1 = toMM(updatedDims.length1)
      const l2 = toMM(updatedDims.length2)
      const w1 = toMM(updatedDims.width1)
      area = (l1 * w1 + l2 * w1) / 1_000_000
      perimeter = (l1 + l2) * 2
    }

    if (shapeName === "П - образная") {
      const l1 = toMM(updatedDims.length1)
      const l2 = toMM(updatedDims.length2)
      const l3 = toMM(updatedDims.length3)
      const w2 = toMM(updatedDims.width2)
      const w1 = toMM(updatedDims.width1)
      const w3 = toMM(updatedDims.width3)

      area = (l1 * w1 + l2 * w2 + l3 * w3) / 1_000_000
      perimeter = (
        l1 + l2 + l3 +
        l2 + (l3 - w2) + (l1 - w2)
      )
    }

    dispatch(updateWorktop({
      index,
      data: {
        dimensions: updatedDims,
        calculatedArea: +area.toFixed(2),
        calculatedPerimeter: +perimeter.toFixed(0)
      }
    }))

    if (shapeName) {
      setDimensionsData({ [shapeName]: updatedDims })
    }
  }

  const handleShapeChange = (index, shape) => {
    dispatch(updateWorktop({
      index,
      data: {
        shape,
        corners: [],
        dimensions: DEFAULT_DIMENSIONS
      }
    }))
  }

  const handleCornerToggle = (index, pos) => {
    const current = worktops[index].corners || []
    const updated = current.includes(pos)
      ? current.filter(p => p !== pos)
      : [...current, pos]

    dispatch(updateWorktop({
      index,
      data: { corners: updated }
    }))
  }

  const handleThicknessChange = (index, value) => {
    dispatch(updateWorktop({ index, data: { thickness: +value } }))
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">1. Размер</h2>

      {worktops.map((block, idx) => (
        <div key={block.id} className="mb-12 border-t border-gray-300 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              🧱 Столешница №{idx + 1}
            </h3>
            {idx > 0 && (
              <button
                onClick={() => dispatch(removeWorktop(idx))}
                className="text-sm text-red-600 hover:underline"
              >
                🪚 Удалить
              </button>
            )}
          </div>

          <div className="flex gap-12">
            <aside className="shape-selector-panel">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleShapeChange(idx, shape)}
                  className={`w-full border rounded overflow-hidden hover:shadow-md mb-2 ${
                    block.shape?.id === shape.id
                      ? "border-red-500 ring-2 ring-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={shape.base_image}
                    alt={shape.name}
                    className="w-full h-[80px] object-contain bg-white"
                  />
                  <div className="text-center py-1 text-sm font-medium bg-gray-50">
                    {shape.name}
                  </div>
                </button>
              ))}

              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Толщина:
                </label>
                <select
                  value={block.thickness}
                  onChange={(e) => handleThicknessChange(idx, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                >
                  {[12, 20, 24, 30, 36, 38, 40, 45, 50, 60, 70, 80, 90, 100, 110].map(v => (
                    <option key={v} value={v}>{v} мм</option>
                  ))}
                </select>
              </div>
            </aside>

            <div className="shape-display-panel">
              {block.shape && (
                <WorktopCanvas
                  shape={block.shape}
                  activeCorners={block.corners || []}
                  toggleCorner={(pos) => handleCornerToggle(idx, pos)}
                  dimensionsData={{ [block.shape.name]: block.dimensions }}
                  handleInputChange={(field, val) => handleInputChange(idx, field, val)}
                  index={idx}
                  removable={idx > 0}
                  onRemove={() => dispatch(removeWorktop(idx))}
                  placeholders={{
                    length: "Длина (мм)",
                    width: "Ширина (мм)",
                    length1: "Длина 1 (мм)",
                    length2: "Длина 2 (мм)",
                    length3: "Длина 3 (мм)",
                    width1: "Ширина 1 (мм)",
                    width2: "Ширина 2 (мм)",
                    width3: "Ширина 3 (мм)"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={() => dispatch(addWorktop())}
          disabled={worktops.length >= 3}
          className={`px-6 py-2 rounded text-sm ${
            worktops.length >= 3
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          + Добавить форму
        </button>
      </div>
    </div>
  )
}

export default DimensionsPage
