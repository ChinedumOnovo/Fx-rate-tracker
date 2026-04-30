import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Landing from './pages/Landing'
import RatesTable from './pages/RatesTable'
import Converter from './pages/Converter'
import CurrencyInfo from './pages/CurrencyInfo'
import Privacy from './pages/Privacy'
import { FXProvider } from './context/FXContext'

function NotFound() {
  return (
    <div className="page-container max-w-lg mx-auto text-center py-24">
      <p className="text-6xl font-bold text-indigo-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-navy-700 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  )
}

function App() {
  return (
    <FXProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/rates" element={<RatesTable />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/currency-info" element={<CurrencyInfo />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </FXProvider>
  )
}

export default App