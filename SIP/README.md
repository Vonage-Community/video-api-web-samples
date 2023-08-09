Vonage Video SIP Sample
=======================

This sample shows you how to connect a SIP connection to a video call. You can create
conference dial-in numbers or directly call someone to add them to a video call.

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/vonage-community/video-api-web-samples/tree/main/SIP)

Enter in the URL for a server running the [Vonage Video Learning Server](https://github.com/Vonage-Community/sample-video-node-learning_server/) into the `js/config.js` file.

> Note: There is a devDependency `sirv-cli` in the project that is only necessary to run the demo on StackBlitz.

## Running the Demo

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

## Setting Up the Demo

This demo requires the Vonage Video Learning Server to control the SIP interaction with the Vonage Voice API. You will need to deploy a copy of the Vonage Video Learning Server to a location that this web sample can reach. This can include deploying to a service like Railway to give it a public URL or using ngrok to open a tunnel to the server running on your local machine. This demo does require external access for the SIP connections to work, so you cannot run everything via the `localhost` URL.

For instructions on setting up the Learning Server, please checkout out it's [README](https://github.com/Vonage-Community/sample-video-node-learning_server/).

You will also need a Vonage Application configured with the Voice capability, and with the proper "Answer" and "Event" callback URLs configured. From your Vonage Customer Dashboard, go to [Applications](https://dashboard.nexmo.com/applications), and then click the bubble menu on the card for your application, and select "Edit."

Toggle the "Voice" capability card, and fill in the "Answer URL" as well as the "Event URL".

* **Answer URL**: <your-domain>/sip/vapi/answer
* **Event URL**: <your-domain>/sip/vapi/events

These two URLs will handle incoming calls and the SIP connections. Click on "Save Changes" at the bottom.

You will also need to link a number to the Vonage Application. If you have existing numbers, you can click "Link" next to the number list when viewing the Application details. If you do not have a number, you can go to ["Numbers" > "Buy Numbers"](https://dashboard.nexmo.com/buy-numbers) and purchase a new number. Once the number is purchased, go back to the Application view and link the number.

On the Learning Server, make sure you have filled in the `API_KEY`, `API_SECRET`, and `CONFERENCE_NUMBER` so that SIP can be used with your Vonage account.

## Using the Demo

Once on the demo's site, you should see your video camera preview. On the right-hand side will be buttons to start a conference dial-in, and a second button to hang up the conference. Once the conference has been started, a new guest will appear which will be the SIP connection.

Anyone can then dial into the number associated with your application, and they can hear everyone else who is joined through video.

You can also directly dial someone's phone as well. Entering their number with the country code (and no + sign) will call them directly and bridge them into the video call. Their audio will be heard through anyone that has dialed into the conference call as well.
