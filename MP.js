const playlist = document.querySelector('.playlist');
const player = document.querySelector('.content');
const cd = document.querySelector('.cd');
const heading = document.querySelector('.heading-name');
const cdThumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('#audio');
const playBtn = document.querySelector('.control-play');
const progressBar = document.querySelector('#progress');
const nextBtn = document.querySelector('.control-next');
const prevBtn = document.querySelector('.control-prev');
const randomBtn = document.querySelector('.control-random');
const repeatBtn = document.querySelector('.control-repeat');
const muteBtn = document.querySelector('.volumeClick');
const volumeBar = document.querySelector('.volume');
const timeStart = document.querySelector('.timeStart');
const timeEnd = document.querySelector('.timeEnd');



const PlAYER_STORAGE_KEY = "MUSIC_PLAYER";


const app = {
    currentIndex: 0,
    currentTime: 0,
    currentVolume: 50,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: 'Talking To The Moon x Play Date',
          singer: 'Bruno Mars x Melanie Martinez',
          path: './music/Talking To The Moon x Play Date.mp3',
          image: './image/PxT.jpg'
        },
        {
          name: 'Aloha',
          singer: 'Cool',
          path: './music/Aloha.mp3',
          image: './image/aloha.jpg'
        },
        {
          name: 'Every Summertime',
          singer: 'NIKI',
          path: './music/EverySummertime.mp3',
          image: './image/EveryS.jpg'
        },
        {
          name: 'Lay All Your Love On Me',
          singer: 'ABBA',
          path: './music/Lay All Your Love On Me.mp3',
          image: './image/ABBA.jpg'
        },
        {
          name: 'Nevada',
          singer: 'Vicetone',
          path: './music/Nevada.mp3',
          image: './image/Nevada.jpg'
        },
        {
          name: 'Where Have You Gone',
          singer: 'Surisan',
          path: './music/Where Have You Gone.mp3',
          image: './image/Whyg.jpg'
        },
        {
          name: '????????? ????????? ?????? ??????????????????',
          singer: 'Hisaishi Joe',
          path: './music/????????? ????????? ?????? ??????????????????.mp3',
          image: './image/ost.jpg'
        },
        {
          name: 'Trouble Is A Friend',
          singer: 'Lenka',
          path: './music/Trouble Is A Friend.mp3',
          image: './image/Lenka_Trouble_Is_A_Friend.jpg'
        },
    ],
    setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
      const htmls = this.songs.map((song, index) => {
        return `
          <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="music-body">
                <h3 class="music-name">${song.name}</h3>
                <span class="music-singer">${song.singer}</span>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
      })
      document.querySelector('.playlist').innerHTML = htmls.join('')
      
    },

    //?????nh ngh??a thu???c t??nh m???i currentSong 
    defineProperties: function(){ 
      Object.defineProperty(this, 'currentSong', {
        get: function(){
          return this.songs[this.currentIndex];
        }
      })
    },
    handleEvent: function(){
      
      const cdWidth = cd.offsetWidth;


      //Animation quay CD
      var cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {  
        duration: 10000, //10s
        iterations:Infinity  // l???p l???i m??i m??i
      })
      cdThumbAnimate.pause();


      //Ph??ng to / Thu nh??? CD
      document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth 
      }

      playBtn.style.cursor = 'pointer';

      //Khi click play b??i h??t
      playBtn.onclick = function(){
        if(app.isPlaying){
          audio.pause();
        }
        else{
          audio.play();
        }
      }

      //Khi b??i h??t ??c play -> chuy???n n??t pause sang play
      audio.onplay = function(){
        app.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
      }

      //Khi b??i h??t b??? pause -> chuy???n n??t play sang pause
      audio.onpause = function(){
        app.isPlaying = false;
        player.classList.remove('playing')
        cdThumbAnimate.pause();
      }

      let checkOnmouseAndTouch = true;
      progressBar.onmousedown = function() {
          checkOnmouseAndTouch = false;
        }

      progressBar.ontouchstart = function() {
          checkOnmouseAndTouch = false;
        }
      //Khi ti???n ????? b??i h??t thay ?????i
      audio.ontimeupdate = function(){
        if(audio.duration){
          const progress = audio.currentTime / audio.duration * 100  //th???i gian hi???n t???i / t???ng th???i gian b??i h??t 
          progressBar.value = progress;
          
          app.setConfig("currentTime", audio.currentTime);
        }
        
        var minuteStart = Math.floor(audio.currentTime / 60);
        var secondStart = Math.floor(audio.currentTime - minuteStart * 60);
        var minuteEnd = Math.floor(audio.duration / 60);
        var secondEnd = Math.floor(audio.duration - minuteEnd * 60);

        if(minuteStart < 10){
          minuteStart = "0" + minuteStart;
        }

        if(secondStart < 10){
          secondStart = "0" + secondStart;
        }

        if(minuteEnd < 10){
          minuteEnd = "0" + minuteEnd;
        }

        if(secondEnd < 10){
          secondEnd = "0" + secondEnd;
        }

        timeStart.innerHTML =  minuteStart + ":" + secondStart;
        timeEnd.innerHTML = minuteEnd + ":" + secondEnd;
      }
      

      //tua b??i h??t 
      progressBar.onchange = function(){        
          const seekTime = audio.duration / 100 * progressBar.value;
          audio.currentTime = seekTime;  
          checkOnmouseAndTouch = true;
      } 
      
      

      //Khi ???n n??t next b??i ti???p theo
      nextBtn.onclick = function(){
        if(app.isRandom){
          app.randomSong();
        }else{
          app.nextSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      }

      //Khi ???n n??t quay l???i b??i ph??a tr?????c
      prevBtn.onclick = function(){
        if(app.isRandom){
          app.randomSong();
        }else{
          app.prevSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();

      }

      //khi ???n n??t radom
      randomBtn.onclick = function(){
        app.isRandom = !app.isRandom;
        this.classList.toggle('active', app.isRandom);  
        app.setConfig('isRandom', app.isRandom);
      }

      //Khi ???n n??t repeat
      repeatBtn.onclick = function(){
        app.isRepeat = !app.isRepeat;
        this.classList.toggle('active', app.isRepeat);
        app.setConfig('isRepeat', app.isRepeat);
      }

      //Khi k???t th??c b??i h??t
      audio.onended = function(){
        if(app.isRepeat){
          audio.play();
        }else{
          nextBtn.click();
          audio.play();
        }  
      }


      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)');
  
        if (songNode || e.target.closest('.option')) {
        // X??? l?? khi click v??o song
        // Handle when clicking on the song
          if (songNode) {
            app.currentIndex = Number(songNode.dataset.index);
            app.loadCurrentSong()
            app.render();
            audio.play();
          }

          if(e.target.closest('.option')){
          
           
          }
        }
      }

      muteBtn.onclick = function(){
        if(audio.muted){
          this.classList.remove('mute');
          audio.muted = false;
          volumeBar.value = Math.random() * 100;
          audio.volume = volumeBar.value / 100
        }   
        else{
          this.classList.add('mute');
          audio.muted = true;
          volumeBar.value = 0;
        }
        
      }

      volumeBar.onmousemove = function(){
        audio.volume = this.value / 100;
        if(this.value == 0) {
          muteBtn.classList.add('mute');
        }
        else if(this.value != 0){
          muteBtn.classList.remove('mute');
        }
      }
      
    },
    scrollToActiveSong: function(){
      setTimeout(() => {
        document.querySelector('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inlines:'nearest'
        })
      }, 300)
    },
    loadCurrentSong: function(){
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
      if(this.currentIndex == this.config.currentIndex){
        audio.currentTime = this.config.currentTime;
      }
      else{
        audio.currentTime = 0;
      }
      this.setConfig("currentIndex", this.currentIndex);
    },
    loadConfig: function () {
      this.currentIndex = this.config.currentIndex || this.currentIndex;
      this.currentTime = this.config.currentTime || this.currentTime;
      this.currentVolume = this.config.currentVolume || this.currentVolume;
      this.isMute = this.config.isMute || this.isMute;
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
      
    },
    nextSong: function(){
      this.currentIndex++;
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },

    prevSong: function(){
      this.currentIndex--;
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
    },

    randomSong: function(){
      let newIndex;
      do{
        newIndex = Math.floor(Math.random() * this.songs.length);
      }while (newIndex === this.currentIndex)

      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },
    
    start: function(){

      //G??n c???u h??nh t??? config v??o ???ng d???ng
      this.loadConfig()

      //?????nh ngh??a c??c thu???c t??nh cho object
      this.defineProperties()

      //L???ng nghe v?? x??? l?? c??c s??? ki???n
      this.handleEvent()
      
      //T???i ra b??i h??t ?????u ti??n v??o UI khi b???t ?????u ch???y
      this.loadCurrentSong()


      //Render ra DOM
      this.render()

      //Hi???n th??? tr???ng th??i ban ?????u c???a random v?? repeat
      randomBtn.classList.toggle('active', this.isRandom);
      repeatBtn.classList.toggle('active', this.isRepeat);

    }
    
}
app.start()