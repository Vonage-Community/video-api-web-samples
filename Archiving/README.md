Vonage Video Archiving Sample
===========================

This sample application shows how to record a Vonage Video session.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Archiving)

Enter your credentials in `config.js` and the application will work.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the App

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

**Important notes:**

* Be sure to [set up the test web service](../README.md#setting-up-the-test-web-service).
  The API calls to start and stop Vonage Video archives take place on the server (not in the
  web client).

* This application uses archives that are stored in the Vonage Video cloud. In your
  [Vonage Customer Dashboard](https://dashboard.nexmo.com), ensure that Video application you use
  is *not* set up to use cloud storage on Microsoft Azure or Amazon S3. In a production
  application, you will want to use a project that has archive file cloud storage on Microsoft
  Azure or Amazon S3 enabled, since archives stored on the Vonage Video cloud are only available
  for 72 hours.

For this application, click the Start Archive button (in the bottom-left hand corner of the page)
to start recording the Vonage Video session. Then click the Stop Archive button to stop recording the
session. Clicking View Archive will open a link in a new Window/Tab to view the archive.

## Recording the session to an archive

The Vonage Video Archiving API lets you record a session's audio-video streams to MP4 files. You use
server-side code to start and stop archive recordings. In the `config.js` file, you set the
`SAMPLE_SERVER_BASE_URL` variable to the base URL of the web service the app calls to start archive
recording, stop recording, and play back the recorded video.

To start recording the video stream, the user clicks the Start Archive button which invokes the
`startArchiving()` method in app.js. This method in turn sends a POST request to server.
The session ID of the session that needs to be recorded is passed as a URL parameter to the server.
Once the `'archiveStarted'` event is fired, the Start Archive button is hidden and the Stop Archive button is displayed.

```javascript
async function startArchiving(){
  console.log('start archiving');
  try {
    archive = await postData(SAMPLE_SERVER_BASE_URL +'/archive/start',{sessionId});
    console.log('archive started: ', archive);
    if (archive.status !== 'started'){
      handleError(archive.error);
    } else {
      console.log('successfully started archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}
```

To stop the recording, the user clicks the Stop Archive button, which invokes the `stopArchiving()`
method. This method is similar to the `startArchiving()` method in that it sends a POST request to
the server to stop the archive. The only difference is that this method passes the archive ID of
the archive that needs to be stopped as a URL parameter instead of the sessionId. When the `archiveStopped` event is fired, 
the Stop Archive button is hidden while the Start Archive button and View Archive link are shown.

```javascript
async function stopArchiving(){
  console.log('stop archiving');
  try {
    archive = await postData(`${SAMPLE_SERVER_BASE_URL}/archive/${archive.id}/stop`,{});
    console.log('archive stopped: ', archive);
    if (archive.status !== 'stopped'){
      handleError(archive.error);
    } else {
      console.log('successfully stopped archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}
```

To view the archive that has just been recorded, the user clicks View Archive link which
opens in a new Window/Tab. The server code has the logic to check if the archive is available or not. If it is available,
the application is redirected to the archive page. If not, a new page is loaded which continuously checks whether
the archive is available or not, and it displays the archive when it is available.

*Notes:*

* In most applications, control of the archive recording would not be granted to each
end-user.

* You can have automatically archived sessions, which are recorded whenever a client
starts publishing a stream.

* This sample application uses archives that are stored in the Vonage Video cloud. For a production
application, you will want to set up a project to have archive file cloud storage on Microsoft Azure
or Amazon S3 enabled, since archives stored on the Vonage Video cloud are only available for 72 hours.
To set up Microsoft Azure or Amazon S3 storage for a project's archives, go to your
[Vonage Customer Dashboard](https://dashboard.nexmo.com).

For more information, see the [Vonage Video archiving developer
guide](https://developer.vonage.com/en/video/guides/archiving/overview).
