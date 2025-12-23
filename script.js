const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let analyser, micSource, micStream, oscillator;

// TAB SWITCHING
function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// MICROPHONE
function startMic() {
  audioCtx.resume();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      micStream = stream;
      micSource = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      micSource.connect(analyser);

      document.getElementById("result").innerText = "Listening...";
      drawGraph();
    });
}

function stopMic() {
  micStream.getTracks().forEach(track => track.stop());

  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);

  let sum = 0;
  data.forEach(v => sum += Math.abs(v - 128));
  let avg = sum / data.length;

  classifyTraffic(avg);
}

// GRAPH
function drawGraph() {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");

  function draw() {
    if (!analyser) return;

    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#00c6ff";

    data.forEach((v, i) => {
      let y = (v / 255) * canvas.height;
      let x = (i / data.length) * canvas.width;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();
    requestAnimationFrame(draw);
  }

  draw();
}

// CLASSIFY + SOUND
function classifyTraffic(avg) {
  let level, time, freq;

  if (avg < 6) {
    level = "Low Traffic 🚗";
    time = "5–10 min";
    freq = 220;
  } else if (avg < 15) {
    level = "Medium Traffic 🚙";
    time = "20–30 min";
    freq = 140;
  } else {
    level = "High Traffic 🚗🚗";
    time = "45–60 min";
    freq = 80;
  }

  playSound(freq);

  document.getElementById("result").innerHTML =
    `<b>${level}</b><br>Clearance Time: ${time}`;
}

// SOUND
function playSound(freq) {
  if (oscillator) oscillator.stop();

  oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.frequency.value = freq;
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();
}
