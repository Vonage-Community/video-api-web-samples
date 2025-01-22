# Vonage Video API Web Samples

Sample applications for using the [Vonage Video API](https://developer.vonage.com/en/video/client-sdks/web) library with vanilla JavaScript.

For framework examples (Angular, React, Vue etc.) please see the [Web Component example applications](https://github.com/Vonage-Community/web_components-video_api-javascript/tree/main/examples).
For the electron app samples, these have been moved to [Vonage Community](https://github.com/Vonage-Community/sample-video-electron-app)

The code for this sample is found the following subdirectories:

* Advanced-Noise-Suppression ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Advanced-Noise-Suppression)) -- This sample application shows how to add a background Noise Suppression feature to the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a `NoiseSuppressionTransformer` from the `@vonage/noise-suppression` library along with the `MediaProcessor` and `MediaProcessorConnector` from `@vonage/media-processor`. This method allows for additional audio transformers to be applied.

* Archiving ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Archiving)) -- This sample shows you how to record a Vonage Video session.

* Audio-Input-Device-Changed ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Audio-Input-Device-Changed)) -- This sample application demonstrates the audioInputDeviceChanged event that allows the developer to alert their users whenever their microphone changes.

* Basic-Audio-Transformer ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic-Audio-Transformer)) -- This sample application shows how to use a basic audio transformer with the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a low-pass filter to the published audio.

* Basic-Background-Blur ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic-Background-Blur)) -- This sample application shows how to add background blur with the Vonage Video APIs.

* Basic-Noise-Suppression ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic-Noise-Suppression)) -- This sample application shows how to add a background Noise Suppression feature to the Vonage Video APIs. It is very similar to the Basic Video Chat example but adds the `applyAudioFilter`, `clearAudioFilter`, and `getAudioFilter` methods on the Publisher Object.

* Basic-Video-Transformer ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic-Video-Transformer)) -- This sample application shows how to use a basic video transformer with the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a threshold processor to the published video.

* Basic Video Chat ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic%20Video%20Chat)) -- This sample shows you how to connect to a Vonage Video session, publish a stream, and
  subscribe to a stream.

* Basic-Video-Zoom ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Basic-Video-Zoom)) -- This sample shows you how to use a video transformer to zoom and center a publisher.

* In-Call-Monitoring ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/In-Call-Monitoring)) -- This sample application demonstrates the qualityScoreChanged (based on the subscriber's audio/video MOS) and cpuPerformanceChanged (real-time indication of device performance related to CPU pressure) events.

* Live-Broadcast ([source](https://github.com/Vonage-Community/video-api-web-samples/tree/main/Live-Broadcast)) -- This sample shows you how to do a live broadcast using WebRTC, HLS, and RTMP.

* Moderate-Background-Blur ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Moderate-Background-Blur)) -- This sample application shows how to add background blur with the Vonage Video APIs and Vonage ML Transformers library.

* Moderate-Noise-Suppression ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Moderate-Noise-Suppression)) -- This sample application shows how to add a background Noise Suppression feature to the Vonage Video APIs. It is very similar to the Basic Video Chat example but it adds a `createVonageNoiseSuppression` from the `@vonage/noise-suppression` library.

* Publish-Canvas ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Publish-Canvas)) -- In this sample application we show you how to publish a custom stream from a Canvas tag.

* Publish-Video ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Publish-Video)) -- In this sample application we show you how to publish a video file to a Vonage Video session.

* Publish-Devices ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Publish-Devices)) -- In this sample application we show you how to choose different Cameras and Microphones when publishing.

* SIP ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/SIP)) -- In this sample application we show you how to Vonage's Voice API to provide SIP connectivity to video calls.

* Stereo-Audio ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Stereo-Audio)) -- In this sample application we show you how to publish a stereo music file to a Vonage Video session.

* Signaling ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Signaling)) -- This sample shows you how to use the Vonage Video Signaling API to implement text chat.

* Stream-Filter ([source](https://github.com/vonage-community/video-api-web-samples/tree/main/Stream-Filter)) -- This sample shows you how to apply custom grayscale, sepia and invert filters.

See the README file in each of these subdirectories for application-specific notes.

Each of these sample applications are described in the [Web tutorials
section](https://developer.vonage.com/en/video/overview) of the Vonage Video developer center.

**Not seeing a sample application for what you are trying to do? [File a new issue](https://github.com/vonage-community/video-api-web-samples/issues/new?labels=new%20sample%20request) or upvote [an existing one](https://github.com/vonage-community/video-api-web-samples/labels/new%20sample%20request).**

## Configuring the application

1. Clone this repository.

2. Edit the config.js file and set the value of `SAMPLE_SERVER_BASE_URL` to the URL of a copy of our [Learninv Video Sample Server](https://github.com/Vonage-Community/sample-video-node-learning_server/). If you do not have a copy of the sample server running, some demos may allows you to set values for `APPLICATION_ID`, `SESSION_ID`, and `TOKEN`:

> Do we have a way to generate the session Id and token from the Vonage dashboard?

   To do this, log into your [Vonage Account](https://dashboard.nexmo.com), and head to the [Video Playground](https://tools.vonage.com/video/playground/) located under "Developer Tools" > "Video" > "Playground." Here you can configure options for a new video session, and get values for the Application ID, Session ID, and Token.

**Important notes:**

* You can continue to get the session ID and token values from your Account during testing and
  development, but before you go into production you must set up a server. We will discuss this
  in the [Setting up the test web service](#setting-up-the-test-web-service) section.

* The Archiving sample app requires you to set up the test web service.

## Testing the application

1. The web app is in the index.html (in each sample directory). Open the index.html in a supported browser.

   For information about which browsers are supported by the Vonage Video library see the [browser support section of the documentation](https://developer.vonage.com/en/video/client-sdks/web).

2. When prompted, grant the page access to your camera and microphone.

3. Mute the speaker on your computer, and then load the page again in another browser tab.

   You will see a person-to-person video chat session using Vonage Video.

See the README file in each of these subdirectories for application-specific notes.


## Setting up the test web service

The [Sample Vonage Video NodeJS Server App](https://github.com/Vonage-Community/sample-video-node-learning_server/) repo includes code for
setting up a web service.

> May be able to use VCR fka NeRu

1. Clone or download the repo and run its code on a Node-enabled web server. If you do not have a
   PHP server set up, you can use Heroku to run a remote test server -- see [Automatic deployment
   to Heroku](https://github.com/Vonage-Community/sample-video-node-learning_server#automatic-deployment-to-heroku).

2. After getting this web service running, edit the config.js file and set the value for
   `SAMPLE_SERVER_BASE_URL` to the URL for the web service:

    * If you deployed the test web service to a local Node server, set this to the following:

      var SAMPLE_SERVER_BASE_URL = 'http://localhost:8080';

    * If you deployed this online, set this to the following:

      var SAMPLE_SERVER_BASE_URL = 'https://YOUR-SERVER-URL';

   ***Do not add the trailing slash of the URL.***

The sample will load the Vonage Video session ID, token, and Application ID from the web service. Also,
the archiving sample will use the web service to start, stop, and view archives.

## Other resources

See the following:

* [API reference](https://developer.vonage.com/en/video/client-sdks/web) -- Provides details on
  the Vonage Video API

* [Developer guides](https://developer.vonage.com/en/video/overview/) -- Includes conceptual information and
  code samples for all Vonage Video features
