import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Alternatives from './pages/Alternatives/Alternatives';
import Criteria from './pages/Criteria/Criteria';
import Projects from './pages/Projects/Projects';
import Scenarios from './pages/Scenarios/Scenarios';
import Reports from './pages/Reports/Reports';
import ScenarioComparison from './pages/Reports/ScenarioComparison';
import ValueMatrix from './pages/ValueMatrix/ValueMatrix';
import Weights from './pages/Weights/Weights';
import Login from './pages/Login/Login';
import ElectreInfo from './pages/Landing/ElectreInfo';
import PublicAlternatives from './pages/public/publicAlternatives';
import PublicCriteria from './pages/public/publicCriteria';
import PublicValueMatrix from './pages/public/publicValueMatrix';
import PublicWeights from './pages/public/publicWeights';
import PrivateRoute from './Components/PrivateRoute';
import ErrorPage from './pages/error/Error';  
import { ToastContainer } from 'react-toastify'
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer

      />
      <Routes>
        {/* Ruta pública */}
        <Route path="" element={<ElectreInfo/>}/> 
        <Route path="/login" element={<Login />} />
        <Route path="/public/alternatives" element={<PublicAlternatives />} />
        <Route path="/public/criteria" element={<PublicCriteria />} />
        <Route path="/public/weights" element={<PublicWeights />} />
        <Route path="/public/value-matrix" element={<PublicValueMatrix />} />


        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
        <PrivateRoute>
          <SideBar>
            <Projects />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
        <PrivateRoute>
          <SideBar>
            <Projects />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/scenarios"
          element={
        <PrivateRoute>
          <SideBar>
            <Scenarios />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/criteria"
          element={
        <PrivateRoute>
          <SideBar>
            <Criteria />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/alternatives"
          element={
        <PrivateRoute>
          <SideBar>
            <Alternatives />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/weights"
          element={
        <PrivateRoute>
          <SideBar>
            <Weights />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/value-matrix"
          element={
        <PrivateRoute>
          <SideBar>
            <ValueMatrix />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
        <PrivateRoute>
          <SideBar>
            <Reports />
          </SideBar>
        </PrivateRoute>
          }
        />
        <Route
          path="/scenario-comparison"
          element={
        <PrivateRoute>
          <SideBar>
            <ScenarioComparison />
          </SideBar>
        </PrivateRoute>
          }
        />

        {/* Ruta de error */}
        <Route path="/error" element={<ErrorPage />} />
        {/* Redirige cualquier ruta no encontrada a /error */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
      
    </BrowserRouter>
    
  );
}

export default App;
