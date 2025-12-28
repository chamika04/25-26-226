
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'


function App() {
  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='app-container'>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default App
