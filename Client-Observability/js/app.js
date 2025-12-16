/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;

let intervalIds = {};

const publishVideoTrueBtn = document.querySelector('#publish-video-true');
const publishVideoFalseBtn = document.querySelector('#publish-video-false');
const subscriberContainer = document.querySelector('#subscriber');

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function startInterval(subscriber) {
  let intervalId;
  intervalId = setInterval(() => {
    subscriber.getStats((error, stats) => {
      if (error) {
        console.error('Error getting subscriber stats. ', error.message);
        return;
      }
      if (stats.senderStats) {
        document.querySelector(`#subscriber-client-observability-${subscriber.streamId}`).innerHTML = `
          Timestamp: ${stats.timestamp}<br>
          Connection max allocated bitrate: ${stats.senderStats.connectionMaxAllocatedBitrate} bps<br>
          Connection current estimated bandwidth: ${stats.senderStats.connectionEstimatedBandwidth} bps
        `
        console.log(`Connection max allocated bitrate: ${stats.senderStats.connectionMaxAllocatedBitrate} bps`);
        console.log(`Connection current estimated bandwidth: ${stats.senderStats.connectionEstimatedBandwidth} bps`);
      } else {
        console.log("Sender stats not available yet.");
      }
    });
  }, 1000);
  intervalIds[subscriber.streamId] = intervalId;
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

    // create a new div for subscriber
    const subscriberDiv = document.createElement('div');
    subscriberDiv.id = `subscriber-${event.stream.id}`;
    const subscriberClientObservabilityLabel = document.createElement('label');
    subscriberClientObservabilityLabel.id = `subscriber-client-observability-${event.stream.id}`;
    subscriberClientObservabilityLabel.className = 'subscriber-client-observability';
    subscriberDiv.appendChild(subscriberClientObservabilityLabel);
    subscriberContainer.appendChild(subscriberDiv);

    const subscriber = session.subscribe(event.stream, `subscriber-${event.stream.id}`, subscriberOptions, handleError);
    startInterval(subscriber);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  session.on('streamDestroyed', (event) => {
    clearInterval(intervalIds[event.stream.id]);
    delete intervalIds[event.stream.id];
    document.getElementById(`subscriber-${event.stream.id}`).remove();
  });

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    resolution: '1280x720',
    publishSenderStats: true // enable sender-side statistics
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
