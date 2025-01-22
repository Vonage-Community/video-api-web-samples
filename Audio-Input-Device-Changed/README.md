Vonage Video audioInputDeviceChanged event Sample
===========================

This sample application demonstrates the [`audioInputDeviceChanged`](https://vonage.github.io/video-docs/video-js-reference/latest/AudioInputDeviceChanged.html) event that allows the developer to alert their users whenever their microphone changes. After selecting your video and audio sources and clicking the Publish button, disconnect your selected audio source and application will switch to an available audio input device.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Audio-Input-Device-Changed)

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

* Simply open [index.html](index.html) in your browser.

## Known Limitations

* `setAudioSource()` only works with browsers that support the [`replaceTrack()`](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack) method. This means it will not work in Internet Explorer, Microsoft Edge, Chrome before version 65 and Safari before version 12.
* `setAudioSource()` is supported in v2.15+ of opentok.js
* `cycleVideo()` is supported in v2.14+ of opentok.js
