/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

const login = document.querySelector('#login');
const videos = document.querySelector('#videos');
const nameInput = document.querySelector('#name');
const encryptKeyInput = document.querySelector('#encrypt-key');
const enterBtn = document.querySelector('#enter-button');
const newEncryptKeyInput = document.querySelector('#new-encrypt-key');
const changeBtn = document.querySelector('#change-button');
const leaveBtn = document.querySelector('#leave-button');

let applicationId;
let sessionId;
let token;
let session;

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

if (OT.hasEndToEndEncryptionSupport()) {
  // Proceed with connecting to the session
  console.log('supported');
} else {
  // Notify the user that they cannot join the session
  console.log('not supported');
  handleError('Encryption not supported!');
}

function initializeSession() {
  console.log('initializeSession');
  if (!session) {
    session = OT.initSession(applicationId, sessionId, {
      encryptionSecret: encryptKeyInput.value,
    });
    // Subscribe to a newly created stream
    session.on('streamCreated', (event) => {
      const subscriberOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
      };
      const subscriber = session.subscribe(
        event.stream,
        'subscriber',
        subscriberOptions,
        handleError
      );
      subscriber.on('encryptionSecretMismatch', () => {
        // Activate a UI element communicating that there's been an encryption secret mismatch.
        handleError("there's been an encryption secret mismatch");
      });

      subscriber.on('encryptionSecretMatch', () => {
        // Activate a UI element communicating that the media is being properly decrypted.
        handleError('the media is being properly decrypted');
      });
    });

    session.on('sessionDisconnected', (event) => {
      console.log('You were disconnected from the session.', event.reason);
    });
  } else {
    console.log('setting secret');
    await session.setEncryptionSecret(encryptKeyInput.value);
  }

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      console.log('session.connect error', session);
      handleError(error);
    } else {
      login.style.display = 'none';
      videos.style.display = 'block';
      // If the connection is successful, publish the publisher to the session
      // initialize the publisher
      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        name: nameInput.value,
      };
      const publisher = OT.initPublisher(
        'publisher',
        publisherOptions,
        (error) => {
          if (error) {
            console.log('publisher error');
            handleError(error);
          } else {
            console.log('publisher good to go!');
          }
        }
      );
      session.publish(publisher, handleError);
    }
  });

  changeBtn.addEventListener('click', async () => {
    try {
      await session.setEncryptionSecret(newEncryptKeyInput.value);
    } catch (error) {
      handleError(error);
    }
  });

  leaveBtn.addEventListener('click', () => {
    session.disconnect();
    videos.style.display = 'none';
    nameInput.value = '';
    encryptKeyInput.value = '';
    login.style.display = 'flex';
  });

}

enterBtn.addEventListener('click', () => {
  // See the config.js file.
  if (APPLICATION_ID && TOKEN && SESSION_ID) {
    applicationId = APPLICATION_ID;
    sessionId = SESSION_ID;
    token = TOKEN;
    initializeSession();
  } else if (SAMPLE_SERVER_BASE_URL) {
    // Make a GET request to get the Vonage Video Application ID, session ID, and token from the server
    fetch(SAMPLE_SERVER_BASE_URL + '/session?e2ee=true')
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
});