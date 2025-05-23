import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  // Setting states for websites that are accepted, storing in array
  const [acceptedWebsite, setAcceptedWebsite] = useState("");
  const [submittedWebsites, setSubmittedWebsites] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()

    alert(acceptedWebsite)
  }

  return (
    <>
      <div>

    <h1>Productivity Tracker</h1>
    <h2>Goal:</h2>
    <h2>Time worked:</h2>
    
    <form onSubmit={handleSubmit}>
      <h6>Accepted Websites</h6>
      <label htmlFor="acceptedWebsites">Productive websites:</label>
      <input
        type="text"
        id="acceptedWebsites"
        onChange={(e) => setAcceptedWebsite(e.target.value)}
        value={acceptedWebsite}
      />

      <input
        type="submit"
        value="Submit"
        id="acceptedWebsitesSubmit"
      />

    </form>

          {submittedWebsites.map((site, index) => (
            <li key={index}>{site}</li>
          ))}
    

  </div>
    </>
  )


}

export default App
