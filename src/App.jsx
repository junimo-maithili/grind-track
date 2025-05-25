import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import '../background.js'
//import '../testing.js'

// change this to hours mins secs format later
function increaseTimer(numSeconds) {
  return numSeconds + 1;
}

function App() {

  chrome.storage.local.get("allWebsites");
  chrome.storage.local.get("seconds");

  // Setting states for websites that are accepted, storing in array
  const [acceptedWebsite, setAcceptedWebsite] = useState("");
  const [submittedWebsites, setSubmittedWebsites] = useState([])
  const [tabUrl, setTabUrl] = useState('');
  const [seconds, setSeconds] = useState(0);

  // Load the acceptable websites in
  useEffect(() => {
    chrome.storage.local.get(["allWebsites"], (result) => {
      // If the list of websites exists, load it into submittedWebsites
      if (result.allWebsites) {
        setSubmittedWebsites(result.allWebsites);
      }
    });
  }, []);

  // Load the current time worked in
  useEffect(() => {
    chrome.storage.local.get(["seconds"], (result) => {
      // If the timer exists, load the time in
      if (result.seconds) {
        setSeconds(result.seconds);
      }
    });
  }, []);

  // Get the current tab
  useEffect(() => {
    // If there's a runtime error, send an alert (debugging)
    chrome.runtime.sendMessage({ type: 'GET_TAB' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Runtime error:", chrome.runtime.lastError.message);
      }
      // Send an alert of the current tab (debugging)
      else if (response?.tab?.url) {
        setTabUrl(response.tab.url);
      console.log("Current tab:", response.tab);

      }
      else {
        console.log("No tab received");

      }
    });
  }, []);

  // Submit button for acceptable websites
  const handleSubmit = (event) => {
    event.preventDefault();
    const newWebsites = [...submittedWebsites, acceptedWebsite.trim()];
    setSubmittedWebsites(newWebsites);
    chrome.storage.local.set({ allWebsites: newWebsites }, () => {});
  }

  // If website is one of the acceptable websites, start/continue timer
    let timeChange;
  useEffect(() => {
    const updateTimer = async () => {
      if (submittedWebsites.some(site => tabUrl.includes(site))) {
        intervalId = setInterval(() => {
          setSeconds(prev => prev + 1);
        }, 1000);
        //const timeElapsed = setInterval(increaseTimer, 1000);
      }
    }
    updateTimer();
  }, [tabUrl, submittedWebsites]);
  
  
  //if (submittedWebsites.includes(tabUrl)) {

    //setInterval(seconds = increaseTimer(seconds), 1000);
  //}
  // Maybe make a button so it can add the current tab
  
  // Main HTML for app
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

        <h5>Accepted Websites: {submittedWebsites.length === 0? "No websites submitted": submittedWebsites.join(', ')}</h5>

        <h5>{seconds}</h5>

  </div>
    </>
  )


}

export default App
