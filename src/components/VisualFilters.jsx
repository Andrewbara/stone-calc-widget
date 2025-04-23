import { useEffect, useState } from "react"
import useFetchWithBackup from "../hooks/useFetchWithBackup"

const VisualFilters = ({ onChange }) => {
  const { data: shades = [] } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/shades/",
    "shades"
  )

  const { data: textures = [] } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/textures/",
    "textures"
  )

  const [selectedShade, setSelectedShade] = useState("")
  const [selectedTexture, setSelectedTexture] = useState("")

  useEffect(() => {
    onChange({ shade: selectedShade, texture: selectedTexture })
  }, [selectedShade, selectedTexture, onChange])

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <select
        value={selectedShade}
        onChange={(e) => setSelectedShade(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">Оттенок</option>
        {shades.map((s) => (
          <option key={s.id || s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={selectedTexture}
        onChange={(e) => setSelectedTexture(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">Фактура</option>
        {textures.map((t) => (
          <option key={t.id || t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default VisualFilters
