/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;
let webSocketToken;

const publishVideoTrueBtn = document.querySelector('#publish-video-true');
const publishVideoFalseBtn = document.querySelector('#publish-video-false');
const audioConnectStartBtn = document.querySelector('#audio-connector-start');

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  console.log('Initializing Vonage Video session with applicationId:', applicationId, 'sessionId:', sessionId, 'token:', token);
  const session = OT.initSession(applicationId, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    resolution: '1280x720'
  };
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // fires if user revokes permission to camera and/or microphone
  publisher.on('accessDenied', (event) => {
    alert(event?.message);
  });
  
  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
    }
  });

  publishVideoTrueBtn.addEventListener('click',() => {
    publisher.publishVideo(true, (error) => {
      if (error) {
        handleError(error);
      } else {
        publishVideoTrueBtn.style.display = 'none';
        publishVideoFalseBtn.style.display = 'block';
      }
    });
  });

  publishVideoFalseBtn.addEventListener('click',() => {
    publisher.publishVideo(false, (error) => {
      if (error) {
          alert('error: ', error);
      } else {
        publishVideoFalseBtn.style.display = 'none';
        publishVideoTrueBtn.style.display = 'block';
      }
    });
  });

}

async function initializeAudioConnector() {
  try {
    // Make a POST request to the Audio Connector endpoint
    const apiResponse = await fetch(`${SAMPLE_SERVER_BASE_URL}/audio-connector/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "sessionId": sessionId,
        "webSocketHost": location.host
      })
    });
    const apiResponseJson = await apiResponse.json();
    console.log('Response from Audio Connect endpoint:', apiResponseJson);
  } catch (error) {
    handleError(error);
  };
}

audioConnectStartBtn.addEventListener('click',async () => {
  try {
    await initializeAudioConnector();
    audioConnectStartBtn.style.display = 'none';
  } catch (error) { 
    handleError(error);
    alert('Failed to connect to the Audio Connector endpoint.',error);
  }
});

// See the config.js file.
if (APPLICATION_ID && TOKEN && SESSION_ID) {
  applicationId = APPLICATION_ID;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Video Application ID, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    applicationId = json.applicationId;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize an Vonage Video Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get Vonage Video sessionId and token. Make sure you have updated the config.js file.');
  });
}
