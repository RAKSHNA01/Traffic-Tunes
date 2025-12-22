let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function analyzeFile() {
  const levels = ["Low", "Medium", "High"];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];
  showResult(randomLevel);
  playMusic(randomLevel);
}

function startMic() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
      const levels = ["Low", "Medium", "High"];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      showResult(randomLevel);
      playMusic(randomLevel);
    })
    .catch(() => {
      alert("Microphone access denied");
    });
}

function showResult(level) {
  let text = "";

  if (level === "Low") {
    text = "🚗 Low Traffic\n🎵 Slow xylophone music playing";
  } else if (level === "Medium") {
    text = "🚙 Medium Traffic\n🎵 Moderate xylophone music playing";
  } else {
    text = "🚗🚗🚗 High Traffic\n🎵 Fast & high-pitch xylophone music playing";
  }

  document.getElementById("output").innerText = text;
}

function playMusic(level) {
  let notes = [];
  let tempo = 600;

  if (level === "Low") {
    notes = [400, 500, 450];
    tempo = 800;
  } else if (level === "Medium") {
    notes = [500, 600, 550, 650];
    tempo = 500;
  } else {
    notes = [700, 800, 900, 850, 950];
    tempo = 250;
  }

  notes.forEach((freq, index) => {
    setTimeout(() => {
      playNote(freq);
    }, index * tempo);
  });
}

function playNote(frequency) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "triangle"; // xylophone-like
  oscillator.frequency.value = frequency;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioCtx.currentTime + 0.4
  );
  oscillator.stop(audioCtx.currentTime + 0.4);
}
