// src/hooks/useFetchWithBackup.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import backupData from '../backup.json'

const useFetchWithBackup = (url, dataKey) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { timeout: 5000 }) // ⏱ добавлен таймаут
        const results = response.data.results || response.data
        if (Array.isArray(results)) {
          setData(results)
        } else {
          console.warn(`⚠️ Данные с ${url} не в формате массива, использую резервные`)
          setData(backupData[dataKey] || [])
        }
      } catch (error) {
        console.warn(`❌ Ошибка загрузки данных с ${url}:`, error.message || error)
        console.warn(`📦 Используются резервные данные: ${dataKey}`)
        setData(backupData[dataKey] || [])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, dataKey])

  return { data, loading }
}

export default useFetchWithBackup
