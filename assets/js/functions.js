const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const nameSong = $('.dashboard-title');
const thumbnailSong = $('.dashboard-thumbnail-img img');
const audioSong = $('.audio-display audio');
const playButton = $('.js-toggle-play');

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
    const thumbnail = $('.dashboard-thumbnail');
    const thumbnailWidth = thumbnail.offsetWidth;

    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newThumbnailWidth = thumbnailWidth - scrollTop;

      thumbnail.style.width = newThumbnailWidth > 0 ? newThumbnailWidth + 'px' : 0;
      thumbnail.style.opacity = newThumbnailWidth / thumbnailWidth;
    };

    playButton.addEventListener('click', function() {
      if(this.isPlaying) {
        this.isPlaying = false;
        audioSong.pause();
        playButton.classList.remove('is-playing');
      } else {
        this.isPlaying = true;
        audioSong.play();
        playButton.classList.add('is-playing');
      }
    });

    if(playButton.classList.contains('is-playing')) {
      playButton.addEventListener('click', function() {
        audioSong.pause();
        playButton.classList.remove('is-playing');
      });
    }
  },
  loadCurrentSong: function () {
    nameSong.textContent = this.currentSong.title;
    thumbnailSong.src = this.currentSong.image;
    audioSong.src = this.currentSong.path;
  },
  start: function () {
    this.init();
    this.defineProperties();
    this.handleEvens();
    this.render();
  },
}

app.start();