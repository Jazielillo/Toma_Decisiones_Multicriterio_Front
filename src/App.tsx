import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Alternatives from './pages/Alternatives/Alternatives';
import Criteria from './pages/Criteria/Criteria';
import Projects from './pages/Projects/Projects';
import Scenarios from './pages/Scenarios/Scenarios';
import ValueMatrix from './pages/ValueMatrix/ValueMatrix';
import Weights from './pages/Weights/Weights';
import Login from './pages/Login/Login';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
