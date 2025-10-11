// const express = require('express')
// const path = require('path')
// const { createServer } = require('http');
// const { WebSocketServer } = require('ws');
// const VAD = require('@ricky0123/vad-node').default;

// const { pipeline } = require('@huggingface/transformers');
// const { LinkupClient } = require('linkup-sdk');

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { pipeline } from '@huggingface/transformers';
import { LinkupClient } from 'linkup-sdk';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

// Load the API key from the .env file
dotenv.config();

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file URL
const __dirname = path.dirname(__filename);



const appId = process.env.API_APPLICATION_ID;
let privateKey;

if (process.env.PRIVATE_KEY) {
  try {
      privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
  } catch (error) {
      // PRIVATE_KEY entered as a single line string
      privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  }
} else if (process.env.PRIVATE_KEY64){
  privateKey = Buffer.from(process.env.PRIVATE_KEY64, 'base64');
}

if (!appId || !privateKey) {
  console.error('=========================================================================================================');
  console.error('');
  console.error('Missing Vonage Application ID and/or Vonage Private key');
  console.error('Find the appropriate values for these by logging into your Vonage Dashboard at: https://dashboard.nexmo.com/applications');
  console.error('Then add them to ', path.resolve('.env'), 'or as environment variables' );
  console.error('');
  console.error('=========================================================================================================');
  process.exit();
}

// const { Vonage } = require('@vonage/server-sdk');
// const { Video } = require('@vonage/video')
import { Vonage } from '@vonage/server-sdk';
import { Video } from '@vonage/video';


const vonageCredentials = {
  applicationId: appId,
  privateKey: privateKey
};
const vonage = new Vonage(vonageCredentials);
vonage.video = new Video(vonageCredentials);





// Create a directory for saving the audio
const outputDir = './output';

try {
  fs.accessSync(outputDir, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  fs.mkdirSync(outputDir);
}

// Create a write stream for saving the audio into mp3
const writeStream = fs.createWriteStream(outputDir + '/test.mp3', {
  flags: 'a',
});

// Helper function to write the audio encoded in base64 string into local file
function writeToLocal(base64str, writeStream) {
  const audioBuffer = Buffer.from(base64str, 'base64');
  writeStream.write(audioBuffer, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

const app = express()
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

const server = createServer(app);
const wss = new WebSocketServer({ server });


const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
// For use cases where latency is important, we recommend using the 'eleven_flash_v2_5' model.
const model = 'eleven_flash_v2_5';
const uri = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
// const websocket = new WebSocket(uri, {
//   headers: { 'xi-api-key': `${ELEVENLABS_API_KEY}` },
// });


// websocket.on('open', async () => {
//   websocket.send(
//     JSON.stringify({
//       text: ' ',
//       voice_settings: {
//         stability: 0.5,
//         similarity_boost: 0.8,
//         use_speaker_boost: false,
//       },
//       generation_config: { chunk_length_schedule: [120, 160, 250, 290] },
//     })
//   );
// });


// // Close when the websocket connection closes
// websocket.on('close', () => {
//   console.log('11labs socket closed!')
// });


let sessionId;

const LINKUP_API_KEY = process.env.LINKUP_API_KEY;

const client = new LinkupClient({ apiKey: LINKUP_API_KEY });

// --- Configuration ---
// These values are tunable.
const RMS_THRESHOLD = 0.02; // Volume threshold for considering audio as speech.
const SILENCE_DURATION_MS = 1000; // How long silence must last to trigger transcription.

// --- Helper function to calculate audio volume (RMS) ---
function calculateRMS(audioBuffer) {
    if (audioBuffer.length < 2) return 0;

    // The audio is 16-bit PCM, so each sample is 2 bytes.
    const samples = Math.floor(audioBuffer.length / 2);
    let sumOfSquares = 0;

    for (let i = 0; i < audioBuffer.length-1; i += 2) {
        // Read a 16-bit little-endian sample.
        const sample = audioBuffer.readInt16LE(i);
        // Normalize the sample to the range [-1.0, 1.0].
        const normalizedSample = sample / 32768.0;
        sumOfSquares += normalizedSample * normalizedSample;
    }

    const meanSquare = sumOfSquares / samples;
    return Math.sqrt(meanSquare);
}


app.post("/set-session-id", (req, res) => {
  console.log("/set-session-id: ", req.body);
  sessionId = req.body.sessionId; 
  console.log("Session ID set to:", sessionId);
  res.setHeader("Content-Type", "application/json");
  res.send({
    status: "session id set",
  });
});


async function init(){
  // --- Hugging Face Transformers.js Setup ---
  console.log('Loading speech recognition model...');
  const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base.en');
  console.log('Model loaded successfully.');

  wss.on('connection', async function (ws) {
    console.log('Client connected.');


    let speechBuffer = [];
    let silenceTimer = null;
    let speechInProgress = false;
    let answerInProgress = false;

    // Function to process and transcribe the buffered audio
    async function processAudio(audioData) {
        if (audioData.length < 2) return;
        console.log(`Processing ${audioData.length} bytes of audio...`);

        try {
            // Convert the 16-bit PCM Buffer to a Float32Array
            const audioFloats = new Float32Array(audioData.length / 2);
            for (let i = 0; i < audioData.length-1; i += 2) {
                audioFloats[i / 2] = audioData.readInt16LE(i) / 32768.0;
            }

            // Transcribe the audio
            const output = await transcriber(audioFloats, {
                sampling_rate: 16000,
            });

            console.log('output: ',output);
            console.log('answerInProgress', answerInProgress);

            if (!output.text.includes('(') && !output.text.includes('[') && answerInProgress === false ) {
                console.log('Transcription:', output.text);
                await vonage.video.sendSignal({ 
                  type: "question", 
                  data: JSON.stringify({
                    question: output.text,
                  }),
                }, sessionId);
                askLinkup(output.text);
                // ws.send(JSON.stringify({ event: 'transcription', text: output.text }));
            }
        } catch (error) {
            console.error('Error during transcription:', error);
        }
    }



    ws.on('message', async function message(data) {

      const rms = calculateRMS(data);

      if (rms > RMS_THRESHOLD) {
          // Speech detected
          speechInProgress = true;
          clearTimeout(silenceTimer); // Cancel any running silence timer
          speechBuffer.push(data);
      } else if (speechInProgress) {
        // --- Silence Detected Immediately After Speech ---
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
            const utterance = Buffer.concat(speechBuffer);
            speechBuffer = []; // Clear buffer for the next utterance
            processAudio(utterance);
        }, SILENCE_DURATION_MS);
        speechInProgress = false;
      }      
    });

    ws.on('error', function () {
      console.error('WebSocket error:', error);
      clearTimeout(silenceTimer);
    });

    ws.on('close', function () {
      console.log('Client disconnected');
      clearTimeout(silenceTimer);
      // Process any leftover audio in the buffer
      if (speechBuffer.length > 0) {
          processAudio(Buffer.concat(speechBuffer));
      }
    });

    async function askLinkup(question) {
      console.log('askLinkup: ', question);
      answerInProgress = true;

      await vonage.video.sendSignal({ 
        type: "thinking", 
        data: JSON.stringify({}),
      }, sessionId);

      const websocket = new WebSocket(uri, {
        headers: { 'xi-api-key': `${ELEVENLABS_API_KEY}` },
      });


      websocket.on('open', async () => {
        websocket.send(
          JSON.stringify({
            text: ' ',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              use_speaker_boost: false,
            },
            generation_config: { chunk_length_schedule: [120, 160, 250, 290] },
          })
        );
      });


      // Close when the websocket connection closes
      websocket.on('close', async () => {
        console.log('11labs socket closed!');
        // await vonage.video.sendSignal({ 
        //   type: "finished", 
        //   data: JSON.stringify({}),
        // }, sessionId);

      });





      const response = await client.search({
        query:question,
        depth:"standard",
        outputType:"sourcedAnswer",
        includeImages: false,
      });


      console.log('Linkup response: ', response);

      await vonage.video.sendSignal({ 
        type: "answering", 
        // data: JSON.stringify({}),
        data: JSON.stringify({
          answer: response.answer,
          sources: response.sources.map(({ name, url }) => ({ name, url }))
        })
      }, sessionId);

      websocket.send(JSON.stringify({ text: response.answer, flush: true }));
      websocket.on('message', async function incoming(event) {



        const data = JSON.parse(event.toString());
        if (data['audio']) {
          // Step 1: Decode base64 MP3 to Buffer
          const mp3Buffer = Buffer.from(data['audio'], 'base64');
          // console.log('MP3 buffer size:', mp3Buffer.length);
          // console.log('MP3 buffer first bytes:', mp3Buffer.slice(0, 16));

          // Step 2: Write MP3 buffer to a temp file
          const tempMp3Path = path.join(outputDir, `temp_${Date.now()}.mp3`);
          try {
            fs.writeFileSync(tempMp3Path, mp3Buffer);
            // console.log('Temp MP3 file written:', tempMp3Path);
          } catch (err) {
            console.error('Error writing temp MP3 file:', err);
            return;
          }

          // Check temp file exists and is not empty
          let stats;
          try {
            stats = fs.statSync(tempMp3Path);
            // console.log('Temp MP3 file size:', stats.size);
            if (stats.size === 0) {
              console.error('Temp MP3 file is empty!');
              return;
            }
          } catch (err) {
            console.error('Temp MP3 file stat error:', err);
            return;
          }

          // Step 3: Convert MP3 to PCM 16-bit, 16kHz mono using ffmpeg (output to temp file)
          const tempPcmPath = path.join(outputDir, `temp_${Date.now()}.pcm`);
          let ffmpegSuccess = true;
          await new Promise((resolve, reject) => {
            ffmpeg()
              .setFfmpegPath(ffmpegPath)
              .input(tempMp3Path)
              .outputOptions([
                '-f', 's16le',
                '-ac', '1',
                '-ar', '16000'
              ])
              .output(tempPcmPath)
              .on('error', (err) => {
                console.error('ffmpeg error:', err);
                ffmpegSuccess = false;
                resolve();
              })
              .on('end', () => {
                resolve();
              })
              .run();
          });

          // Step 4: Read PCM file and send frames
          let pcmBuffer = Buffer.alloc(0);
          if (ffmpegSuccess) {
            try {
              pcmBuffer = fs.readFileSync(tempPcmPath);
              // console.log('Temp PCM file size:', pcmBuffer.length);
            } catch (err) {
              console.error('Error reading temp PCM file:', err);
              pcmBuffer = Buffer.alloc(0);
            }
          }

          // Step 5: Clean up temp files
          fs.unlink(tempMp3Path, (err) => {
            if (err) console.error('Error deleting temp mp3 file:', err);
          });
          fs.unlink(tempPcmPath, (err) => {
            if (err) console.error('Error deleting temp pcm file:', err);
          });

          // Step 6: Send 640-byte frames (20ms @ 16kHz mono)
          if (pcmBuffer.length > 0) {

            for (let offset = 0; offset < pcmBuffer.length; offset += 640) {

              const frame = pcmBuffer.slice(offset, offset + 640);
              ws.send(frame, { binary: true });
            }
            // Wait 5 seconds before sending the 'finished' signal
            setTimeout(async () => {
              await vonage.video.sendSignal({ 
                type: "finished", 
                data: JSON.stringify({}),
              }, sessionId);
            }, 5000);

            answerInProgress = false;

          }

          // Optionally write to local file
          // writeToLocal(data['audio'], writeStream);

          // await vonage.video.sendSignal({ 
          //   type: "finished", 
          //   data: JSON.stringify({}),
          // }, sessionId);

          // answerInProgress = false;
          // Send empty string to indicate the end of the text sequence which will close the websocket connection
          websocket.send(JSON.stringify({ text: '' }));
        }
      });
      // answerInProgress = false;
    }

  });
}

init();

server.listen(8080,"0.0.0.0", function () {
  console.log('Listening on http://localhost:8080');
});