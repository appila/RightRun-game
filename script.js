body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #020617;
  color: #F7F7F8;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

h1 {
  margin-bottom: 10px;
}

.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  width: 90vw;
  max-width: 500px;
  height: 70vh;
  max-height: 700px;
  position: relative;
  justify-content: center;
}

#start-screen,
#game-over-screen {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(2, 6, 23, 0.95);
  color: #F7F7F8;
  text-align: center;
  padding: 40px 20px;
}

#start-screen.active,
#game-over-screen.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#start-btn,
.restart-btn {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 18px;
  background-color: #165DFB;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0444D3;
}

#gameCanvas {
  background-color: #0E172B;
  border: 2px solid #165DFB;
  border-radius: 12px;
  width: 90vw;
  aspect-ratio: 1 / 1.3;
  max-width: 500px;
  display: none;
}

#score-display,
#timer-display {
  font-size: 22px;
  font-weight: bold;
  background-color: #ffffff12;
  padding: 8px 16px;
  border-radius: 8px;
  color: #F7F7F8;
}

#floating-points {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: #4DC614;
  opacity: 0;
  transition: all 0.3s ease-out;
  pointer-events: none;
  z-index: 3;
}

a.game-link {
  color: #4DC614 !important;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none !important;
  margin-top: 20px;
  display: inline-block;
}

a.game-link:hover {
  text-decoration: underline !important;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.info-panel div {
  font-size: 22px;
  font-weight: bold;
  background-color: #1E293B;
  color: #F7F7F8;
  padding: 6px 12px;
  border-radius: 8px;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
