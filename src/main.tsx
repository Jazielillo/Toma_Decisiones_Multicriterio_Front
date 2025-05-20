import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scenarios from './pages/Scenarios/Scenarios'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scenarios />
  </StrictMode>,
)
