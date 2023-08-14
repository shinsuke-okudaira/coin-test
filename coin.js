//midiノート番号から周波数への変換
//周波数が2倍で1オクターブ上がる MIDIノート番号が+12
//周波数が1/2で1オクターブ下がる　MIDIノート番号が-12

// MIDIノート番号
// 12=C0, 13=C#0, 14=D0, 15=D#0, 16=E0, 17=F0, 18=F#0, 19=G0, 20=G#0, 21=A0, 22=A#0, 23=B0, 60=C4 69=A4

//テンポ120のとき四分音符は0.5秒
//テンポが2倍になると長さは1/2倍
//八分音符は四分音符の1/2倍の長さ0.25秒
//二分音符は四分音符の2倍の長さ1.0秒

// AudioContextの役割はオーディオノードを生成するメソッドの提供とオーディオノードを組み合わせたオーディオグラフにもとづいた音声処理を行うこと
// var audioContext = new AudioContext(); で生成する
window.AudioContext = window.AudioContext || window.webkitAudioContext;

function coin(destination, playbackTime) {
  var t0 = playbackTime;
  var t1 = tdur(180, 16); //テンポ180 16分音符
  var t2 = tdur(180, 4) * 3; //テンポ180 4分音符×3
  var si = mtof(83); //83=B5 シ
  var mi = mtof(88); //88=E6 ミ
  var audioContext = destination.context; //出力ノード
  var oscillator = audioContext.createOscillator(); //基本的な音を生成するオーディオノード
  var gain = audioContext.createGain(); //音量の調整

  //frequency 音の高さを周波数で指定
  oscillator.type = 'square'; //typeで指定できる波形は "sine" "triangle" "sawtooth" "square"
  oscillator.frequency.setValueAtTime(si, t0);
  oscillator.frequency.setValueAtTime(mi, t1);
  oscillator.start(t0);
  oscillator.stop(t2);
  oscillator.connect(gain); //オーディオノードを組み合わせてオーディオグラフに
  oscillator.onended = function () {
    oscillator.disconnect();
  };

  gain.gain.setValueAtTime(0.5, t0);
  gain.gain.setValueAtTime(0.5, t1);
  gain.gain.linearRampToValueAtTime(0, t2); //endTime(第2引数)にvalue(第1引数)の値に線形変化させるメソッド
  gain.connect(destination);
}

//pitch MIDIノート番号から周波数への変換
function mtof(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12); //440Hz 69=A4 ラ
}

//duration
function tdur(tempo, length) {
  return (60 / tempo) * (4 * length);
}

let play = document.getElementById('play');
let stop = document.getElementById('stop');
let suspend = document.getElementById('suspend');
let resume = document.getElementById('resume');
var audioContext = new AudioContext();

play.addEventListener('click', () => {
  coin(audioContext.destination, audioContext.currentTime);
});

stop.addEventListener('click', () => {
  audioContext.close();
});

suspend.addEventListener('click',()=>{
  audioContext.suspend();
});

resume.addEventListener('click',()=>{
  audioContext.resume();
});

