import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateWorktop } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/ExtraWorksPage.css"

const ExtraWorkPage = ({ onNext, onBack }) => {
  const dispatch = useDispatch()
  const activeIndex = useSelector((state) => state.calculator.activeIndex)
  const worktops = useSelector((state) => state.calculator.worktops)
  const currentWorktop = worktops[activeIndex]

  const { data: extraWorks, loading } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/extra-works/",
    "extraWorks"
  )

  const toggleExtraWork = (work) => {
    const selected = currentWorktop.extraWorks || []
    const exists = selected.find((w) => w.id === work.id)

    const updated = exists
      ? selected.filter((w) => w.id !== work.id)
      : [...selected, { ...work, count: 1 }]

    dispatch(updateWorktop({
      index: activeIndex,
      data: { extraWorks: updated }
    }))
  }

  const handleQtyChange = (id, value) => {
    const selected = currentWorktop.extraWorks || []
    const updated = selected.map((w) =>
      w.id === id ? { ...w, count: Number(value) } : w
    )

    dispatch(updateWorktop({
      index: activeIndex,
      data: { extraWorks: updated }
    }))
  }

  const isSelected = (id) =>
    (currentWorktop.extraWorks || []).some((w) => w.id === id)

  const getCount = (id) =>
    (currentWorktop.extraWorks || []).find((w) => w.id === id)?.count || 1

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Загрузка дополнительных работ...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">6. Доп. работы</h2>

      <div className="space-y-4 mb-10">
        {extraWorks.map((work) => {
          const selected = isSelected(work.id)
          const count = getCount(work.id)
          return (
            <div
              key={work.id}
              className="border p-4 rounded hover:shadow-sm transition extra-work-block"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleExtraWork(work)}
                  className="accent-red-600 w-5 h-5"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{work.name}</span>
                  <span className="text-sm text-gray-600">
                    {Number(work.price_per_unit).toFixed(0)} ₽ / {work.unit}
                  </span>
                </div>
              </label>

              {selected && (
                <div className="mt-2 flex items-center gap-2 qty-row">
                  <label className="text-sm text-gray-700 font-medium">
                    Кол-во:
                  </label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    value={count}
                    onChange={(e) => handleQtyChange(work.id, e.target.value)}
                  />
                  <span className="text-sm text-gray-600">{work.unit}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          &lt; Назад
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Вперёд &gt;
        </button>
      </div>
    </div>
  )
}

export default ExtraWorkPage
