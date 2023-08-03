(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('video');
        const videoSource = new URLSearchParams(window.location.search).get('url');

        if (!videoSource) {
            alert('No HLS URL was passed. No video will be displayed');
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                video.muted = true;
                video.play();
            });

            hls.loadSource(videoSource);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSource;
        } else {
            alert('Browser does not seem to have HLS capabilities. No video will be displayed');
            return;
        }
    });
})();