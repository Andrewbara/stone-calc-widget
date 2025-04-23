import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateWorktop } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"

const MaterialSelector = ({ worktopIndex }) => {
  const dispatch = useDispatch()
  const worktop = useSelector((state) => state.calculator.worktops[worktopIndex])
  const selectedMaterial = worktop.material

  const { data: categories, loading: loadingCategories } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/material-categories/",
    "categories"
  )

  const { data: products, loading: loadingProducts } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/products/",
    "materials"
  )

  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0])
    }
  }, [categories])

  const handleSelect = (product) => {
    dispatch(updateWorktop({
      index: worktopIndex,
      data: { material: product },
    }))
  }

  const filteredProducts = products.filter(p => p.category === selectedCategory?.id)

  if (loadingCategories || loadingProducts) {
    return <div className="text-center py-6 text-gray-500">Загрузка материалов...</div>
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded text-sm whitespace-nowrap ${selectedCategory?.id === cat.id ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map((material) => (
          <div
            key={material.id}
            className={`border p-2 rounded cursor-pointer hover:shadow-md ${selectedMaterial?.id === material.id ? "border-red-500" : "border-gray-300"}`}
            onClick={() => handleSelect(material)}
          >
            <img
              src={material.image}
              alt={material.name}
              className="w-full h-[100px] object-contain bg-white"
            />
            <div className="text-sm mt-1 font-medium text-center">
              {material.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaterialSelector
