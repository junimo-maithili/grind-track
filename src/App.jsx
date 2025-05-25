import {useState, useEffect} from 'react'
import './App.css'

function App() {

  // Loading in time and acceptable websites from local storage
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
  let urlObj;
  const handleSubmit = (event) => {
    event.preventDefault();
    let trimmedSite = acceptedWebsite.trim();
    try {
      urlObj = new URL(trimmedSite);
      trimmedSite = urlObj.hostname;
      alert(trimmedSite);

    } catch {}

    if (submittedWebsites.includes(trimmedSite)) {
      return;
    }

    const newWebsites = [...submittedWebsites, trimmedSite];
    setSubmittedWebsites(newWebsites);
    chrome.storage.local.set({allWebsites: newWebsites}, () => {});
  }

  // Reset button for websites
  const resetWebsites = () => {
    setSubmittedWebsites([]);
    chrome.storage.local.set({allWebsites:[]});
  }

  // Reset button for timer
  const resetTimer = () => {
    setSeconds(0);
    chrome.storage.local.set({seconds:0});
  }


  // Timer logic
  // If website is one of the acceptable websites, start/continue timer
  let interval = null;
  useEffect(() => {
    interval = setInterval(() => {
      chrome.runtime.sendMessage({type:"CONTINUE_TIMER" }, (response) => {
        chrome.storage.local.get("seconds", (numSeconds) => {
        setSeconds(numSeconds.seconds)
      });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tabUrl, submittedWebsites]);

  let formattedTime = new Date(1000 * seconds).toISOString().substring(11, 19);



  // Main HTML for app
  return (
    <>
      <div>
        <h2>⋆⭒˚.⋆GrindTrack⋆⭒˚.⋆</h2>
        <h1>{formattedTime}</h1>

        <form onSubmit={handleSubmit}>
          <br/>
          <h5><br/>═════════════════════</h5>
          <h5>⊹︶︶⊹︶︶୨୧︶︶⊹︶︶⊹︶︶୨୧︶︶⊹︶︶⊹</h5>

          <h3>Accepted Websites</h3>
          <h4>{submittedWebsites.length === 0? "No websites submitted": submittedWebsites.join(', ')}</h4>
          
          <span className="addWesbite">
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
          </span>
        </form>


        <button className="btn" onClick={resetTimer}>Reset Timer</button>
        <button className="btn" onClick={resetWebsites}>Clear Websites</button>

  </div>
    </>
  )


}

export default App
