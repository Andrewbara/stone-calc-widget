// src/components/IframeWrapper.jsx
import { useEffect } from "react";

const IframeWrapper = ({ children }) => {
  // Уведомление родителя iframe об изменении высоты (если поддерживает postMessage)
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "iframeResize",
            height: document.body.scrollHeight,
          },
          "*"
        )
      }
    })

    resizeObserver.observe(document.body)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="iframe-container">
      <div className="iframe-content">
        {children}
      </div>
    </div>
  )
}

export default IframeWrapper
