/* global OT SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;
let publisher;
let subscriber;
let captions;

// clears after a set amount of time
let captionsRemovalTimer;

const captionsStartBtn = document.querySelector('#start');
const captionsStopBtn = document.querySelector('#stop');
const captionsBox = document.querySelector('#captions-box');
const captionsText = document.querySelector('#captions-text');

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

async function initializeSession() {
  let session = OT.initSession(applicationId, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', async (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      testNetwork: true,
    };
    subscriber = session.subscribe(
      event.stream,
      'subscriber',
      subscriberOptions,
      handleError
    );

    // add captions to the subscriber object
    try {
      await subscriber.subscribeToCaptions(true);
    } catch (error) {
      handleError(error);
    }

    subscriber.on('captionReceived', (event) => {
      console.log('captionReceived event: ', event);
      if (!captions) {
        // Client didn't initiate the captions. Remove controls.
        captionsStartBtn.style.display = 'none';
        captionsStopBtn.style.display = 'none';
      }
      captionsBox.style.display = 'flex';
      captionsText.textContent = event.caption;
      // remove the captions after 5 seconds
      const removalTimerDuration = 5 * 1000;
      clearTimeout(captionsRemovalTimer);
      captionsRemovalTimer = setTimeout(() => {
        captionsBox.style.display = 'none';
        captionsText.textContent = '';
      }, removalTimerDuration);
    });
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, initialize a publisher and publish to the session
      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        publishCaptions: true,
      };
      publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
        if (err) {
          handleError(err);
        } else {
          session.publish(publisher, handleError);
        }
      });
    }
  });
}

async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('error getting data!');
    }
    return response.json();
  } catch (error) {
    handleError(error);
  }
}

async function startCaptions() {
  console.log('start captions');
  try {
    captions = await postData(SAMPLE_SERVER_BASE_URL + '/captions/start', {
      sessionId,
      token,
    });
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  } catch (error) {
    handleError(error);
  }
}

async function stopCaptions() {
  console.log('stop captions');
  try {
    const response = await fetch(
      `${SAMPLE_SERVER_BASE_URL}/captions/${captions.id}/stop`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error('error getting data!');
    }
    captionsStopBtn.style.display = 'none';
    captionsStartBtn.style.display = 'inline';
  } catch (error) {
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
    handleError(error);
  }
}

captionsStartBtn.addEventListener('click', startCaptions, false);
captionsStopBtn.addEventListener('click', stopCaptions, false);

// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Video application ID, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
    .then((response) => response.json())
    .then((json) => {
      applicationId = json.applicationId;
      sessionId = json.sessionId;
      token = json.token;
      // Initialize an Vonage Video Session object
      initializeSession();
    })
    .catch((error) => {
      handleError(error);
      alert(
        'Failed to get Vonage Video applicationId, sessionId and token. Make sure you have updated the config.js file.'
      );
    });
}
