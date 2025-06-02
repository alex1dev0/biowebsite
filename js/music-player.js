document.addEventListener('DOMContentLoaded', () => {
    const musicStartOverlay = document.getElementById('music-start-overlay');
    const startMusicBtn = document.getElementById('start-music-btn');
    
    const playlist = [
        {
            title: "Esempio Canzone 1",
            artist: "Artista 1",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            title: "Esempio Canzone 2",
            artist: "Artista 2",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Esempio Canzone 3",
            artist: "Artistdwada 3",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ];

    const audioPlayer = document.getElementById('audio-player');
    const musicDisc = document.querySelector('.music-disc');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const prevBtn = document.querySelector('.prev-btn');
    const playBtn = document.querySelector('.play-btn');
    const nextBtn = document.querySelector('.next-btn');
    const volumeIcon = document.querySelector('.volume-icon');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumePercentage = document.querySelector('.volume-percentage');

    let currentSongIndex = 0;
    let isPlaying = false;

    function initPlayer() {
        loadSong(currentSongIndex);

        audioPlayer.volume = 0.8; 
        updateVolumeUI();

        audioPlayer.muted = true;
        
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        musicDisc.classList.remove('playing');

        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        progressContainer.addEventListener('click', setProgress);
        volumeIcon.addEventListener('click', toggleMute);
        volumeSlider.addEventListener('click', setVolume);

        const customPlaylist = window.customPlaylist;
        if (customPlaylist && Array.isArray(customPlaylist) && customPlaylist.length > 0) {
            playlist.length = 0;
            customPlaylist.forEach(song => playlist.push(song));
            loadSong(0); 
        }
    }

    function startMusic() {
        musicStartOverlay.classList.add('hidden');
        
        audioPlayer.muted = false;
        audioPlayer.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicDisc.classList.add('playing');
        }).catch(error => {
            console.log('Playback failed:', error);
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicDisc.classList.remove('playing');
        });
    }

    if (startMusicBtn) {
        startMusicBtn.addEventListener('click', startMusic);
    }

    function loadSong(index) {
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;

        currentSongIndex = index;
        const song = playlist[currentSongIndex];

        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audioPlayer.src = song.src;

        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';

        if (isPlaying) {
            audioPlayer.play();
            musicDisc.classList.add('playing');
        }
    }

    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicDisc.classList.add('playing');
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            musicDisc.classList.remove('playing');
            isPlaying = false;
        }
    }

    function prevSong() {
        loadSong(currentSongIndex - 1);
        if (isPlaying) {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicDisc.classList.add('playing');
        }
    }

    function nextSong() {
        loadSong(currentSongIndex + 1);
        if (isPlaying) {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicDisc.classList.add('playing');
        }
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            currentTimeEl.textContent = formatTime(currentTime);
            totalTimeEl.textContent = formatTime(duration);
        }
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    function toggleMute() {
        if (audioPlayer.volume > 0) {
            audioPlayer.dataset.prevVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else {
            audioPlayer.volume = audioPlayer.dataset.prevVolume || 0.8;
            updateVolumeIcon();
        }
        updateVolumeUI();
    }

    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        audioPlayer.volume = Math.max(0, Math.min(1, volume));
        updateVolumeUI();
        updateVolumeIcon();
    }

    function updateVolumeUI() {
        volumePercentage.style.width = `${audioPlayer.volume * 100}%`;
    }

    function updateVolumeIcon() {
        const volume = audioPlayer.volume;
        if (volume > 0.7) {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
        } else if (volume > 0.1) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else if (volume > 0) {
            volumeIcon.className = 'fas fa-volume-off volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        }
    }

    initPlayer();
});