import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scenarios from './pages/Scenarios/Scenarios'
import Projects from './pages/Projects/Projects'
import Alternatives from './pages/Alternatives/Alternatives'
import Weights from './pages/Weights/Weights'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Weights />
  </StrictMode>,
)
