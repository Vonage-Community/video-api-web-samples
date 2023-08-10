(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const credentials = await fetch(`${SAMPLE_SERVER_BASE_URL}/session`)
            .then(res => res.json());

        const conferenceDetails = await fetch(`${SAMPLE_SERVER_BASE_URL}/sip/session`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('conference-number').innerHTML = data.conferenceNumber;
                return data;
            });

        const session = OT.initSession(credentials.applicationId, credentials.sessionId);
        
        session.connect(credentials.token, (error) => {
            if (error) {
                console.error(error);
                return;
            }

            const publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, (error) => {
                if (error) { console.error(error) };
            })

            session.publish(publisher);
        })

        session.on('streamCreated', (event) => {
            session.subscribe(event.stream, 'subscribers', {
                insertMode: 'append',
                height: '100%',
                width: '100%'
            });
        })

        document.getElementById('btn-dial-conference').addEventListener('click', async () => {
            const resp = await fetch(`${SAMPLE_SERVER_BASE_URL}/sip/session/dial`, {
                method: "POST"
            })
            .then(res => res.json())

            console.log(resp);
        })

        document.getElementById('btn-dial-number').addEventListener('click', async () => {
            const msisdn = document.getElementById('phone').value;
            const resp = await fetch(`${SAMPLE_SERVER_BASE_URL}/sip/session/dial`, {
                method: "POST",
                body: JSON.stringify({
                    msisdn
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())

            console.log(resp);
        })

        document.getElementById('btn-disconnect-conference').addEventListener('click', async () => {
            const resp = await fetch(`${SAMPLE_SERVER_BASE_URL}/sip/session/hangup`, {
                method: "POST"
            })
                .then(res => res.json())

            console.log(resp);
        })
    });
})();