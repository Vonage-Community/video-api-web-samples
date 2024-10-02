# Vonage Video Basic Captions

This sample application shows how to connect to an Vonage Video session, publish a stream,
subscribe to a stream, and publish captions to a session.

> **Note** The demo requires a server that is running and is able to handle Vonage Video captions. This server should also be able to generate sessions and tokens. You can create the server needed by deploying this [project](https://developer.vonage.com/en/cloud-runtime/1dc909c1-e04c-4cab-92d8-8866fa97a953_vonage-video-learning-server-node-js) to [Vonage's serverless platform](https://developer.vonage.com/en/cloud-runtime). The project is the [Sample Vonage Video NodeJS Server App](https://github.com/Vonage-Community/sample-video-node-learning_server).

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage-Community/video-api-web-samples/tree/main/Basic-Captions)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

_Important:_ Read the following sections of the main README file for the repository to set up
and test the application:

- [Setting up the test web service](../README.md#setting-up-the-test-web-service)
- [Configuring the application](../README.md#configuring-the-application)
- [Testing the application](../README.md#testing-the-application)

## Getting a Vonage Video session ID, token, and Application ID

A Vonage Video session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

_Important_: This demo application assumes that only two clients -- the local Web client and
another client -- will connect in the same Vonage Video session. For test purposes, you can reuse the
same session ID each time two clients connect. However, in a production application, your
server-side code must create a unique session ID for each pair of clients. In other applications,
you may want to connect many clients in one Vonage Video session (for instance, a meeting room) and
connect others in another session (another meeting room).

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the Vonage Video [Token creation
overview](https://developer.vonage.com/en/video/guides/create-token). Moderator token role is required for
Live Captions API to work.

**Application ID** -- The Application ID identifies your Vonage developer account's application.

Upon starting up, the application executes the following code in the app.js file:

```javascript
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
  }).catch((error) => {
    handleError(error);
    alert('Failed to get Vonage Video applicationId, sessionId and token. Make sure you have updated the config.js file.');
  });
}
```

The following method will enable the captions in your session:

```javascript
async function startCaptions() {
  console.log('start captions');
  try {
    captions = await postData(SAMPLE_SERVER_BASE_URL +'/captions/start',{sessionId, token});
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  }
  catch(error){
    handleError(error);
  }
}
```

The following method will stop the captions in your session:

```javascript
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
```

The `postData` method is by `startCaptions` method to return the `caption` response and is defined as following:

```javascript
async function postData(url='', data={}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok){
      throw new Error('error getting data!');
    }
    return response.json();
  }
  catch (error){
    handleError(error);
  }
}
```

When initializing a Publisher that you would like to have the captions enabled for, pass the `publishCaptions` property set to `true`:

```javascript
const publisherOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  publishCaptions: true,
};
```

The Subscriber object has an event, `captionReceived`, that you can listen for in order to make the changes to the UI:

```javascript
subscriber.on('captionReceived', function(event){
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
```

To learn more about Vonage Video Live Captions API, please visit the [Live Captions API Developer Documentation page](https://developer.vonage.com/en/video/guides/live-caption/).
