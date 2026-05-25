import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home            from './pages/Home'
import Viaturas        from './pages/Viaturas'
import Sobre           from './pages/Sobre'
import Contacto        from './pages/Contacto'
import Privacidade     from './pages/Privacidade'
import TermosDeUso     from './pages/TermosDeUso'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/viaturas" element={<Layout><Viaturas /></Layout>} />
        <Route path="/sobre" element={<Layout><Sobre /></Layout>} />
        <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
        <Route path="/politica-de-privacidade" element={<Layout><Privacidade /></Layout>} />
        <Route path="/termos-de-uso" element={<Layout><TermosDeUso /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
