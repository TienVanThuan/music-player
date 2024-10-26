const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let songs = [];

let apiSongs = fetch('assets/json/songs.json')
                  .then((response) => response.json())
                  .then((data) => {
                    songs.push(...data);
                  });

const app = {
  render: function () {
    songs: songs;
  },
  start: function () {
    this.render();
  },
}

app.start();