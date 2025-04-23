import "../styles/StepTabs.css"


const steps = [
  "Размер",
  "Материал",
  "Кромка и бортик",
  "Мойка",
  "Аксессуары",
  "Доп. работы",
  "Результат",
  "Менеджер",
]

const StepTabs = ({ currentStep, setStep }) => {
  return (
    <div className="step-tabs-wrapper">
      {steps.map((title, index) => {
        const isActive = currentStep === index + 1
        return (
          <div
            key={index}
            onClick={() => setStep(index + 1)}
            className={`step-tab ${isActive ? "active" : ""}`}
          >
            {index + 1}. {title}
          </div>
        )
      })}
    </div>
  )
}

export default StepTabs
