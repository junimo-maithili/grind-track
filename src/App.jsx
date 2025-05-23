import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import '../background.js'
import '../testing.js'

// Function to get current tab
async function getTab() {
  let queries = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queries);
  return tab;
}

function App() {

  // Setting states for websites that are accepted, storing in array
  const [acceptedWebsite, setAcceptedWebsite] = useState("");
  const [submittedWebsites, setSubmittedWebsites] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    alert(acceptedWebsite)
  }

  // Get the current tab
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_TAB' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError.message);
        alert("AAAAA");
      } else {
        console.log("Current tab:", response.tab);
        alert(`Current tab URL: ${response.tab.url}`);
        alert("OOOOOO");
      }
    });
  }, []);
  

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

    <p id="TIMER">AAAA</p>

          {submittedWebsites.map((site, index) => (
            <li key={index}>{site}</li>
          ))}

    

  </div>
    </>
  )


}

export default App
