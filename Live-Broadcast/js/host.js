(async () => {
    let broadcast;
    let shouldCheckBroadcast = false;

    function initPublisher() {
        return OT.initPublisher('host', {
            insertMode: 'append',
            width: '100%',
            height: '100%',
        }, (error) => {
            if (error) { console.log(error); }
        });
    }

    async function checkBroadcast() {
        if (shouldCheckBroadcast) {
            await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/status`, {
                method: "POST",
                body: JSON.stringify({
                    sessionId: broadcast.sessionId
                }),
                headers: {
                    "Content-type": "application/json"
                }
            })
                .then(res => {
                    const data = res.json()
                    console.log(data);
                })
                .catch(error => console.error(error));
            setTimeout(checkBroadcast, 5000);
        }
    }

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

            let publisher = initPublisher();

            session.on('streamCreated', (event) => {
                session.subscribe(event.stream, 'guest', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                })
            });

            document.getElementById('btn-start').addEventListener('click', async (el, event) => {
                const rtmp = [];
                if (document.getElementById('rtmpAddress').value) {
                    rtmp.push({
                        serverUrl: document.getElementById('rtmpAddress').value,
                        streamName: document.getElementById('rtmpKey').value,
                    });
                }
                broadcast = await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/start`, {
                    method: "POST",
                    body: JSON.stringify({
                        rtmp,
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
                        shouldCheckBroadcast = true;
                        setTimeout(checkBroadcast, 5000);
                        return res.json()
                    })
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
                    .then(res => {
                        session.unpublish(publisher);
                        shouldCheckBroadcast = false;
                        publisher = initPublisher();
                        return res.json()
                    })
                    .catch(error => console.error(error));
            });

            document.getElementById('btn-view-webrtc').addEventListener('click', (el, event) => {
                window.open('/view.html');
            })

            document.getElementById('btn-view-hls').addEventListener('click', (el, event) => {
                window.open('/hls.html?url=' + broadcast.broadcastUrls.hls);
            })
        });
    });
})();