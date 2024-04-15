const player = document.querySelector('.player--container'),
    playBtn = document.querySelector('.play'),
    prevBtn = document.querySelector('.prev'),
    nextBtn = document.querySelector('.next'),
    audio = document.querySelector('.audio'),
    progressContainer = document.querySelector('.progress--container'),
    progress = document.querySelector('.progress'),
    track_name = document.querySelector('.track--name'),
    cover_img = document.querySelector('.cover--img'),
    btn_change = document.querySelector('.btn_change'),
    text =document.querySelector('.text')

const songs = ['When I Was Your Man','Last day on Earth','A-O-K', 'Flowers']

const texts =[
    `./trackText/song1.txt`,
    `./trackText/song2.txt`,
    `./trackText/song3.txt`,
    `./trackText/song4.txt`
]

//песня по умолчанию
let songIndex = 0
function loadSong(song){
    track_name.innerHTML = song
    audio.src = `./tracks/${song}.mp3`
    cover_img.src = `./trackImg/cover${songIndex + 1}.jpg`
}
loadSong(songs[songIndex])

function scriptSong(url){
    fetch(url)
        .then(response => response.text())
        .then(data => {
            text.innerHTML = data;
        });
}
scriptSong(texts[songIndex])
function playSong(){
    player.classList.add('play')
    btn_change.src = './btn/pause.svg'
    audio.play()
}

function pauseSong() {
    player.classList.remove('play')
    btn_change.src = './btn/play.svg'
    audio.pause()
}

playBtn.addEventListener('click', () => {
    const isPlaying = player.classList.contains('play')
    if (isPlaying){
        pauseSong()
    }
    else {
        playSong()
    }
})

function nextSong(){
    songIndex++
    if (songIndex > songs.length - 1){
        songIndex = 0
    }

    loadSong(songs[songIndex])
    scriptSong(texts[songIndex])
    playSong()
}
nextBtn.addEventListener('click', nextSong)

function prevSong(){
    songIndex--
    if (songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong(songs[songIndex])
    scriptSong(texts[songIndex])
    playSong()
}
prevBtn.addEventListener('click', prevSong)

function updateProgress(e){
    const {duration, currentTime} = e.target
    const progressPercent = (currentTime/duration)*100
    progress.style.width = `${progressPercent}%`
}
audio.addEventListener('timeupdate', updateProgress)

function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration
    audio.currentTime = (clickX / width) * duration
}
progressContainer.addEventListener('click', setProgress)

audio.addEventListener('ended', nextSong)

//window.AudioContext = window.AudioContext;
let start = function() {
    const audio = document.getElementById('audio')
    let ctx = new AudioContext()
    let analyser = ctx.createAnalyser()
    let audioSrc = ctx.createMediaElementSource(audio)

    // connect the MediaElementSource with the analyser
    audioSrc.connect(analyser)
    analyser.connect(ctx.destination)

    let canvas = document.getElementById('canvas')
    const cw = canvas.width,
        ch = canvas.height,
        meterWidth = 8, //ширина одной колонки
        capHeight = 0, //высота прыгуна
        capStyle = '#fff',
        meterNum = 290 / (8 + 2), //количество колонок (общая ширина/(ширина+пробел))
        capYPositionArray = []
    const Ctx = canvas.getContext('2d'),
        gradient = Ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(1, '#000')
    gradient.addColorStop(0.5, '#646464')
    gradient.addColorStop(0, '#fff')
    // loop
    function renderFrame() {
        let array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        let step = Math.round(array.length / meterNum) //шаг для каждой колонки по Х
        Ctx.clearRect(0, 0, cw, ch)
        for (let i = 0; i < meterNum; i++) {
            const value = array[i * step]
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value)
            }
            Ctx.fillStyle = capStyle
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                Ctx.fillRect(i * 10, ch - (--capYPositionArray[i]), meterWidth, capHeight) //движение прыгунков
            } else {
                Ctx.fillRect(i * 10, ch - value, meterWidth, capHeight)
                capYPositionArray[i] = value
            }
            Ctx.fillStyle = gradient
            Ctx.fillRect(i * 10 , ch - value + capHeight, meterWidth, ch + 120) //высота колонки
        }
        requestAnimationFrame(renderFrame)
    }
    renderFrame()
}

audio.onplay = function(){
    start()
}