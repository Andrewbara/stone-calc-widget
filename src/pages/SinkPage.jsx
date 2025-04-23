import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateWorktop } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/SinkPage.css"

const SinkPage = () => {
  const dispatch = useDispatch()
  const worktops = useSelector((state) => state.calculator.worktops)
  const activeIndex = useSelector((state) => state.calculator.activeIndex)
  const currentWorktop = worktops[activeIndex]

  const { data: installTypes, loading: loadingInstall } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/installation-types/",
    "installationTypes"
  )
  const { data: sinks, loading: loadingSinks } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/sinks/",
    "sinks"
  )
  const { data: exchangeRates, loading: loadingRates } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/exchange-rates/",
    "exchangeRates"
  )

  const [exchangeRate, setExchangeRate] = useState(100)

  const selectedInstallTypes = currentWorktop.sink?.type || []
  const selectedModels = currentWorktop.sink?.models || []
  const selectedMaterial = currentWorktop.material

  useEffect(() => {
    const usd = exchangeRates.find(r => r.currency === "USD")
    setExchangeRate(Number(usd?.rate) || 100)
  }, [exchangeRates])

  if (loadingInstall || loadingSinks || loadingRates) {
    return <div className="text-center py-6 text-gray-500">Загрузка данных о мойках...</div>
  }

  const handleToggleInstallType = (type) => {
    if (type.name === "Без установки") {
      dispatch(updateWorktop({
        index: activeIndex,
        data: { sink: { type: [{ ...type, quantity: 1 }], models: [] } }
      }))
    } else {
      const withoutNone = selectedInstallTypes.filter(t => t.name !== "Без установки")
      const exists = withoutNone.find(t => t.name === type.name)

      const updated = exists
        ? withoutNone.filter(t => t.name !== type.name)
        : [...withoutNone, { ...type, quantity: 1 }]

      dispatch(updateWorktop({
        index: activeIndex,
        data: { sink: { ...currentWorktop.sink, type: updated } }
      }))
    }
  }

  const handleInstallQtyChange = (typeName, newQty) => {
    const updated = selectedInstallTypes.map(t =>
      t.name === typeName ? { ...t, quantity: Number(newQty) } : t
    )
    dispatch(updateWorktop({ index: activeIndex, data: { sink: { ...currentWorktop.sink, type: updated } } }))
  }

  const handleSinkToggle = (sink) => {
    const exists = selectedModels.find(m => m.sinkId === sink.id)

    const updated = exists
      ? selectedModels.filter(m => m.sinkId !== sink.id)
      : [
          ...selectedModels,
          {
            sinkId: sink.id,
            name: sink.name,
            count: 1,
            price: Number(sink.price),
            stone_dependent: sink.stone_dependent,
            length: Number(sink.length),
            width: Number(sink.width),
            depth: Number(sink.depth)
          }
        ]

    dispatch(updateWorktop({
      index: activeIndex,
      data: { sink: { ...currentWorktop.sink, models: updated } }
    }))
  }

  const handleCountChange = (sinkId, count) => {
    const updatedModels = selectedModels.map(m =>
      m.sinkId === sinkId ? { ...m, count: +count } : m
    )
    dispatch(updateWorktop({
      index: activeIndex,
      data: { sink: { ...currentWorktop.sink, models: updatedModels } }
    }))
  }

  const isIntegrated = selectedInstallTypes.some(t => t.name === "Интегрированная мойка из камня")
  const integratedSinks = sinks.filter(s => s.installation_types.includes("Интегрированная мойка из камня"))

  const calculateSinkPrice = (sink) => {
    const usd = Number(selectedMaterial?.price || 0)
    const rate = usd * exchangeRate * 1.05
    const volume = (sink.length * sink.width * sink.depth) / 1_000_000_000
    return Math.round(volume * rate)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">4. Мойка</h2>

      <h3 className="text-lg font-semibold mb-2">Выберите тип установки мойки:</h3>
      <div className="sink-grid mb-8">
        {installTypes.map(type => {
          const selected = selectedInstallTypes.find(t => t.name === type.name)
          return (
            <div key={type.id} className={`sink-card ${selected ? "selected" : ""}`}>
              <div onClick={() => handleToggleInstallType(type)}>
                <img src={type.image || undefined} alt={type.name} className="sink-card__image" />
                <div className="sink-card__content">
                  <div className="sink-card__title">{type.name}</div>
                  <div className="sink-card__price">{+type.price} ₽</div>
                </div>
              </div>
              {selected && type.name !== "Без установки" && (
                <input
                  type="number"
                  className="sink-qty-input"
                  min={1}
                  placeholder="Количество"
                  value={selected.quantity}
                  onChange={(e) => handleInstallQtyChange(type.name, e.target.value)}
                />
              )}
            </div>
          )
        })}
      </div>

      <h3 className="text-lg font-semibold mb-2">Выберите модели интегрированных моек:</h3>
      <div className="sink-grid">
        {integratedSinks.map(sink => {
          const selected = selectedModels.find(m => m.sinkId === sink.id)
          const disabled = !isIntegrated
          const calculatedPrice = sink.stone_dependent
            ? calculateSinkPrice(sink)
            : Number(sink.price)

          return (
            <div
              key={sink.id}
              onClick={() => !disabled && handleSinkToggle(sink)}
              className={`sink-card ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
            >
              <img src={sink.image || undefined} alt={sink.name} className="sink-card__image" />
              <div className="sink-card__content">
                <div className="sink-card__title">{sink.name}</div>
                <div className="sink-card__price">{calculatedPrice} ₽</div>
                {selected && (
                  <input
                    type="number"
                    min={1}
                    placeholder="шт."
                    value={selected.count}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCountChange(sink.id, e.target.value)}
                    className="sink-qty-input"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SinkPage
