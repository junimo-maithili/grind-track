import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import '../background.js'
//import '../testing.js'



function App() {

  const timerInterval = useRef(null);  


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


  // Timer logic
  // If website is one of the acceptable websites, start/continue timer
  useEffect(() => {
    const updateTimer = async (message) => {
        if (message.type === "STOP_TIMER") {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
          }
        }
        else if (message.type === "CONTINUE_TIMER") {
            if (!timerInterval.current && submittedWebsites.some(site => tabUrl.includes(site))) {
              timerInterval.current = setInterval(() => {
                setSeconds(prev => prev + 1);
              }, 1000);
            }
          
      }
    }
    chrome.runtime.onMessage.addListener(updateTimer);

    // On return, delete the listener and clear the interval (stop increasing)
    return () => {
      chrome.runtime.onMessage.removeListener(updateTimer);
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };

  }, [submittedWebsites, tabUrl]);

  

  
  // Save time worked to local storage
  useEffect(() => {
    chrome.storage.local.set({ seconds });
  }, [seconds]);


  // Main HTML for app
  return (
    <>
      <div>

        <h1>Productivity Tracker</h1>
        <h2 id="timeWorked">{seconds}</h2>
        <h2>Goal:</h2>

        <form onSubmit={handleSubmit}>
          <h3>-- Accepted Websites --</h3>
          <h5>{submittedWebsites.length === 0? "No websites submitted": submittedWebsites.join(', ')}</h5>

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



  </div>
    </>
  )


}

export default App
