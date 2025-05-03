document.getElementById("lyrics-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const artist = document.getElementById("artist").value.trim();
  const song = document.getElementById("song").value.trim();
  const output = document.getElementById("lyrics-output");
  const youtubeFrame = document.getElementById("youtube-frame");
  const youtubeLink = document.getElementById("youtube-link");
  const saveBtn = document.getElementById("save-favorite");

  if (!artist || !song) return;

  output.textContent = "Loading lyrics...";
  youtubeFrame.innerHTML = "";
  saveBtn.classList.add("hidden");
  youtubeLink.classList.add("hidden");

  try {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
    const data = await res.json();

    if (data.lyrics) {
      output.textContent = data.lyrics;
      saveBtn.classList.remove("hidden");

      const query = encodeURIComponent(`${artist} ${song} official audio`);
      youtubeFrame.innerHTML = `
        <iframe width="100%" height="250" src="https://www.youtube.com/embed?listType=search&list=${query}" frameborder="0" allowfullscreen></iframe>
      `;

      youtubeLink.href = `https://www.youtube.com/results?search_query=${query}`;
      youtubeLink.classList.remove("hidden");

      saveBtn.onclick = () => saveFavorite(artist, song);
      saveHistory(artist, song);
    } else {
      output.textContent = "Lyrics not found.";
    }
  } catch (err) {
    output.textContent = "Error fetching lyrics.";
  }
});

function saveFavorite(artist, song) {
  const key = `${artist} - ${song}`;
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (!favs.includes(key)) {
    favs.push(key);
    localStorage.setItem("favorites", JSON.stringify(favs));
    loadFavorites();
  }
}

function loadFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const list = document.getElementById("favorites-list");
  list.innerHTML = "";
  favs.forEach(fav => {
    const li = document.createElement("li");
    li.textContent = fav;
    list.appendChild(li);
  });
}

function saveHistory(artist, song) {
  const key = `${artist} - ${song}`;
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.unshift(key);
  history = history.slice(0, 5);
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    list.appendChild(li);
  });
}

function clearFavorites() {
  localStorage.removeItem("favorites");
  loadFavorites();
}


function clearHistory() {
  localStorage.removeItem("history");
  loadHistory();
}

function changeTheme() {
  const themeIcon = document.getElementById("theme-icon");

  // Toggle body
  document.body.classList.toggle("bg-gray-100");
  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-black");
  document.body.classList.toggle("text-white");

  // Toggle container
  const container = document.getElementById("container");
  container.classList.toggle("bg-white");
  container.classList.toggle("bg-gray-800");

  // Inputs
  ["artist", "song"].forEach(id => {
    const input = document.getElementById(id);
    input.classList.toggle("bg-white");
    input.classList.toggle("bg-gray-700");
    input.classList.toggle("text-black");
    input.classList.toggle("text-white");
    input.classList.toggle("placeholder-gray-500");
    input.classList.toggle("placeholder-gray-300");
  });

  // Lyrics & lists
  document.getElementById("lyrics-output").classList.toggle("text-gray-800");
  document.getElementById("lyrics-output").classList.toggle("text-gray-200");
  document.getElementById("favorites-list").classList.toggle("text-black");
  document.getElementById("favorites-list").classList.toggle("text-white");
  document.getElementById("history-list").classList.toggle("text-black");
  document.getElementById("history-list").classList.toggle("text-white");

  // Footer
  document.getElementById("footer").classList.toggle("text-gray-600");
  document.getElementById("footer").classList.toggle("text-gray-300");

  // Theme icon
  themeIcon.textContent = themeIcon.textContent === "🌙" ? "☀️" : "🌙";
  document.getElementById("theme-label").textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";

}

loadFavorites();
loadHistory();
