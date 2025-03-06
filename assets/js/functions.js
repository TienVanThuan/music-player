const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const nameSong = $('.dashboard-title');
const thumbnailSong = $('.dashboard-thumbnail-img img');
const audioSong = $('.audio-display audio');
const playButton = $('.js-toggle-play');
const progress = $('.progress');
const prevSongBtn = $('.prev-track');
const nextSongBtn = $('.next-track');
const currentTimeText = $('.time-display .current-time');
const totalTimeText = $('.time-display .total-time');

const app = {
  currentIndex: 0,
  songs: [],
  isPlaying: false,
  init: function () {
    fetch('assets/json/songs.json')
    .then((response) => response.json())
    .then((data) => {
      this.songs = data;

      this.loadCurrentSong();
      app.render();
    })
    .catch((error) => {
      console.error(error);
    });
  },
  render: function() {
    const htmls = this.songs.map(song => {
      return `
        <li class="music-item">
          <div class="music-item_thumbnail">
            <img src="${song.image}" alt="${song.name}">
          </div>
          <div class="music-item_detail">
            <h3 class="music-item_name-song">${song.title}</h3>
            <p class="music-item_name-singer">${song.single}</p>
          </div>
          <i class="play-pause fa-solid fa-play"></i>
        </li>
      `
    });
    $('.player-music-list').innerHTML = htmls.join('');
  },
  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvens: function () {
    const _this = this
    const thumbnail = $('.dashboard-thumbnail');
    const thumbnailWidth = thumbnail.offsetWidth;

    const thumbnailAnimation = thumbnail.animate([{
      transform: 'rotate(360deg)'
    }], {
      duration: 30000,
      iterations: Infinity
    });

    thumbnailAnimation.pause();


    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newThumbnailWidth = thumbnailWidth - scrollTop;

      thumbnail.style.width = newThumbnailWidth > 0 ? newThumbnailWidth + 'px' : 0;
      thumbnail.style.opacity = newThumbnailWidth / thumbnailWidth;
    };

    playButton.onclick = function() {
      if(_this.isPlaying) {
        _this.isPlaying = false;
        pauseSong()
      } else {
        _this.isPlaying = true;
        playSong();
      }
    };

    audioSong.ontimeupdate = function() {
      if(audioSong.duration) {
        const progressCurrent = Math.floor( audioSong.currentTime / audioSong.duration * 100);
        progress.value = progressCurrent;
      }
    };

    progress.onchange = function(e) {
      const seekTime = audioSong.duration / 100 * e.target.value
      audioSong.currentTime = seekTime;
    }

    nextSongBtn.onclick = function() {
      _this.nextSong();
      playSong();
    }

    prevSongBtn.onclick = function() {
      _this.prevSong();
      playSong();
    }

    function playSong() {
      audioSong.play();
      playButton.classList.add('is-playing');
      thumbnailAnimation.play();
    }

    function pauseSong() {
      audioSong.pause();
      playButton.classList.remove('is-playing');
      thumbnailAnimation.pause();
    }
  },
  loadCurrentSong: function () {
    nameSong.textContent = this.currentSong.title;
    thumbnailSong.src = this.currentSong.image;
    audioSong.src = this.currentSong.path;
  },
  prevSong: function () {
    this.currentIndex--;
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  handleTimeSong: function() {
    setTimeout(function() {
      let currentTimeSong = (audioSong.duration / 60).toFixed(2);
      totalTimeText.innerHTML = currentTimeSong;
    }, 10)
  },
  start: function () {
    this.init();
    this.defineProperties();
    this.handleEvens();
    this.handleTimeSong();
    this.render();
  },
}

app.start();