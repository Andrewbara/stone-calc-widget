const ManagerPage = ({ onBack }) => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">7. Связь с менеджером</h2>
        <p className="text-gray-700">Форма заявки или контакты (заглушка)</p>
  
        <div className="flex justify-start mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            &lt; Назад
          </button>
        </div>
      </div>
    )
  }
  
  export default ManagerPage
  
