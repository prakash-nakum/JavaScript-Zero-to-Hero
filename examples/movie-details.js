const BASE_URL = "https://api.themoviedb.org{movie_id}?api_key={YOUR_API_KEY}";
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWY5ODc2MzYxNzRiZmM0NmE0ODBkYzFiZDkyNDk3MSIsIm5iZiI6MTc3MTQ4MzQ2MC43MjgsInN1YiI6IjY5OTZiMTQ0YmVhNDIxMTE3MWM4NTI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.krvlWi7oG3S0WNue_NvR21W4WGJ4vMYkzai7B_xfRwc";

const movieImg = document.getElementById("movie-img");
const movieTitle = document.getElementById("movie-title");
const movieYear = document.getElementById("movie-year");
const release_date = document.getElementById("release_date");
const genres = document.getElementById("genres");
const tagline = document.getElementById("tagline");
const overview = document.getElementById("overview");
const skeleton = document.getElementById("skeleton");

const runtime = document.getElementById("runtime");
const vote_average = document.getElementById("vote_average");
const vote_count = document.getElementById("vote_count");
const adult = document.getElementById("adult");

const content = document.getElementById("content");

async function movieDetails() {
  const params = new URLSearchParams(window.location.search);
  const movieID = params.get("movieID");
  skeleton.classList.remove("hidden");
  content.classList.add("hidden");

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + API_KEY,
      },
    });

    const result = await res.json();

    if (!result || !result.id) {
      throw new Error("Movie not found");
    }

    let genrestext = "";
    result.genres.forEach((el, index) => {
      genrestext += el.name;
      if (index < result.genres.length - 1) {
        genrestext += ", ";
      }
    });
    genres.innerText = genrestext;
    content.style.backgroundImage = `url('${IMG_URL + result.backdrop_path}')`;
    movieImg.src = IMG_URL + result.poster_path;
    movieTitle.innerText = result.title;
    movieYear.innerText = result.status;
    release_date.innerText = result.release_date;
    tagline.innerText = result.tagline || "";
    overview.innerText = result.overview || "";
    runtime.innerText = result.runtime + "m";
    vote_average.innerText = result.vote_average
      ? result.vote_average.toFixed(1)
      : "0";
    vote_count.innerText = result.vote_count || 0;
    adult.innerText = result.adult ? "Yes" : "No";

    skeleton.classList.add("hidden");
    content.classList.remove("hidden");
  } catch (error) {
    console.error(error);

    skeleton.classList.add("hidden");

    content.innerHTML = `
      <div class="flex flex-col justify-center items-center text-white">
        <h2 class="text-3xl text-red-600 font-bold mb-4">Movie Not Found</h2>
        <button onclick="goBack()" 
          class="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition">
          Back to Movies
        </button>
      </div>
    `;
    content.classList.remove("hidden");
  }
}

movieDetails();

function goBack() {
  window.history.back();
}
