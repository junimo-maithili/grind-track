import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import '../background.js'
//import '../testing.js'


function App() {

  

  // Setting states for websites that are accepted, storing in array
  const [acceptedWebsite, setAcceptedWebsite] = useState("");
  const [submittedWebsites, setSubmittedWebsites] = useState([])
  const [tabUrl, setTabUrl] = useState('');

  // Get the current tab
  useEffect(() => {
    // If there's a runtime error, send an alert (debugging)
    chrome.runtime.sendMessage({ type: 'GET_TAB' }, (response) => {
      if (chrome.runtime.lastError) {
        alert("Runtime error:", chrome.runtime.lastError.message);
      }
      // Send an alert of the current tab (debugging)
      else if (response?.tab?.url) {
        setTabUrl(response.tab.url);
      console.log("Current tab:", response.tab);
      alert(`Current tab URL: ${response.tab.url}`);

      }
      else {
        alert("No tab received");

      }
      
     

    });
  });

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
    <p>{tabUrl || 'Loading...'}</p>

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

    <h3 id="TIMER">AAAA</h3>

          {submittedWebsites.map((site, index) => (
            <li key={index}>{site}</li>
          ))}

    

  </div>
    </>
  )


}

export default App
