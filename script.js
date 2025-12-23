const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let oscillator;

function processAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const fileInput = document.getElementById("audioFile");
  if (!fileInput.files.length) {
    alert("Please upload a traffic noise file");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    audioCtx.decodeAudioData(e.target.result, buffer => {
      analyzeNoise(buffer);
    });
  };

  reader.readAsArrayBuffer(file);
}

function analyzeNoise(buffer) {
  const data = buffer.getChannelData(0);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += Math.abs(data[i]);
  }

  const avg = sum / data.length;
  let traffic, time, freq;

  if (avg < 0.02) {
    traffic = "Low Traffic 🚗";
    time = "5–10 minutes";
    freq = 220;
  } else if (avg < 0.05) {
    traffic = "Medium Traffic 🚙";
    time = "15–25 minutes";
    freq = 140;
  } else {
    traffic = "High Traffic 🚗🚗";
    time = "40–60 minutes";
    freq = 80;
  }

  playTone(freq);

  document.getElementById("result").innerHTML = `
    <b>Traffic Level:</b> ${traffic}<br>
    <b>Estimated Clearance:</b> ${time}<br><br>
    🎧 Adaptive calming sound playing...
  `;
}

function playTone(freq) {
  if (oscillator) oscillator.stop();

  oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
}
