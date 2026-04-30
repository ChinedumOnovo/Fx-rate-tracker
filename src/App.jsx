import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Landing from './pages/Landing'
import RatesTable from './pages/RatesTable'
import Converter from './pages/Converter'
import CurrencyInfo from './pages/CurrencyInfo'
import { FXProvider } from './context/FXContext'

function App() {
  return (
    <FXProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/rates" element={<RatesTable />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/currency-info" element={<CurrencyInfo />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </FXProvider>
  )
}

export default App