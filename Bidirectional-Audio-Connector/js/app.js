/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;
let webSocketToken;
let connectionId;

// const publishVideoTrueBtn = document.querySelector('#publish-video-true');
// const publishVideoFalseBtn = document.querySelector('#publish-video-false');
const audioConnectStartBtn = document.querySelector('#audio-connector-start');
const audioConnectStopBtn = document.querySelector('#audio-connector-stop');

const questionP = document.getElementById('question');
const answerP = document.getElementById('answer');
const sourcesDiv = document.getElementById('sources');
const emojiDiv = document.getElementById('emoji');

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
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

  session.on("signal:question", (event) => {
    const signalData = JSON.parse(event.data);
    questionP.innerText = `Question: ${signalData.question}`;
    answerP.innerText = '';
    sourcesDiv.innerHTML = '';
  });

  session.on("signal:thinking", (event) => {
    // const signalData = JSON.parse(event.data);
    emojiDiv.innerHTML = "🤔";
  });

  session.on("signal:answering", (event) => {
    const signalData = JSON.parse(event.data);
    console.log('Answering:', signalData);
    answerP.innerText = `Answer: ${signalData.answer}`;
    sourcesDiv.innerHTML = signalData.sources.map(source => `<li><a href="${source.url}" target="_blank">${source.name}</a></li>`).join('');
    emojiDiv.innerHTML = "🤓";
  });

  session.on("signal:finished", (event) => {
    // const signalData = JSON.parse(event.data);
    emojiDiv.innerHTML = "🙂";
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

  // publishVideoTrueBtn.addEventListener('click',() => {
  //   publisher.publishVideo(true, (error) => {
  //     if (error) {
  //       handleError(error);
  //     } else {
  //       publishVideoTrueBtn.style.display = 'none';
  //       publishVideoFalseBtn.style.display = 'block';
  //     }
  //   });
  // });

  // publishVideoFalseBtn.addEventListener('click',() => {
  //   publisher.publishVideo(false, (error) => {
  //     if (error) {
  //         alert('error: ', error);
  //     } else {
  //       publishVideoFalseBtn.style.display = 'none';
  //       publishVideoTrueBtn.style.display = 'block';
  //     }
  //   });
  // });

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
    connectionId = apiResponseJson.connectionId;
    emojiDiv.innerHTML = "🙂";
    audioConnectStartBtn.disabled = false;
    audioConnectStopBtn.disabled = false;
    audioConnectStartBtn.style.display = 'none';
    audioConnectStopBtn.style.display = 'inline';

  } catch (error) {
    handleError(error);
  };
}

async function stopAudioConnector() {
  try {
    // Make a POST request to the Audio Connector endpoint
    await fetch(`${SAMPLE_SERVER_BASE_URL}/audio-connector/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId,
        connectionId
      })
    });
    emojiDiv.innerHTML = "😴";
    audioConnectStartBtn.disabled = false;
    audioConnectStopBtn.disabled = false;

    audioConnectStopBtn.style.display = 'none';
    audioConnectStartBtn.style.display = 'inline';

  } catch (error) {
    handleError(error);
  };
}

async function setSessionId() {
  console.log('Setting sessionId in server:', sessionId);
  try {
    // Make a POST request to the Audio Connector endpoint
    await fetch(`/set-session-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId
      })
    });
  } catch (error) {
    handleError(error);
  };

}

audioConnectStartBtn.addEventListener('click',async () => {
  try {
    audioConnectStartBtn.disabled = true;
    audioConnectStopBtn.disabled = true;
    // audioConnectStartBtn.style.display = 'none';
    // audioConnectStopBtn.style.display = 'inline';
    await initializeAudioConnector();
  } catch (error) { 
    audioConnectStopBtn.style.display = 'none';
    audioConnectStartBtn.style.display = 'inline';
    handleError(error);
    alert('Failed to connect to the Audio Connector endpoint.',error);
  }
});

audioConnectStopBtn.addEventListener('click',async () => {
  try {
    // audioConnectStopBtn.style.display = 'none';
    // audioConnectStartBtn.style.display = 'inline';
    audioConnectStartBtn.disabled = true;
    audioConnectStopBtn.disabled = true;

    await stopAudioConnector();
  } catch (error) { 
    handleError(error);
    alert('Failed to stop the Audio Connector connection.',error);
  }
});

// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Video Application ID, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    applicationId = json.applicationId;
    sessionId = json.sessionId;
    token = json.token;
    setSessionId();
    // Initialize an Vonage Video Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get Vonage Video sessionId and token. Make sure you have updated the config.js file.');
  });
}
