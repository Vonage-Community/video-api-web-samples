Vonage Video Bi-directional Audio Connector Sample
=======================

This sample application demonstrates the Bi-directional Audio Connector feature in Vonage Video. This means that you can send and receive audio streams in a video call. This sample application is built off the [Basic Video Chat](https://github.com/Vonage-Community/video-api-web-samples/tree/main/Basic%20Video%20Chat). It adds an "echo" WebSocket server that receives an audio stream and sends back the same stream to be published in the session. When you run the application and click the "start bi-directional Audio Connector", another participant will join the video call and echo what you say. See the [Vonage Video documentation](https://developer.vonage.com/en/video/guides/audio-connector#publishing-audio-to-a-session-via-the-websocket) for more information.

## Demo

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Vonage-Community/video-api-web-samples/tree/main/Bidirectional-Audio-Connector)

> Note: On the "Create a new codespace" screen, under "Dev container configuration" please select "Bidirectional audio connector"

Enter your server's URL in `config.js` and the application will work.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Starting the Bi-directional Audio Connector

To start the Bi-directional Audio Connector, the `bidirectional` property needs to be set to `true` when starting the Audio Connector on the server.
Here is how it is implemented in the [Video API Node Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/blob/main/routes/index.js#L488-L514):
```javascript
router.post('/audio-connector/connect', async (req, res) => {
  const { webSocketHost, sessionId } = req.body;
  try {
    const token = tokenGenerate(appId, privateKey);
    const webSocketToken = vonage.video.generateClientToken(sessionId, { role: 'publisher' });
    const audioConnectorResponse = await fetch(`https://video.api.vonage.com/v2/project/${appId}/connect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "sessionId": sessionId,
        "token": webSocketToken,
        "websocket": {
          "uri": `wss://${webSocketHost}`,
          "audioRate": 8000,
          "bidirectional": true
        }
      })
    })
    const audioConnectorResponseJson = await audioConnectorResponse.json();
    res.send(audioConnectorResponseJson);
  } catch (error) {
    console.error("Error starting Audio Connector: ",error);
    res.status(500).send(`Error starting Audio Connector: ${error}`);
  }
});
```
In the Web Application, you make a POST request to your server with the Session ID and WebSocket Host.
```javascript
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
    console.log('Response from Audio Connect endpoint:', apiResponseJson);
  } catch (error) {
    handleError(error);
  };
}
```

## Disconnecting the Audio Connector

To disconnect the Audio Connector, the connection must be terminated on the server.
Here is how it is implemented in the [Video API Node Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/blob/main/routes/index.js#L519C1-L530C1):
```javascript
router.post('/audio-connector/disconnect', async (req, res) => {
  const { sessionId, connectionId } = req.body;
  try {
    await vonage.video.disconnectClient(sessionId, connectionId);
    console.log("Successfully disconnected Audio Connector");
    res.sendStatus(204)
  } catch (error) {
    console.error("Error starting Audio Connector: ",error);
    res.status(500).send(`Error stopping Audio Connector: ${error}`);
  }
});
```
In the Web Application, you make a POST request to your server with the Session ID and Connection ID.
```javascript
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
  } catch (error) {
    handleError(error);
  };
}
```
