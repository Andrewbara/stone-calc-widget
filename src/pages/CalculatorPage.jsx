import { useState } from "react"
import Header from "../components/Header"
import StepWrapper from "../components/StepWrapper"
import StepTabs from "../components/StepTabs"

const Calculator = () => {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="min-h-screen bg-lightGray flex flex-col items-center">
      {/* Вкладки для материалов */}
      <div className="flex gap-2 mt-4">
        <div className="bg-red-600 text-white px-4 py-2 rounded-t font-medium">Акриловый камень</div>
        <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-t font-medium">Кварцевый агломерат</div>
      </div>


      {/* Контент */}
      <main className="w-full max-w-7xl px-4 py-6">
        <StepWrapper currentStep={currentStep} setStep={setCurrentStep} />
      </main>
    </div>
  )
}

export default Calculator
