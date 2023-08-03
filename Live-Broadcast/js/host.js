(async () => {
    let broadcast;

    document.addEventListener('DOMContentLoaded', async () => {
        const credentials = await getCredentials('host');
        const session = OT.initSession(
            credentials.applicationId,
            credentials.sessionId,
            {
                connectEventsSuppressed: true
            }
        );

        session.connect(credentials.token, (error) => {
            if (error) {
                console.error(error);
                return;
            }
            const publisher = OT.initPublisher('host', {
                insertMode: 'append',
                width: '100%',
                height: '100%',
            }, (error) => {
                if (error) { console.log(error); }
            });

            session.publish(publisher);

            session.on('streamCreated', (event) => {
                session.subscribe(event.stream, 'guest', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                })
            });

            document.getElementById('btn-start').addEventListener('click', async (el, event) => {
                broadcast = await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/start`, {
                    method: "POST",
                    body: JSON.stringify({
                        rtmp: [],
                        lowLatency: false,
                        dvr: false,
                        sessionId: session.id,
                        streamMode: "auto"
                    }),
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .catch(error => console.error(error));
            });

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
                    .then(res => res.json())
                    .catch(error => console.error(error));
            });

            document.getElementById('btn-view').addEventListener('click', (el, event) => {
                window.open('/view.html?url=' + broadcast.broadcastUrls.hls)
            })
        });
    });
})();