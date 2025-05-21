import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Alternatives from './pages/Alternatives/Alternatives';
import Criteria from './pages/Criteria/Criteria';
import Projects from './pages/Projects/Projects';
import Scenarios from './pages/Scenarios/Scenarios';
import ValueMatrix from './pages/ValueMatrix/ValueMatrix';
import Weights from './pages/Weights/Weights';



function App() {


  return (
    <BrowserRouter>
      <SideBar>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/criteria" element={<Criteria />} />
          <Route path="/alternatives" element={<Alternatives />} />
          <Route path="/weights" element={<Weights />} />
          <Route path="/value-matrix" element={<ValueMatrix />} />
        </Routes>
      </SideBar>
    </BrowserRouter>
  )
}

export default App
