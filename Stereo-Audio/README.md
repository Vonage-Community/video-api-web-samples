Vonage Video Stereo Audio Sample
=======================

As of v2.13 of opentok.js you can enable stereo for audio streaming from a Publisher. This sample shows how to use this API in combination with the audio bitrate and custom stream APIs to stream stereo music from an audio file.

You can enable stereo and set the audio bitrate for a publisher's stream when you call [`OT.initPublisher()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher). An audio file is retrieved using the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and its contents converted into an [`AudioBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer). This is passed into the [`Web Audio API`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to create a custom audio stream with audio panning between left and right stereo channels. The custom audio track is then passed into `OT.initPublisher()` to be streamed to all subscribers. See [Publish Canvas Sample](../Publish-Canvas/) for an example of the custom stream API.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/Vonage/video-api-web-samples/tree/main/Stereo-Audio)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

Open the sample in two tabs or windows and click the `Publish` button in one of them.

Use the slider to pan the music between left and right stereo channels.

## Known Limitations

 * The stereo panner API used in this sample works on Chrome 42+, Firefox 37+ and Edge. It does not work in IE or Safari browsers.
