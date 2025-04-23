import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setEdgeProfiles, setBacksplashes } from "../store/slices/calculatorSlice"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import "../styles/EdgePage.css"

const EdgePage = () => {
  const dispatch = useDispatch()
  const { edges, backsplashes } = useSelector((state) => state.calculator)

  const { data: edgeOptions, loading: loadingEdges } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/edge-profiles/",
    "edges"
  )

  const { data: backsplashOptions, loading: loadingBacks } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/backsplashes/",
    "backsplashes"
  )

  const toggleEdge = (profile) => {
    const exists = edges.find(e => e.id === profile.id)
    if (exists) {
      dispatch(setEdgeProfiles(edges.filter(e => e.id !== profile.id)))
    } else {
      dispatch(setEdgeProfiles([...edges, { ...profile, length: 1 }]))
    }
  }

  const updateEdgeLength = (id, length) => {
    dispatch(setEdgeProfiles(edges.map(e => e.id === id ? { ...e, length } : e)))
  }

  const selectBacksplash = (item) => {
    dispatch(setBacksplashes([{ ...item, length: 1 }]))
  }

  const updateBacksplashLength = (id, length) => {
    dispatch(setBacksplashes(backsplashes.map(b => b.id === id ? { ...b, length } : b)))
  }

  if (loadingEdges || loadingBacks) {
    return <div className="text-center py-6 text-gray-500">Загрузка данных по кромкам и бортикам...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-6">3. Кромка и бортик</h2>

      <h3 className="text-lg font-semibold mb-2">Кромка</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {edgeOptions.map(profile => {
          const selected = edges.find(e => e.id === profile.id)
          return (
            <div
              key={profile.id}
              className={`select-card ${selected ? "selected" : ""}`}
              onClick={() => toggleEdge(profile)}
            >
              {profile.image && (
                <img src={profile.image} alt={profile.name} className="select-image" />
              )}
              <div className="select-content">
                <div className="font-medium">{profile.name}</div>
                <div className="text-sm text-gray-600">{profile.price_per_meter} ₽ / м</div>
                {selected && (
                  <input
                    type="number"
                    min="0"
                    className="select-input"
                    value={selected.length}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateEdgeLength(profile.id, +e.target.value)}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <h3 className="text-lg font-semibold mb-2">Бортик</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {backsplashOptions.map(item => {
          const selected = backsplashes.find(b => b.id === item.id)
          return (
            <div
              key={item.id}
              className={`select-card ${selected ? "selected" : ""}`}
              onClick={() => selectBacksplash(item)}
            >
              {item.image && (
                <img src={item.image} alt={item.name} className="select-image" />
              )}
              <div className="select-content">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">{item.price_per_meter} ₽ / м</div>
                {selected && (
                  <input
                    type="number"
                    min="0"
                    className="select-input"
                    value={selected.length}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateBacksplashLength(item.id, +e.target.value)}
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

export default EdgePage
