// ... otros imports
import { useState } from "react"
import { GiveRecognitionSection } from "./GiveRecognitionSection"

export default function Dashboard({ users, values, currentUser }) {
  const [showRecognition, setShowRecognition] = useState(false)

  return (
    <div>
      {/* ... otras tarjetas ... */}

      {/* Tarjeta para enviar reconocimiento */}
      <div
        className="dashboard-card reconocer-card" // tu clase de estilos aquí
        onClick={() => setShowRecognition(true)}
        style={{ cursor: "pointer" }}
      >
        <h3>Reconocer</h3>
        <p>Envía un reconocimiento</p>
      </div>

      {/* Modal de reconocimiento */}
      {showRecognition && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowRecognition(false)}>Cerrar</button>
            <GiveRecognitionSection
              users={users}
              values={values}
              currentUser={currentUser}
              onRecognitionSent={() => setShowRecognition(false)}
              onShowValues={() => {/* tu show values handler */}}
            />
          </div>
        </div>
      )}
    </div>
  )
}