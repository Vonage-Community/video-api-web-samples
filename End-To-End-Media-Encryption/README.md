Vonage End-to-End Media Encryption Sample
=======================

This sample application shows how to connect to a Vonage [end-to-end media encrypted session](https://developer.vonage.com/en/video/guides/end-to-end-encryption/overview?lang=javascript).

> Note: In order for this demo to work, End-to-End Media Encryption must be added to your [Vonage Account's Video Add-ons](https://dashboard.vonage.com/video/addons).

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/End-To-End-Media-Encryption)

- Enter your credentials in `config.js` and the application will load.
- Click "Open in New Tab" twice.
- Enter a name in one of the tabs as well as an encryption key and press the Enter button.
- In the other tab, enter a name, but the same encryption key from before and press the Enter button.
- You should be in an End-to-End Media Encrypted video call.
- Try changing the encryption key in one of tabs.


> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Getting an Vonage Video session ID, token, and Application ID

A Vonage Video session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

*Important*: This demo application assumes that only two clients -- the local Web client and
another client -- will connect in the same Vonage Video session. For test purposes, you can reuse the
same session ID each time two clients connect. However, in a production application, your
server-side code must create a unique session ID for each pair of clients. In other applications,
you may want to connect many clients in one Vonage Video session (for instance, a meeting room) and
connect others in another session (another meeting room).

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the Vonage Video [Token creation
overview](https://developer.vonage.com/en/video/guides/create-token).

**Application ID** -- The Application ID identifies your Vonage developer account's application.

Upon starting up, the application executes the following code in the app.js file:

```javascript
// See the config.js file.
if (APPLICATION_ID && TOKEN && SESSION_ID) {
  applicationId = APPLICATION_ID;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Application ID, session ID, and token from the server
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
    alert('Failed to get Vonage Video applicationId, sessionId, and token. Make sure you have updated the config.js file.');
  });
}
```

This method checks to see if you've set hardcoded values for the Vonage Video Application ID, session ID, and
token. If not, it makes a GET request to the "/session" endpoint of the web service.
The web service returns an HTTP response that includes the session ID, the token, and Application ID
formatted as JSON data:

    {
         "sessionId": "2_MX40NDQ0MzEyMn5-fn4",
         "applicationId": "67c891c9-5ab5-4c20-b4dd-5d277dee9a9e",
         "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYWI2MTZhMi1hZmIyLTQ0OWQtOWZhNy01..."
    }

For more information, see the main README file of this repository.

## Connecting to the session

This application works very much in the same way as the [Basic Video Chat Web Sample](https://github.com/Vonage-Community/video-api-web-samples/tree/main/Basic%20Video%20Chat).

The main difference is in the way the session is initialized.


```javascript
// Initialize Session Object
const session = OT.initSession(applicationId, sessionId, {
  encryptionSecret: encryptKeyInput.value,
});
```

The encryption key that was entered into the page is passed into `OT.initSession`.

To change the encryption key's value while connected to a session, call `setEncryptionSecret` with the new encryption key.

```javascript
session.setEncryptionSecret(newEncryptKeyInput.value);
```

To learn more, please read the accompanying [blog post](https://developer.vonage.com/en/blog/adding-end-to-end-media-encryption-to-your-video-calls) and visit the [End-to-End Media Encryption Developer Documentation page](https://developer.vonage.com/en/video/guides/end-to-end-encryption/overview?lang=javascript).
