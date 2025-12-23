const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let analyser;
let micSource;
let oscillator;
let micStream;

// Start microphone
function startMic() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      micStream = stream;
      micSource = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      micSource.connect(analyser);

      document.getElementById("result").innerHTML =
        "🎤 Listening to traffic noise...<br>Click <b>Stop & Analyze</b>";
    })
    .catch(() => {
      alert("Microphone permission denied");
    });
}

// Stop mic and analyze
function stopMic() {
  if (!analyser) {
    alert("Microphone not started");
    return;
  }

  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }

  const avg = sum / bufferLength;

  // Stop mic stream
  micStream.getTracks().forEach(track => track.stop());

  classifyTraffic(avg);
}

// Decide traffic level
function classifyTraffic(avg) {
  let level, time, freq;

  if (avg < 6) {
    level = "Low Traffic 🚗";
    time = "5–10 minutes";
    freq = 220;
  } else if (avg < 15) {
    level = "Medium Traffic 🚙";
    time = "20–30 minutes";
    freq = 140;
  } else {
    level = "High Traffic 🚗🚗";
    time = "45–60 minutes";
    freq = 80;
  }

  playSound(freq);

  document.getElementById("result").innerHTML = `
    <b>Traffic Level:</b> ${level}<br>
    <b>Estimated Clearance:</b> ${time}<br><br>
    🎧 Playing calming sound...
  `;
}

// Play calming tone
function playSound(freq) {
  if (oscillator) oscillator.stop();

  oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
}
