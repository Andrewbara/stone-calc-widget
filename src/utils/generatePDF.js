const loadImageAsBase64 = async (url) => {
    const res = await fetch(url)
    const blob = await res.blob()
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
  
  const generatePDFBase64 = async (rows, materialInfo, total) => {
    if (!window.pdfMake) throw new Error("pdfMake не подключён")
  
    let materialImageBase64 = null
    if (materialInfo.image) {
      try {
        materialImageBase64 = await loadImageAsBase64(materialInfo.image)
      } catch (e) {
        console.warn("⚠ Не удалось загрузить изображение материала:", e)
      }
    }
  
    const docDefinition = {
      content: [
        { text: "Коммерческое предложение", style: "header" },
        { text: new Date().toLocaleDateString(), style: "date" },
  
        { text: "\nИнформация о материале:", style: "subheader" },
        {
          columns: [
            {
              width: "*",
              stack: [
                `Производитель: ${materialInfo.brand}`,
                `Декор: ${materialInfo.name}`,
                `Кол-во листов: ${materialInfo.sheets}`,
              ],
            },
            materialImageBase64 && {
              width: 100,
              image: materialImageBase64,
              fit: [100, 100],
            },
          ].filter(Boolean),
          margin: [0, 0, 0, 10],
        },
  
        { text: "Расчёт стоимости:", style: "subheader" },
        {
          table: {
            widths: ["*", "auto", "auto"],
            body: [["Наименование", "Кол-во", "Стоимость"], ...rows],
          },
          layout: "lightHorizontalLines",
        },
  
        {
          text: `\nИтого: ${total.toLocaleString()} руб.`,
          style: "total",
        },
  
        {
          text: "\n* Все цены указаны без учета НДС (УСН)",
          style: "note",
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        date: { alignment: "right", margin: [0, 0, 0, 20] },
        total: { fontSize: 16, bold: true, alignment: "right" },
        note: { fontSize: 10, italics: true, alignment: "right" },
      },
      defaultStyle: {
        fontSize: 11,
      },
    }
  
    return new Promise((resolve) =>
      window.pdfMake.createPdf(docDefinition).getBase64(resolve)
    )
  }
  
  export default generatePDFBase64
  
