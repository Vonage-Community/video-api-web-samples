/* global OT APPLICATION_ID TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;

const mosAudioMeter = document.querySelector('#mos-audio');
const audioRating = document.querySelector('#audio-rating');
const mosVideoMeter = document.querySelector('#mos-video');
const videoRating = document.querySelector('#video-rating');
const cpuState = document.querySelector('#cpu-state');

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function getRating(value) {
  switch (true) {
    case value > 4.34:
      return 'Best';
    case value > 4.03:
      return 'High';
    case value > 3.6:
      return 'Medium';
    case value > 3.1:
      return 'Low';
    default:
      return 'Poor';
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
    const subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    // Call Quality Sample Score https://vonage.github.io/video-docs/video-js-reference/latest/QualityScoreChangedEvent.html
    subscriber.on('qualityScoreChanged', (scores) => {
      mosAudioMeter.value = scores.qualityScore.audioQualityScore ? scores.qualityScore.audioQualityScore : null;
      audioRating.value = scores.qualityScore.audioQualityScore ? `${getRating(scores.qualityScore.audioQualityScore)} (${scores.qualityScore.audioQualityScore})` : '';
      mosVideoMeter.value = scores.qualityScore.videoQualityScore ? scores.qualityScore.videoQualityScore : null;
      videoRating.value = scores.qualityScore.videoQualityScore ? `${getRating(scores.qualityScore.videoQualityScore)} (${scores.qualityScore.videoQualityScore})` : '';
    });

  });

  // Performance Monitoring https://vonage.github.io/video-docs/video-js-reference/latest/CpuPerformanceChanged.html
  session.on('cpuPerformanceChanged', (event) => {
    cpuState.value = event.cpuPerformanceState;
  })
  
  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    resolution: '1280x720'
  };
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
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
