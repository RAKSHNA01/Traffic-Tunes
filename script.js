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

function generateTraffic() {
  const levels = ["Low", "Medium", "High"];
  const level = levels[Math.floor(Math.random() * levels.length)];

  let time, mood;

  if (level === "Low") {
    time = "5–10 minutes";
    mood = "Calm 🌊";
  } else if (level === "Medium") {
    time = "15–25 minutes";
    mood = "Neutral 🌬";
  } else {
    time = "40–60 minutes";
    mood = "Stress Relief 🌧";
  }

  document.getElementById("output").innerHTML = `
    <p><strong>Traffic Level:</strong> ${level}</p>
    <p><strong>Estimated Clearance:</strong> ${time}</p>
    <p><strong>Emotional Sound:</strong> ${mood}</p>
  `;

  playAmbientSound(level);
}

// 🎶 Emotional Sound Engine
function playAmbientSound(level) {
  stopAllSounds();

  if (level === "Low") {
    playWaterSound();
  } else if (level === "Medium") {
    playWindSound();
  } else {
    playRainSound();
  }
}

let activeNodes = [];

function stopAllSounds() {
  activeNodes.forEach(node => {
    try { node.stop(); } catch {}
  });
  activeNodes = [];
}

// 🌊 Water Sound (Soft waves)
function playWaterSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 180;

  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  activeNodes.push(osc);
}

// 🌬 Wind Sound (Airy noise)
function playWindSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 100;

  gain.gain.value = 0.04;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  activeNodes.push(osc);
}

// 🌧 Rain Sound (Low relaxing hum)
function playRainSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 70;

  gain.gain.value = 0.03;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  activeNodes.push(osc);
}
