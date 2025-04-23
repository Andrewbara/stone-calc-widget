import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import useFetchWithBackup from "../hooks/useFetchWithBackup"
import generatePDFBase64 from "../utils/generatePDF"
import axios from "axios"
import "../styles/ResultPage.css"

const ResultPage = () => {
  const { worktops, selectedAccessories, edges, backsplashes } = useSelector(state => state.calculator)

  const { data: exchangeRates, loading } = useFetchWithBackup(
    "https://stone-calc-backend.onrender.com/api/exchange-rates/",
    "exchangeRates"
  )

  const [usdRate, setUsdRate] = useState(95)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [channel, setChannel] = useState("email")
  const [contact, setContact] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const usd = exchangeRates.find(r => r.currency === "USD")
    if (usd) setUsdRate(parseFloat(usd.rate))
  }, [exchangeRates])

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Загрузка курса валют...</div>
  }

  const formatPrice = val => {
    const num = Math.round(Number(val) || 0)
    return num > 0 ? `${num.toLocaleString()} руб.` : null
  }

  const getMaterialCost = usd => usd * usdRate * 1.05 + 30000
  const getSheetRatio = a => a <= 0.6 ? 0.25 : a <= 1.2 ? 0.5 : a <= 1.8 ? 0.75 : a <= 2.4 ? 1 : Math.ceil(a / 2.4)
  const getArea = (d, s) => {
    const mm = v => Number(v || 0)
    if (s === "Прямая" || s === "Радиальная") return +(mm(d.length) * mm(d.width) / 1e6).toFixed(2)
    if (s === "Г - образная") return +((mm(d.length1) * mm(d.width1) + mm(d.length2) * mm(d.width1)) / 1e6).toFixed(2)
    if (s === "П - образная") return +((mm(d.length1) * mm(d.width1) + mm(d.length2) * mm(d.width2) + mm(d.length3) * mm(d.width3)) / 1e6).toFixed(2)
    return 0
  }

  const getPerimeter = (s, d) => {
    const mm = v => Number(v || 0)
    if (s === "Прямая" || s === "Радиальная") return (mm(d.length) + mm(d.width)) * 2
    if (s === "Г - образная") return (mm(d.length1) + mm(d.length2)) * 2
    if (s === "П - образная") return mm(d.length1) + mm(d.length2) + mm(d.length3) + mm(d.length2) + (mm(d.length3) - mm(d.width2)) + (mm(d.length1) - mm(d.width2))
    return 0
  }

  const getLinearMeters = (shape, dims) => +(getPerimeter(shape, dims) / 2 / 1000).toFixed(2)
  const getThickPrice = (t, m) => t > 100 ? m * 2000 : [50, 60, 70, 80, 90, 100, 110].includes(t) ? m * 1000 : 0

  const rows = []
  const materialInfo = { brand: "", name: "", image: "", sheets: 0 }

  worktops.forEach((w, i) => {
    const d = w.dimensions || {}
    const shape = w.shape?.name
    const t = Number(w.thickness || 0)
    const area = getArea(d, shape)
    const sheets = getSheetRatio(area)
    const matTotal = sheets * getMaterialCost(w.material?.price || 0)

    if (i === 0 && w.material) {
      Object.assign(materialInfo, {
        brand: w.material.manufacturer?.name || "-",
        name: w.material.name || "-",
        image: w.material.image || "",
        sheets,
      })
    }

    if (area > 0) rows.push(["Базовое изготовление (материалы, раскрой, склейка, шлифовка)", `${area} м²`, formatPrice(matTotal)])

    const edgeM = getLinearMeters(shape, d)

    edges.forEach(e => {
      const p = edgeM * Number(e.price_per_meter)
      if (p) rows.push([`Кромка "${e.name}"`, `${edgeM.toFixed(2)} м.п.`, formatPrice(p)])
    })

    backsplashes.forEach(b => {
      const p = edgeM * Number(b.price_per_meter)
      if (p) rows.push([`Бортик "${b.name}"`, `${edgeM.toFixed(2)} м.п.`, formatPrice(p)])
    })

    const thickPrice = getThickPrice(t, edgeM)
    if (t > 45 && thickPrice) rows.push([`Толщина ${t} мм`, `${edgeM.toFixed(2)} м.п.`, formatPrice(thickPrice)])

    w.sink?.type?.forEach(i => {
      const p = Number(i.price) * Number(i.quantity || 1)
      if (i.name !== "Без установки" && p) rows.push([`Тип установки: ${i.name}`, `${i.quantity} шт.`, formatPrice(p)])
    })

    w.sink?.models?.forEach(s => {
      if (!s.name || !s.count) return
      let price = Number(s.price)
      if (s.stone_dependent && s.length && s.width && s.depth && w.material?.price) {
        const volume = (s.length * s.width * s.depth) / 1e9
        price = volume * w.material.price * usdRate * 1.05
      }
      rows.push([`Интегр. мойка: ${s.name}`, `${s.count} шт.`, formatPrice(price * s.count)])
    })

    Object.entries(selectedAccessories || {}).forEach(([cat, item]) => {
      if (item?.name && item?.price) rows.push([`Аксессуар: ${cat} — ${item.name}`, "1 шт.", formatPrice(item.price)])
    })

    w.extraWorks?.forEach(wrk => {
      if (wrk.name && wrk.count > 0) rows.push([wrk.name, `${wrk.count} ${wrk.unit}`, formatPrice(wrk.count * wrk.price_per_unit)])
    })

    const corners = (w.corners || []).length
    if (corners > 0) rows.push(["Скругление углов", `${corners} шт.`, formatPrice(corners * 2000)])
  })

  const total = rows.reduce((sum, r) => sum + parseFloat((r[2] || "0").replace(/[^\d]/g, "")), 0)

  const handleSend = async () => {
    setSending(true)
    const pdfBase64 = await generatePDFBase64(rows, materialInfo, total)
    const link = channel === "email"
      ? contact
      : channel === "whatsapp"
        ? `https://wa.me/${contact}`
        : channel === "telegram"
          ? `https://t.me/${contact.replace("@", "")}`
          : `viber://chat?number=${contact}`

    const payload = {
      name,
      channel,
      contact: link,
      materialInfo,
      rows,
      total,
      pdf: pdfBase64,
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/send-pdf/`, payload)
      alert("Рассчёт отправлен!")
    } catch (e) {
      console.error(e)
      alert("Ошибка при отправке")
    }

    setSending(false)
    setModalOpen(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">7. Результаты расчёта</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 mb-6 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📩 Получить расчёт
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Отправка расчёта</h3>
            <input
              placeholder="Ваше имя"
              className="mb-3 w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className="mb-3 w-full border px-3 py-2 rounded"
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="viber">Viber</option>
            </select>
            <input
              placeholder={channel === "email" ? "Ваш Email *" : "Номер телефона *"}
              className="mb-4 w-full border px-3 py-2 rounded"
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Отмена</button>
              <button
                disabled={!contact || !name || sending}
                onClick={handleSend}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="mb-6 border border-gray-300 w-full table-auto text-sm">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="px-4 py-2 font-medium">Производитель камня</td>
            <td className="px-4 py-2">{materialInfo.brand}</td>
            <td rowSpan={3} className="w-32">
              {materialInfo.image && (
                <img src={materialInfo.image} alt="материал" className="w-24 h-24 object-cover rounded shadow" />
              )}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="px-4 py-2 font-medium">Наименование декора</td>
            <td className="px-4 py-2">{materialInfo.name}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-medium">Количество листов</td>
            <td className="px-4 py-2">{materialInfo.sheets} листов</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full table-auto border-collapse mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Наименование</th>
            <th className="border px-4 py-2 text-center">Кол-во</th>
            <th className="border px-4 py-2 text-right">Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row[0]}</td>
              <td className="border px-4 py-2 text-center">{row[1]}</td>
              <td className="border px-4 py-2 text-right">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-bold mt-4">
        Общая стоимость заказа: <span className="text-red-600">{total.toLocaleString()} руб.</span>
      </div>

      <div className="text-sm text-right text-gray-600">
        НДС отсутствует в связи с УСН
      </div>
    </div>
  )
}

export default ResultPage
