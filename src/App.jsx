import {useState, useEffect} from 'react'
import './App.css'

function App() {

  // Loading in time and acceptable websites from local storage

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
    // Only save the domain name
    try {
      urlObj = new URL(trimmedSite);
      trimmedSite = urlObj.hostname;

    } catch {}

    // Only add if the website isn't already in the list
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
    chrome.storage.local.set({startTime:Date.now(), timeElapsed:0});

  }

  // Timer logic
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      if (submittedWebsites.some(site => tabUrl.includes(site))) {
        chrome.storage.local.get(["startTime", "timeElapsed"], (result) => {
          let startingTime = result.startTime || 0;
          let oldTimeElapsed = result.timeElapsed || 0;

          // If startingTime doesn't exist, start timer by setting a new startingTime
          if (!startingTime) {
            chrome.storage.local.set({startTime:Date.now()}); 
          } else {

          // Calculate time passed
          const elapsedSeconds = Math.floor((Date.now() - startingTime) / 1000) + oldTimeElapsed;
          setSeconds(elapsedSeconds);
          }
        });

      } else {
        chrome.storage.local.get(["startTime", "timeElapsed"], (result) => {
          const startingTime = result.startTime ?? 0;
          let oldTimeElapsed = result.timeElapsed ?? 0;
          
          // Recalculating the time elapsed and adding it to storage
          if (startingTime != 0) {
          const sessionElapsed = Math.floor((Date.now() - startingTime) / 1000);
          const totalElapsed = sessionElapsed + oldTimeElapsed;

          chrome.storage.local.set({timeElapsed:totalElapsed, startTime: 0});
          
            setSeconds(elapsedSeconds)
          }
          

        });
      }
      }, 1000);

      return () => clearInterval(interval);
    }, [submittedWebsites, tabUrl]);
  
    const validSeconds = isNaN(seconds) ? 0 : seconds;
    let formattedTime = "00:00:00";
    if (!isNaN(validSeconds)) {
      formattedTime = new Date(validSeconds * 1000).toISOString().substring(11, 19);
    }



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
