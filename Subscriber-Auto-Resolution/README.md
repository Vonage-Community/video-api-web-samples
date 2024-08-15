# Vonage Video Subscriber Auto Resolution Demo

This sample application demonstrates the Subscriber Auto Resolution feature that optimizes video streaming based on the video elements size. This allows developers to design dynamic interfaces for their video applications.

> Note: The code in this sample application is mostly to showcase the Subscriber Auto Resolution feature. Enabling the capability is one line of code. See below.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Subscriber-Auto-Resolution)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

_Important:_ Read the following sections of the main README file for the repository to set up
and test the application:

- [Setting up the test web service](../README.md#setting-up-the-test-web-service)
- [Configuring the application](../README.md#configuring-the-application)
- [Testing the application](../README.md#testing-the-application)

## Enable Subscriber Auto Resolution

After a `streamCreated` event, when subscribing the stream to the session, set the `preferredResolution` to `auto` in the options object. For example:

```javascript
const subscriberOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  preferredResolution: 'auto', // add this line
};

const subscriber = session.subscribe(
  event.stream,
  'subscriber',
  subscriberOptions,
  handleError
);
```
