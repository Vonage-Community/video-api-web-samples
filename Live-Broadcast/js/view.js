(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const credentials = await getCredentials('viewer');
        const session = OT.initSession(
            credentials.applicationId,
            credentials.sessionId,
            {
                connectEventsSuppressed: true
            }
        );

        session.connect(credentials.token, (error) => {
            if (error) {
                console.log(error);
                return;
            }

            session.on('streamCreated', (event) => {
                session.subscribe(event.stream, 'host', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                })
            });
        });
    });
})();