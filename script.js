function analyzeFile() {
  // Simulate AI analysis
  const levels = ["Low", "Medium", "High"];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  showResult(randomLevel);
}

function startMic() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
      // Simulated AI-based noise sensing
      const levels = ["Low", "Medium", "High"];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];

      showResult(randomLevel);
    })
    .catch(() => {
      alert("Microphone access denied");
    });
}

function showResult(level) {
  let message = "";

  if (level === "Low") {
    message = "🚗 Low Traffic\n🎵 Slow, calming xylophone music playing";
  } else if (level === "Medium") {
    message = "🚙 Medium Traffic\n🎵 Balanced xylophone rhythm playing";
  } else {
    message = "🚗🚗🚗 High Traffic\n🎵 Fast & high-pitch xylophone music playing";
  }

  document.getElementById("output").innerText = message;
}
