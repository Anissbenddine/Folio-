import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Completed from './pages/Completed';
import Home from "./pages/Home";
import NotCompleted from './pages/NotCompleted';


function App() {
  return (
    <div className="w-full">
      <h1 className="flex content-center justify-center h-full items-center text-2xl font-bold my-2">Miloguide TODO app</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/completed' element={<Completed />} />
          <Route path='/not-completed' element={<NotCompleted />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
