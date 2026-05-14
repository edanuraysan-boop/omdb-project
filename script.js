const apiKey = "1a975f8d";

const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const movieResult = document.getElementById("movieResult");
const message = document.getElementById("message");

const popularMoviesContainer = document.getElementById("popularMovies");
const genreMoviesContainer = document.getElementById("genreMovies");
const searchHistoryContainer = document.getElementById("searchHistory");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const popularMovies = [
  "Inception",
  "Interstellar",
  "The Dark Knight",
  "The Hunger Games",
  "Avatar",
  "Titanic",
  "Harry Potter",
  "The Matrix",
  "Oppenheimer",
  "Dune"
];

const genres = {
  action: ["John Wick", "Mad Max: Fury Road", "Gladiator", "The Dark Knight"],
  scifi: ["Interstellar", "Dune", "Arrival", "The Matrix"],
  fantasy: ["Harry Potter", "The Lord of the Rings", "The Hobbit", "Pirates of the Caribbean"],
  animation: ["Frozen", "Toy Story", "Coco", "Inside Out"]
};

window.addEventListener("load", () => {
  const savedMovie = localStorage.getItem("lastMovie");

  if (savedMovie) {
    movieInput.value = savedMovie;
    fetchMovie(savedMovie);
  }

  showPopularMovies();
  showSearchHistory();
});

searchBtn.addEventListener("click", () => {
  const movieName = movieInput.value.trim();

  if (movieName === "") {
    message.textContent = "Please enter a movie name.";
    movieResult.style.display = "none";
    return;
  }

  localStorage.setItem("lastMovie", movieName);
  saveSearchHistory(movieName);
  fetchMovie(movieName);
});

movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function fetchMovie(movieName) {
  try {
    message.textContent = "";

    const response = await fetch(
      `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      message.textContent = "Movie not found.";
      movieResult.style.display = "none";
      return;
    }

    displayMovie(data);
  } catch (error) {
    message.textContent = "Something went wrong.";
  }
}

function displayMovie(movie) {
  movieResult.style.display = "block";

  movieResult.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}">
    
    <div class="movie-info">
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
    </div>
  `;
}

async function showPopularMovies() {
  popularMoviesContainer.innerHTML = "";

  for (const movieTitle of popularMovies) {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`
    );

    const movie = await response.json();

    if (movie.Response === "True") {
      const posterCard = createPosterCard(movie);
      popularMoviesContainer.appendChild(posterCard);
    }
  }
}

async function showGenre(genreName) {
  genreMoviesContainer.innerHTML = "";

  for (const movieTitle of genres[genreName]) {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`
    );

    const movie = await response.json();

    if (movie.Response === "True") {
      const posterCard = createPosterCard(movie);
      genreMoviesContainer.appendChild(posterCard);
    }
  }
}

function createPosterCard(movie) {
  const posterCard = document.createElement("div");
  posterCard.classList.add("poster-card");

  posterCard.innerHTML = `
    <span class="rating-badge">⭐ ${movie.imdbRating}</span>
    <img src="${movie.Poster}" alt="${movie.Title}">
    <p>${movie.Title}</p>
  `;

  posterCard.addEventListener("click", () => {
    movieInput.value = movie.Title;
    localStorage.setItem("lastMovie", movie.Title);
    saveSearchHistory(movie.Title);
    fetchMovie(movie.Title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return posterCard;
}

function saveSearchHistory(movieName) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history = history.filter(
    item => item.toLowerCase() !== movieName.toLowerCase()
  );

  history.unshift(movieName);
  history = history.slice(0, 5);

  localStorage.setItem("searchHistory", JSON.stringify(history));
  showSearchHistory();
}

function showSearchHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  searchHistoryContainer.innerHTML = "";

  history.forEach(movieName => {
    const button = document.createElement("button");
    button.textContent = movieName;

    button.addEventListener("click", () => {
      movieInput.value = movieName;
      localStorage.setItem("lastMovie", movieName);
      fetchMovie(movieName);
    });

    searchHistoryContainer.appendChild(button);
  });
}

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("searchHistory");
  localStorage.removeItem("lastMovie");
  searchHistoryContainer.innerHTML = "";
  movieInput.value = "";
  movieResult.style.display = "none";
});