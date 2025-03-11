Vonage Video Post-Call Transcription Sample
===========================

This sample application shows how to get a transcription from a recorded Vonage Video session. The code is very similar to the [Archiving](https://github.com/Vonage-Community/video-api-web-samples/tree/main/Archiving) sample application since an Archive needs to be started in order to generate a transcription.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/Post-Call-Transcription)

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
to start recording the Vonage Video session. Say a few words and then click the Stop Archive button to stop recording the
session. For this demo, a request is made to an endpoint to get the status of the transcription every 5 seconds until it is ready and then display a download link. In a production application, a WebHook endpoint can be set up. When the transcription is ready, a request will be made to the WebHook endpoint.

## Generating a transcription from a Video session

To be able get a transcription using Vonage Video, these 3 options must be set accordingly:

* `outputMode` must be set to `"individual"` 

* `hasAudio` must be set to `true` (this is set to true by default)

* `hasTranscription` must be set to `true` 

when starting an archive.

You use server-side code to start and stop archive recordings. In the `config.js` file, you set the
`SAMPLE_SERVER_BASE_URL` variable to the base URL of the web service the app calls to start archive
recording, stop recording, and retrieve link to download the transcription.

To start recording the video stream, the user clicks the Start Archive button which invokes the
`startArchiving()` method in app.js. This method in turn sends a POST request to server with the options needed to generate a transcription.

Once the `'archiveStarted'` event is fired, the Start Archive button is hidden and the Stop Archive button is displayed.

```javascript
async function startArchiving(){
  console.log('start archiving');
  try {
    const archiveOptions = {
      sessionId,
      outputMode: 'individual',
      hasTranscription: true
    }
    archive = await postData(SAMPLE_SERVER_BASE_URL +'/archive/start',archiveOptions);
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
method. When the `archiveStopped` event is fired, 
the Stop Archive button is hidden while the Start Archive button is shown but disabled and the `getTranscription()` function is called.

```javascript
  session.on('archiveStopped', (event) => {
    archive = event;
    console.log('Archive stopped ' + archive.id);
    archiveStartBtn.style.display = 'inline';
    archiveStartBtn.disabled = true;
    archiveStopBtn.style.display = 'none';
    getTranscription();    
  });
```

The `getTranscription()` function makes a request to get the status of the transcription every 5 seconds. Once the transcription is available, a link to download the zip with the JSON file will appear and the Start Archive buttion will be enabled. 

```javascript
  async function getTranscription() {
    if (statusSpan.innerText === ''){
      statusSpan.innerText = "Getting transcription (may take a while)";
    }
    try {
        const response = await fetch(`${SAMPLE_SERVER_BASE_URL}/archive/${archive.id}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }  
        const json = await response.json();
        if (json.transcription.status === 'available'){
          statusSpan.innerHTML = `<a href="${json.transcription.url}" download="transcription.zip" target="_blank">download transcription</a>`;
          archiveStartBtn.disabled = false;

        } else {
          statusSpan.innerText = statusSpan.innerText + "."
          setTimeout(() => {
            getTranscription();
          }, 5000);
        }
    } catch (error) {
        console.error("Error getting transcription: ", error);
    }
  }
```

> Note: In a production application, instead of polling an endpoint to get the status of the transcription, a WebHook endpoint should be set up so that the application can recieve a notification when the transcription is ready to be downloaded.

For more information, see the [Vonage Video Post-call transcription developer
guide](https://developer.vonage.com/en/video/guides/archiving/transcription).
