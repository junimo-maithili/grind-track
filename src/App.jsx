import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import '../background.js'
//import '../testing.js'



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


  // Buttons
  // Submit button for acceptable websites
  const handleSubmit = (event) => {
    event.preventDefault();
    const newWebsites = [...submittedWebsites, acceptedWebsite.trim()];
    setSubmittedWebsites(newWebsites);
    chrome.storage.local.set({ allWebsites: newWebsites }, () => {});
  }

  // Reset button for timer
  const resetTimer = () => {
    setSeconds(0);
    chrome.storage.local.set({seconds:0});
  }

  const resetWebsites = () => {
    setSubmittedWebsites([]);
    chrome.storage.local.set({allWebsites:[]});
  }


  // Timer logic
  // If website is one of the acceptable websites, start/continue timer

   // If website is one of the acceptable websites, start/continue timer
    // If website is one of the acceptable websites, start/continue timer
    // If website is one of the acceptable websites, start/continue timer
    const increaseTimer = () => setSeconds(prev => prev + 1);
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
  

  
  // Save time worked to local storage
  useEffect(() => {
    chrome.storage.local.set({ seconds });
  }, [seconds]);

  let formattedTime = new Date(1000 * seconds).toISOString().substring(11, 19);



  // Main HTML for app
  return (
    <>
      <div>

        <h1><br/><br/><br/><br/></h1>
        <h2>Productivity Tracker</h2>
        <h4>Time Worked</h4>
        <h1>{formattedTime}</h1>
        
        <h2>Goal:</h2>


        <form onSubmit={handleSubmit}>
          <h3>-- Accepted Websites --</h3>
          
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

          <h5>{submittedWebsites.length === 0? "No websites submitted": submittedWebsites.join(', ')}</h5>

        </form>

        <button onClick={resetTimer}>Reset Timer</button>
        <button onClick={resetWebsites}>Clear Websites</button>

  </div>
    </>
  )


}

export default App
