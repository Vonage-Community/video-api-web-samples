Vonage video Stream Filter Sample
=======================

As of v2.13 of opentok.js you can pass a custom videoSource and audioSource to the Publisher. This sample shows how to use this API to apply custom filters to a Publisher. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example, but it includes a [filters.js](./js/filters.js) file to change between video filters and then publish a custom videoSource and audioSource to the session.

You can set a custom audio source and video source for a publisher's stream when you call [`OT.initPublisher()`](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#initPublisher). The custom audio and video source are [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) objects. In this example, we use the [`OT.getUserMedia()`](https://vonage.github.io/conversation-docs/video-js-reference/latest/OT.html#getUserMedia) method (from Vonage Video.js) to get a reference to a [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object that uses the microphone and camera as the audio and video source. The sample attaches the video `MediaStreamTrack` (from the `MediaStream` object) to an HTML canvas, manipulates the canvas's image (for example, applying a grayscale filter). It then obtains the resulting `MediaStreamTrack` from the canvas, using the [`Canvas.captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) method to get a `MediaStream` object, and it calls `getVideoTracks()[0]` on that object to get the video `MediaStreamTrack` object. Finally, it uses that `MediaStreamTrack` object when calling `OT.initPublisher()`.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Stream-Filter)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## 🌏  Open in other Cloud IDEs

Click any of the buttons below to start a new development environment to demo or contribute to the codebase without having to install anything on your machine:

[![Open in VS Code](https://img.shields.io/badge/Open%20in-VS%20Code-blue?logo=visualstudiocode)](https://vscode.dev/github/vonage-community/video-api-web-samples)
[![Open in Glitch](https://img.shields.io/badge/Open%20in-Glitch-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/vonage-community/video-api-web-samples)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/vonage-community/video-api-web-samples)
[![Edit in Codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vonage-community/video-api-web-samples)
[![Open in Repl.it](https://replit.com/badge/github/withastro/astro)](https://replit.com/github/vonage-community/video-api-web-samples)
[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/vonage-community/video-api-web-samples)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/vonage-community/video-api-web-samples)

## Running the App

Follow the instructions at [Basic Video Chat](../Basic%20Video%20Chat/)

Open the application in 2 browser windows. Choose a filter from the filter select box.

## Known Limitations

 * The custom streaming API works on Chrome 51+, Firefox 49+ and Safari 11+. It does not work in IE or Edge browsers.
 * If the browser window loses focus (eg. you open a new tab) then the video will pause or become really slow. This is because it is using requestAnimationFrame to draw the video which is limited when the tab is not in focus.
