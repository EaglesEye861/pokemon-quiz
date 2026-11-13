// Game variables
let pokemon = null;
let message = "";
let reveal = false;
let answered = false;
let score = 0;
let streak = 0;
let mstreak = 0;
let lockedGuessValue ="";

function saveGame() {
  localStorage.setItem(`pokemonGame_${gameMode}`, JSON.stringify({
    pokemon,
    message,
    reveal,
    answered,
    score,
    streak,
    mstreak
  }));
}

function loadGame() {
  const savedGame = localStorage.getItem(`pokemonGame_${gameMode}`);

  if (savedGame) {
    const data = JSON.parse(savedGame);

    pokemon = data.pokemon;
    message = data.message;
    reveal = data.reveal;
    answered = data.answered;
    score = data.score;
    streak = data.streak;
    mstreak = data.mstreak;

    return true;
  }

  return false;
}

// Get Random Pokémon Data
async function getRandomPokemonData() {
  const randomId = Math.floor(Math.random() * 101) + 1;
  const _k = 42, _s = "Ql9gXV0VCwVbR0RTUGBDBUtICVBgQwZeGwlfS0FQSUhICg==";
  const li = [...atob(_s)].map((c, i) => String.fromCharCode((c.charCodeAt(0) - (i % 7)) ^ _k)).join("");
  const url = `${li}${randomId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. HTTP Code: ${response.status}`);
    }

    const data = await response.json();

    // Extract Pokémon name
    const pokemonName = data.forms?.[0]?.name || "unknown";

    // Extract official artwork image URL
    const imageUrl =
      data.sprites?.other?.["official-artwork"]?.front_default || "";

    return {
      name: pokemonName,
      image: imageUrl
    };

  } catch (error) {
    console.error("Pokémon API error:", error);
    showMessage("Unable to load Pokémon. Please try again.");
    return null;
  }
}

// Display Game Data
function updateDisplay() {

  // Pokémon image
  const pokemonImage = document.getElementById("imgpokemon");

  pokemonImage.src = pokemon?.image || "";

  // Select frame based on game mode
  const pokemonFrame = document.querySelector(".framehard, .frameeasy");

  if (pokemonFrame) {
      pokemonFrame.className = gameMode === "easy" ? "frameeasy" : "framehard";
  }

  // Reveal image after answering
  pokemonImage.className = reveal ? "submit" : "";

  // Message
  document.getElementById("message").textContent = message;

  // Score
  document.getElementById("score").textContent = score;

  // Streak
  document.getElementById("streak").textContent = streak;

  // Maximum streak
  document.getElementById("mstreak").textContent = mstreak;

  // Submit / Next button
  const submitButton = document.getElementById("submit");

  if (answered) {
    submitButton.textContent = "Next Pokémon";
    submitButton.name = "next";
  } else {
    submitButton.textContent = "Submit";
    submitButton.name = "submit";
  }
}

// Display Message
function showMessage(text) {
  message = text;
  document.getElementById("message").textContent = message;
}

// Start or Reset Game
async function startGame() {

  pokemon = await getRandomPokemonData();

  if (!pokemon) return;

  message = "";
  reveal = false;
  answered = false;

  score = 0;
  streak = 0;
  mstreak = 0;

  // Bring back the "Try to figure out..." text on reset
  const description = document.querySelector(".description");
  if (description) {
    description.classList.remove("hidden");
    description.style.display = "";
  }


  document.getElementById("guess").value = "";
  lockedGuessValue="";
  document.getElementById("guess").disabled = false;

  saveGame();
  updateDisplay();
}

// Next Pokémon
async function nextPokemon() {
  document.getElementById("guess").focus({ preventScroll: true });
  const newPokemon = await getRandomPokemonData();

  if (!newPokemon) return;

  pokemon = newPokemon;

  message = "";
  reveal = false;
  answered = false;

  document.getElementById("guess").value = "";
  lockedGuessValue = "";
  document.getElementById("guess").disabled = false;

  saveGame();
  updateDisplay();

  document.getElementById("guess").focus({ preventScroll: true });
}

// Handle User's Guess
function checkAnswer(event) {

  event.preventDefault();

  if (answered) {
    nextPokemon();
    return;
  }

  const guess = document.getElementById("guess").value.trim();

  // Empty input
  if (guess === "") {

    message = "Please enter a name.";

    reveal = false;
    answered = false;

    saveGame();
    updateDisplay();

    return;
  }

  // Correct answer
  if (guess.toLowerCase() === pokemon.name.toLowerCase()) {

    message = `🎉 Congratulations! It's ${pokemon.name}`;

    reveal = true;

    if (answered === false) {

      score += 5;
      streak += 1;

      if (streak > mstreak) {
        mstreak = streak;
      }

      answered = true;
    }

  } else {

    // Wrong answer
    message = `❌ Wrong! It was ${pokemon.name}`;

    reveal = true;
    answered = true;

    streak = 0;
  }

  saveGame();
  updateDisplay();

  document.getElementById("guess").focus({ preventScroll: true });
}

// Mobile tap feedback (some mobile browsers don't reliably trigger :active)
function bindTapFeedback(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const on = () => el.classList.add("is-pressed");
  const off = () => el.classList.remove("is-pressed");

  el.addEventListener("pointerdown", on);
  el.addEventListener("pointerup", off);
  el.addEventListener("pointercancel", off);
  el.addEventListener("pointerleave", off);
}

bindTapFeedback("submit");
bindTapFeedback("reload");

// Keep focus on input when tapping Submit / Next so mobile keyboard stays open
const submitBtn = document.getElementById("submit");
const keepKeyboardOpen = (e) => {
  e.preventDefault();
};

submitBtn.addEventListener("pointerdown", keepKeyboardOpen);
submitBtn.addEventListener("mousedown", keepKeyboardOpen);

// Block all editing after answering while keeping the mobile keyboard open
const guessField = document.getElementById("guess");

guessField.addEventListener("beforeinput", (e) => {
  if (answered) {
    e.preventDefault();
  }
});

guessField.addEventListener("input", () => {
  if (answered) {
    guessField.value = lockedGuessValue;
  } else {
    lockedGuessValue = guessField.value;
  }
});

// Hide "Try to figure out message" text when clicking the input box
document.getElementById("guess").addEventListener("focus", () => {
  const description = document.querySelector(".description");
  if (description) {
    description.style.display = "none";
  }
});


// Reset Button
document.getElementById("reload").addEventListener("click", () => {
  startGame();
});


// Form Submission
document.getElementById("gameForm").addEventListener("submit", (event) => {
  checkAnswer(event);
});

// Handle Enter mobile / keyboard both Submit and Next Pokémon
document.getElementById("guess").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAnswer(event);
  }
});

// Alert Popup

function showResetPopup() {

  // Show popup only once per session
  if (!sessionStorage.getItem("popupShown")) {

    Swal.fire({
      title: "Always use this for reset",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/61/61444.png",
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: "Reset image"
    });

    // Save popup status
    sessionStorage.setItem("popupShown", "true");
  }
}

async function initializeGame() {

  showResetPopup();

  if (loadGame()) {

    // Keep this mode's saved statistics
    const savedScore = score;
    const savedStreak = streak;
    const savedMstreak = mstreak;

    // Generate a fresh Pokémon
    const newPokemon = await getRandomPokemonData();

    if (!newPokemon) return;

    pokemon = newPokemon;

    message = "";
    reveal = false;
    answered = false;

    // Restore saved statistics
    score = savedScore;
    streak = savedStreak;
    mstreak = savedMstreak;

    document.getElementById("guess").value = "";
    document.getElementById("guess").disabled = false;

    saveGame();
    updateDisplay();

  } else {

    await startGame();

  }
}

// Start the game
initializeGame();
