import { useState } from "react"
import Header from "../components/Header"
import StepWrapper from "../components/StepWrapper"

const Calculator = () => {
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-lightGray flex flex-col items-center">
      {/* Tabs */}
      <div className="flex gap-2 mt-4">
        <div className="bg-red-600 text-white px-4 py-2 rounded-t font-medium">Акриловый камень</div>
        <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-t font-medium">Кварцевый агломерат</div>
      </div>

      {/* Steps */}
      <div className="flex gap-2 mt-2 text-sm text-gray-700">
        <div className={step === 1 ? "text-red-600 font-semibold" : ""}>1. Размер</div>
        <div className={step === 2 ? "text-red-600 font-semibold" : ""}>2. Материал</div>
        <div className={step === 3 ? "text-red-600 font-semibold" : ""}>3. Кромка и бортик</div>
        <div className={step === 4 ? "text-red-600 font-semibold" : ""}>4. Мойка</div>
        <div className={step === 5 ? "text-red-600 font-semibold" : ""}>5. Аксессуары</div>
        <div className={step === 6 ? "text-red-600 font-semibold" : ""}>6. Доп. работы</div>
        <div className={step === 7 ? "text-red-600 font-semibold" : ""}>7. Результат</div>
        <div className={step === 8 ? "text-red-600 font-semibold" : ""}>8. Менеджер</div>
      </div>

      {/* Шаги */}
      <main className="w-full max-w-7xl px-4 py-6">
        <StepWrapper currentStep={step} setStep={setStep} />
      </main>
    </div>
  )
}

export default Calculator
