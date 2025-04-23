import { useRef } from "react"
import dimensionInputsConfig from "../config/dimensionInputsConfig"
import "../styles/dimensions.css"

const WorktopCanvas = ({
  shape,
  activeCorners,
  toggleCorner,
  dimensionsData,
  handleInputChange,
  index
}) => {
  const config = dimensionInputsConfig[shape.name]
  const containerRef = useRef()
  const dataType = shape.data_type || config?.dataType || shape.name.toLowerCase().replace(/\s+/g, "")

  if (!config) return <p>Нет конфигурации для формы</p>

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Изделие № {index + 1}</h3>
      </div>

      <div className="shape-container variant" data-type={dataType} ref={containerRef}>
        <img
          src={shape.base_image}
          alt="Форма"
          className="w-full max-w-[694px] object-contain"
        />

        {shape.corners.map((corner) => {
          const isActive = activeCorners.includes(corner.position)

          return (
            <div
              key={corner.position}
              className={`raduisWrapper ${corner.css_class}`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => toggleCorner(corner.position)}
              />
              <img
                src={corner.overlay_image}
                alt={`R${corner.position}`}
                className={`ugol u_${dataType}r${corner.position}`}
                style={{ display: isActive ? "block" : "none" }}
              />
            </div>
          )
        })}

        {config.inputs.map((input, idx) => (
          <div key={input.field} className={`sizWrapper s${idx}`} data-dimension={input.field}>
            <input
              type="number"
              inputMode="numeric"
              pattern="\d*"
              placeholder={input.label || "Введите значение"}
              value={dimensionsData[shape.name]?.[input.field] || ""}
              onChange={(e) => handleInputChange(input.field, e.target.value)}
              className={`size s${idx}_val`}
            />
            <span className="ml-1 text-sm">мм</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorktopCanvas
