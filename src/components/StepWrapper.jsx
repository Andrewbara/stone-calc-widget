import { useDispatch, useSelector } from "react-redux"
import StepTabs from "./StepTabs"
import {
  setCalculatedArea,
  setDimensionsData
} from "../store/slices/calculatorSlice"

import DimensionsPage from "../pages/DimensionsPage"
import MaterialPage from "../pages/MaterialsPage"
import EdgePage from "../pages/EdgePage"
import SinkPage from "../pages/SinkPage"
import AccessoryPage from "../pages/AccessoryPage"
import ExtraWorkPage from "../pages/ExtraWorkPage"
import ResultPage from "../pages/ResultPage"
import ManagerPage from "../pages/ManagerPage"

const StepWrapper = ({ currentStep, setStep }) => {
  const dispatch = useDispatch()
  const dimensionsData = useSelector(state => state.calculator.dimensionsData)

  const calculateArea = () => {
    const shapeName = Object.keys(dimensionsData)[0]
    const data = dimensionsData[shapeName]
    if (!shapeName || !data) return 0

    const toMM = (v) => Number(v) || 0

    switch (shapeName) {
      case "Прямая":
      case "Радиальная":
        return (toMM(data.length) * toMM(data.width)) / 1_000_000
      case "Г - образная":
        return ((toMM(data.length1) + toMM(data.length2)) * toMM(data.width1)) / 1_000_000
      case "П - образная":
        return (
          toMM(data.length1) * toMM(data.width1) +
          toMM(data.length2) * toMM(data.width2) +
          toMM(data.length3) * toMM(data.width3)
        ) / 1_000_000
      default:
        return 0
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      const area = calculateArea()
      dispatch(setCalculatedArea(area.toFixed(2)))
      console.log("📏 Площадь:", area.toFixed(2), "м²")
    }

    if (currentStep < 8) setStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setStep(currentStep - 1)
  }

  return (
    <div className="dimension-panel mt-4 relative">
      <StepTabs currentStep={currentStep} setStep={setStep} />

      {currentStep === 1 && (
        <DimensionsPage
          onNext={handleNext}
          setDimensionsData={(data) => dispatch(setDimensionsData(data))}
        />
      )}
      {currentStep === 2 && <MaterialPage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <EdgePage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 4 && <SinkPage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 5 && <AccessoryPage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 6 && <ExtraWorkPage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 7 && <ResultPage onNext={handleNext} onBack={handleBack} />}
      {currentStep === 8 && <ManagerPage onBack={handleBack} />}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded ${
            currentStep === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          &lt; Назад
        </button>
        {currentStep < 8 && (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Вперёд &gt;
          </button>
        )}
      </div>
    </div>
  )
}

export default StepWrapper
