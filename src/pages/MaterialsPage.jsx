import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateWorktop } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/MaterialsPage.css"

const MaterialsPage = () => {
  const dispatch = useDispatch()
  const worktops = useSelector((state) => state.calculator.worktops)
  const activeIndex = useSelector((state) => state.calculator.activeIndex)
  const currentWorktop = worktops[activeIndex]

  // ✅ Получаем материалы с fallback на backup.json
  const { data: products, loading } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/products/",
    "materials"
  )

  const [selectedBrand, setSelectedBrand] = useState("")
  const [shadeFilter, setShadeFilter] = useState("")
  const [textureFilter, setTextureFilter] = useState("")

  // ✅ Обновляем бренд при наличии данных
  useEffect(() => {
    if (products.length > 0) {
      const firstBrandWithLogo = products.find(p => p.manufacturer.logo)
      setSelectedBrand(firstBrandWithLogo?.manufacturer?.name || products[0]?.manufacturer?.name)
    }
  }, [products])

  // ✅ Пока грузим — показываем сообщение
  if (loading) {
    return <div className="text-center py-6 text-gray-500">Загрузка материалов...</div>
  }

  const brands = Array.from(
    new Map(products.map(p => [p.manufacturer.name, p.manufacturer])).values()
  )

  const filteredMaterials = products.filter(product => {
    const matchBrand = product.manufacturer.name === selectedBrand
    const matchShade = !shadeFilter || product.available_shades.some(s => s.name === shadeFilter)
    const matchTexture = !textureFilter || product.available_textures.some(t => t.name === textureFilter)
    return matchBrand && matchShade && matchTexture
  })

  const selectedMaterial = currentWorktop.material

  const handleMaterialSelect = (material) => {
    dispatch(updateWorktop({ index: activeIndex, data: { material } }))
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">2. Материал</h2>

      {/* 🔷 Карусель брендов */}
      <div className="brand-carousel-wrapper">
        <div className="brand-carousel no-scrollbar">
          {brands.map(brand => (
            <img
              key={brand.name}
              src={brand.logo || null}
              alt={brand.name}
              className={`brand-logo ${selectedBrand === brand.name ? "selected" : ""}`}
              onClick={() => setSelectedBrand(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* 🔷 Фильтры */}
      <div className="filters-container">
        <select value={shadeFilter} onChange={(e) => setShadeFilter(e.target.value)}>
          <option value="">Оттенок</option>
          {Array.from(new Set(products.flatMap(p => p.available_shades.map(s => s.name)))).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select value={textureFilter} onChange={(e) => setTextureFilter(e.target.value)}>
          <option value="">Фактура</option>
          {Array.from(new Set(products.flatMap(p => p.available_textures.map(t => t.name)))).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* 🔷 Материалы */}
      <div className="materials-grid">
        {filteredMaterials.map(material => (
          <div
            key={material.id}
            className={`material-card-overlay ${selectedMaterial?.id === material.id ? "selected" : ""}`}
            onClick={() => handleMaterialSelect(material)}
          >
            {material.image ? (
              <img src={material.image} alt={material.name} className="material-overlay-img" />
            ) : (
              <div className="material-overlay-img bg-gray-200 text-center text-xs flex items-center justify-center">
                Нет изображения
              </div>
            )}
            <div className="material-overlay-content">
              <div className="material-line price">{Number(material.price_per_m2).toFixed(0)} ₽ / м²</div>
              <div className="material-line code">{material.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaterialsPage
