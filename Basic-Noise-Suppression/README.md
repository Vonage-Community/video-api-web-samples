# Vonage Video Basic Noise Suppression

This sample application shows how to use the background Noise Suppression feature in the Vonage Video JavaScript Client SDK. It is very similar to the [Basic Video Chat](../Basic%20Video%20Chat/) example but adds the `applyAudioFilter`, `clearAudioFilter`, and `getAudioFilter` methods on the [Publisher Object](https://vonage.github.io/conversation-docs/video-js-reference/latest/Publisher.html).

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Basic-Noise-Suppression)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

_Important:_ Read the following sections of the main README file for the repository to set up
and test the application:

- [Setting up the test web service](../README.md#setting-up-the-test-web-service)
- [Configuring the application](../README.md#configuring-the-application)
- [Testing the application](../README.md#testing-the-application)

## Enabling / Disabling Noise Suppression

After connecting to the session, and publishing the audio-video stream:

```javascript
// enable Noise Suppression
publisher.applyAudioFilter({
  type: 'advancedNoiseSuppression',
});

// disable Noise Suppression
publisher.clearAudioFilter();
```

## Enable Noise Suppression from the start

You can enable Noise Suppression as soon as a person starts publishing their audio-video stream by setting the `audioFilter` Object in the properties of `OT.initPublisher`.

```javascript
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    resolution: '1280x720',
    audioFilter: {
      type: 'advancedNoiseSuppression'
    }
  };
  const publisher = OT.initPublisher(
    'publisher',
    publisherOptions,
    handleError
  );
```

## Get the Audio Filter Type

You can get the audio filter that is currently applied at any time by calling `getAudioFilter` on the Publisher Object. It will either return null if there is no filter or an object where the `type` is the filter

```javascript
  publisher.getAudioFilter();


  // output
  {
      "type": "advancedNoiseSuppression"
  }

  or

  null
```

## Known Limitations

- MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge. They are not supported in other (non-Chromium-based) browsers or on iOS. You can check if the client supports this feature by calling the `OT.hasMediaProcessorSupport()` method.
