import DimensionsPage from "../pages/DimensionsPage"

const StepOne = ({
  selected,
  setSelected,
  onNext,
  onBack,
  dimensionsData,
  setDimensionsData,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Шаг 1. Размер</h2>

      <DimensionsPage
        selected={selected}
        setSelected={setSelected}
        onNext={onNext}
        onBack={onBack}
        dimensionsData={dimensionsData}
        setDimensionsData={setDimensionsData}
      />
    </div>
  )
}

export default StepOne
