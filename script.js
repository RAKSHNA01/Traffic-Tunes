const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function enableAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Upload simulation
function analyzeFile() {
  enableAudio();
  generateTraffic();
}

// Mic simulation
function startMic() {
  enableAudio();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => generateTraffic())
    .catch(() => alert("Microphone access denied"));
}

// Traffic logic
function generateTraffic() {
  const levels = ["Low", "Medium", "High"];
  const level = levels[Math.floor(Math.random() * levels.length)];

  let time, emoji;

  if (level === "Low") {
    time = "5–10 minutes";
    emoji = "🚗";
  } else if (level === "Medium") {
    time = "15–25 minutes";
    emoji = "🚙🚕";
  } else {
    time = "40–60 minutes";
    emoji = "🚗🚗🚗🚛";
  }

  document.getElementById("output").innerHTML = `
    <p><strong>Traffic Level:</strong> ${level} ${emoji}</p>
    <p><strong>Estimated Clearance Time:</strong> ${time}</p>
    <p><strong>Music Mode:</strong> Adaptive Xylophone 🎶</p>
  `;

  playMusic(level);
}

// Music generator
function playMusic(level) {
  let notes, speed;

  if (level === "Low") {
    notes = [400, 450, 500];
    speed = 800;
  } else if (level === "Medium") {
    notes = [500, 600, 550, 650];
    speed = 500;
  } else {
    notes = [700, 800, 900, 850, 950];
    speed = 250;
  }

  notes.forEach((freq, i) => {
    setTimeout(() => playNote(freq), i * speed);
  });
}

function playNote(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  osc.stop(audioCtx.currentTime + 0.4);
}
