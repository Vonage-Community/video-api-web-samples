import { MediaProcessorConnector } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import { WorkerMediaProcessor } from './worker-media-processor.js';
/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */
/* global MediaProcessorConnector */

let applicationId;
let sessionId;
let token;

const transformStream = (publisher) => {
  const mediaProcessor = new WorkerMediaProcessor();
  const mediaProcessorConnector = new MediaProcessorConnector(mediaProcessor);

  if (OT.hasMediaProcessorSupport()) {
    publisher
      .setAudioMediaProcessorConnector(mediaProcessorConnector)
      .catch((e) => {
        console.error(e);
      });
  } else {
    console.log('Browser does not support media processors');
  }
};

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

const initializeSession = () => {
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

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      // and transform stream
      session.publish(publisher, () => transformStream(publisher));
    }
  });
};

// See the config.js file.
if (APPLICATION_ID && TOKEN && SESSION_ID) {
  applicationId = APPLICATION_ID;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Application ID, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    applicationId = json.applicationId;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize a Vonage Video Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get Vonage Video sessionId and token. Make sure you have updated the config.js file.');
  });
}
