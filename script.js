const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let activeNodes = [];

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

// Main traffic logic
function generateTraffic() {
  stopAllSounds();

  const levels = ["Low", "Medium", "High"];
  const level = levels[Math.floor(Math.random() * levels.length)];

  let time, sound, emoji;

  if (level === "Low") {
    time = "5–10 minutes";
    sound = "Calming Water Sounds 🌊";
    emoji = "🚗";
    playWaterSound();
  } else if (level === "Medium") {
    time = "15–25 minutes";
    sound = "Gentle Wind Sounds 🌬";
    emoji = "🚙🚕";
    playWindSound();
  } else {
    time = "40–60 minutes";
    sound = "Relaxing Rain Sounds 🌧";
    emoji = "🚗🚗🚛";
    playRainSound();
  }

  document.getElementById("output").innerHTML = `
    <p><strong>Traffic Level:</strong> ${level} ${emoji}</p>
    <p><strong>Estimated Clearance Time:</strong> ${time}</p>
    <p><strong>Sound Mode:</strong> ${sound}</p>
  `;
}

// Stop previous sounds
function stopAllSounds() {
  activeNodes.forEach(node => {
    try { node.stop(); } catch {}
  });
  activeNodes = [];
}

// 🌊 Water sound (calm waves)
function playWaterSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 180;
  gain.gain.value = 0.04;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  activeNodes.push(osc);
}

// 🌬 Wind sound (airy flow)
function playWindSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 120;
  gain.gain.value = 0.035;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  activeNodes.push(osc);
}

// 🌧 Rain sound (deep relaxing tone)
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
