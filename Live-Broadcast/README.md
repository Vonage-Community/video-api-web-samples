# Vonage Video API Broadcast Sample App for JavaScript

<img src="https://assets.tokbox.com/img/vonage/Vonage_VideoAPI_black.svg" height="48px" alt="Tokbox is now known as Vonage" />

This document describes how to use the Video API Broadcast Sample App for JavaScript. This
demo will show you a basic 1:many broadcast application using both WebRTC and HLS. 

In the Video API Broadcast Sample App, the host is the individual who controls and publishes
the broadcast.

The Vonage Video API live streaming feature lets you broadcast an Video API session to an HTTP live
streaming (HLS) stream. More clients can simultaneously view this stream than can view
a live interactive Video API session. Also, clients that do not support WebRTC
can view the HLS stream. HLS playback is not supported in all browsers. However, there are a
number of plugins, such as [Flowplayer](https://flowplayer.org/), that provide
cross-browser support (using Flash Player in browsers that do not provide direct HLS support). The demo
uses [Hls.js](https://www.npmjs.com/package/hls.js/v/canary).

The DVR feature provides a two-hour window for playing back broadcast content. While the broadcast is in progress, you can play back (and rewind to) any point in the broadcast up to two hours prior to the current time. The DVR recording is unavailable two hours after the broadcast is stopped.

**NOTE**: The viewer limits do not apply to HLS, since all publishing streams are transcoded
to a single HLS stream that can be accessed from an HLS player. The expected latency for HLS
is 10-15 seconds and for low latency HLS is shorter. The host can select different options to start the broadcast (Low latency and DVR).
The viewers can move back and forth from the HLS viewer view to the WebRTC view.

You can configure and run this sample app within just a few minutes!

This guide has the following sections:

- [Prerequisites](#prerequisites): A checklist of everything you need to get started.
- [Quick start](#quick-start): A step-by-step tutorial to help you quickly run the sample app.
- [Exploring the code](#exploring-the-code): This describes the sample app code design, which
  uses recommended best practices to implement the Video API Broadcast app features.

## Prerequisites

To be prepared to develop your Video API Broadcast app:

1. Review the [Vonage Video Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web) requirements.
2. This application requires a Sample Server with broadcast capabilities. We suggest our [Sample Video Node Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/).

```bash
npm i
npm start
```

_**IMPORTANT:** If you deploy this demo, the hosting service MUST use HTTPS to serve your demo.

## Quick start

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Live-Broadcast)

The web page that loads the sample app for JavaScript must be served over HTTP/HTTPS. Browser
security limitations prevent you from publishing video using a `file://` path. To
support clients running [Chrome 47 or later](https://groups.google.com/forum/#!topic/discuss-webrtc/sq5CVmY69sc),
HTTPS is required. A web server such as [MAMP](https://www.mamp.info/) or
[XAMPP](https://www.apachefriends.org/index.html) will work, or you can use a cloud service such
as [StackBlitz](https://www.heroku.com/) to host the application.

You can also run the front-end locally by using:

```bash
npm i
npm start
```

This will start a local instance of `sirv`, which will serve the application on `https://localhost:8080`. 

You will also need a server that can interact with our API. You can build your own, or deploy our [Sample Video Node Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/).
Both the sample server and this demo can be run locally, or you can deploy the sample server to a service
like Railway, and point this demo at the public URL of the Railway application. For more info, please check
out the [sample server's README](https://github.com/Vonage-Community/sample-video-node-learning_server/).

### Starting a broadcast

From the host view, press the `Start Broadcast` button. You can configure different parametes for the broadcast (HLS Low Latency, DVR )

- Note: DVR functionality and Low Latency are incompatible

## Exploring the code

This section describes how the sample app code design uses recommended best practices to deploy the broadcast features.

For detail about the APIs used to develop this sample, see
the [Vonage Video Client SDK Reference](https://developer.vonage.com/en/video/client-sdks/web).

- [Web page design](#web-page-design)
- [Server](#server)
- [Guest](#guest)
- [Viewer](#viewer)
- [Host](#host)
- [HLS Viewer](#hls-viewer)
- [Experience Composer](#experience-composer)

### Web page design

While Vonage hosts [Vonage Video Client SDK](https://developer.vonage.com/en/video/client-sdks/web), you must host the
sample app yourself. This allows you to customize the app as desired.

- **[config.js](./js/config.js)**: This contains the configuration needed to talk to the backend sever

- **[utils.js](./js/utils.js)**: This contains common code used on multiple pages

- **[host.js](./js/host.js)**: The host is the individual who controls and publishes
  the broadcast, but does not control audio or video for viewers.

- **[view.js](./js/view.js)**: Viewers can view the live WebRTC stream.

- **[hls.js](./public/js/hls.js)**: HLS Viewers can only view the broadcast.

### Server

This demo does not contain any of the backend code needed to interact with the Vonage Video REST API. Our
[Sample Video Node Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/) contains all the necessary routes
to access our REST API.

If you are interested, the following routes will be used from the `[routes/index.js](https://github.com/Vonage-Community/sample-video-node-learning_server/blob/main/routes/index.js)` from that project:

* `/broadcast/:name/host` - This route generates credentials for the broadcast host
* `/broadcast/:name/viewer` - This route generates credentials for anyone viewing the broadcast via WebRTC
* `/broadcast/:name/start` - Starts a live broadcast via HLS (Note: Starting a broadcast will end any existing and running broadcasts)
* `/broadcast/:name/stop` - Stops a live broadcast

When the web page is loaded, those credentials are retrieved from the configured server and used to authenticate the Client SDK to the Vonage Video platform.

### HLS viewer

The functions in [hls.js](./js/hls.js) is used to render the HLS stream to the browser. Your application is responsible to let the HLS viewers when the HLS stream has started, this could be via WSS or any other way. 
For simplicity, this sample app assumes that a broadcast has already started. Once the broadcast is started, the host has a button to open the correct view URL.

### Viewer

The functions in [view.js](./js/viewer.js) retrieves the credentials from the the backend server,
connects to the session and subscribes to the stream in progress.

### Host

The methods in [host.js](./js/host.js) retrieve the credentials from the backend server, control the broadcast stream, and creates
 the URL for viewers to watch the broadcast. The host makes calls to
the server, which calls the Vonage Video API to start and end the broadcast. 
For more information, see [Publishing Streams](https://developer.vonage.com/en/tutorials/publish-streams/introduction/javascript)
and [Joining a session](https://developer.vonage.com/en/tutorials/joining-a-session/introduction/javascript).

When the broadcast button is clicked, the demo submits
a request to the server endpoint to begin the broadcast. The server endpoint relays the
session ID to the [Video API HLS Broadcast REST](https://developer.vonage.com/en/api/video#start-broadcast)
`/broadcast/start` endpoint, which returns broadcast data to the host. The broadcast data
includes the broadcast URL in its JSON-encoded HTTP response:

```javascript
document.getElementById('btn-start').addEventListener('click', async (el, event) => {
    broadcast = await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/start`, {
        method: "POST",
        body: JSON.stringify({
            rtmp: [],
            lowLatency: document.getElementById('lowLatency').checked,
            dvr: document.getElementById('dvr').checked,
            sessionId: session.id,
            streamMode: "auto"
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => {
            session.publish(publisher);
            return res.json()
        })
        .catch(error => console.error(error));
});
```

When the broadcast is over, the "End Broadcast" button submits a request to the server,
which invokes the [Video API Broadcast API](https://developer.vonage.com/en/api/video#stop-broadcast) `/broadcast/stop`
endpoint, which terminates the CDN stream. This is a recommended best practice, as the default
is that broadcasts remain active until a 120-minute timeout period has completed.

```javascript
document.getElementById('btn-end').addEventListener('click', async (el, event) => {
    broadcast = await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/stop`, {
        method: "POST",
        body: JSON.stringify({
            sessionId: session.id
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => {
            session.unpublish(publisher);
            publisher = initPublisher();
            return res.json()
        })
        .catch(error => console.error(error));
});
```

## Development and Contributing

Interested in contributing? We :heart: pull requests! See the [Contribution](../CONTRIBUTING.md) guidelines.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us
know! You can either:

- Open an issue on this repository
- See <https://support.vonage.com/> for support options
- Tweet at us! We're [@VonageDev](https://twitter.com/VonageDev) on Twitter
- Or [join the Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)

## Further Reading

- Check out the Developer Documentation at <https://developer.vonage.com/en/video>
