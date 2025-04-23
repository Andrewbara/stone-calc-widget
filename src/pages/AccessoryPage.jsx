import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedAccessories } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/AccessoryPage.css"

const AccessoryPage = () => {
  const dispatch = useDispatch()
  const { selectedAccessories = {} } = useSelector(state => state.calculator)

  const { data: accessories, loading } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/accessories/",
    "accessories"
  )

  const handleSelect = (category, item) => {
    dispatch(setSelectedAccessories({
      ...selectedAccessories,
      [category]: item,
    }))
  }

  const isSelected = (category, itemId) =>
    selectedAccessories?.[category]?.id === itemId

  const grouped = accessories.reduce((acc, cur) => {
    if (!acc[cur.category]) acc[cur.category] = []
    acc[cur.category].push(cur)
    return acc
  }, {})

  useEffect(() => {
    if (
      Object.keys(selectedAccessories || {}).length === 0 &&
      accessories.length > 0
    ) {
      const defaults = {}
      accessories.forEach(item => {
        if (!defaults[item.category]) {
          defaults[item.category] = item
        }
      })
      dispatch(setSelectedAccessories(defaults))
    }
  }, [accessories])

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Загрузка аксессуаров...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">5. Аксессуары</h2>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <div className="accessory-grid">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelect(category, item)}
                className={`accessory-card ${isSelected(category, item.id) ? "selected" : ""}`}
              >
                <img src={item.image} alt={item.name} className="accessory-image" />
                <div className="accessory-info">
                  <div className="accessory-name">{item.name}</div>
                  <div className="accessory-price">{item.price} ₽</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AccessoryPage
