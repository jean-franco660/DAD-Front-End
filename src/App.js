import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowSupplier from './components/ShowSupplier';
import ShowStore from './components/ShowStore';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowSupplier></ShowSupplier>}></Route>
        <Route path='/' element={<ShowStore></ShowStore>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
