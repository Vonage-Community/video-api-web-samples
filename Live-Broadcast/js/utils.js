async function getCredentials(mode) {
    return await fetch(`${SAMPLE_SERVER_BASE_URL}/broadcast/session/${mode}`)
            .then(res => res.json())
            .catch(error => console.error(error));
}