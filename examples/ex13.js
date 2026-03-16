const skeletonEle = document.getElementById("movie-skeleton");
const moviecardEle = document.getElementById("movie-card");
const BASE_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWY5ODc2MzYxNzRiZmM0NmE0ODBkYzFiZDkyNDk3MSIsIm5iZiI6MTc3MTQ4MzQ2MC43MjgsInN1YiI6IjY5OTZiMTQ0YmVhNDIxMTE3MWM4NTI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.krvlWi7oG3S0WNue_NvR21W4WGJ4vMYkzai7B_xfRwc";

let next_page = 1;
async function getMovie(page) {
  const skeletone = loadSkeletone();
  if (skeletone) {
    skeletonEle.appendChild(skeletone);
  }

  try {
    const url = BASE_URL + `discover/movie?page=${page}`;
    const header = {};
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + API_KEY,
      },
    });

    const data = await res.json();

    if (data?.results.length !== 0) {
      next_page = page + 1;
      data?.results.forEach((el) => {
        appendData(
          el.id,
          IMG_URL + el.poster_path,
          el.title,
          el.overview,
          el.release_date,
        );
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    skeletonEle.innerHTML = "";
  }
}

getMovie(next_page);

function appendData(movieID, img, title, overview, release_date) {
  const ele = document.createElement("div");
  ele.setAttribute("onclick", `getMovieDetails(${movieID})`);
  ele.classList =
    "max-w-sm rounded overflow-hidden shadow-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/50  hover:scale-105 duration-500";

  ele.innerHTML = `
              <img class="w-full" src=${img} alt=${title}/>
              <div class="px-6 py-4">
                <span class="w-full inline-block bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Release Date : ${release_date}</span>
                <div class="hopver:text-blue-600 font-bold text-xl mb-2">${title}</div>
                <p class="text-gray-700 text-base line-clamp-4">${overview}</p>
              </div>`;

  moviecardEle.appendChild(ele);
}

//Load more movie data
function handleNextPage() {
  getMovie(next_page);
}

async function getMovieDetails(movieID) {
  if (!movieID) {
    return;
  } else {
    window.location.href = `movie-details.html?movieID=${movieID}`;
  }
}

function loadSkeletone() {
  skeletonEle.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const card = document.createElement("div");
    card.className = "space-y-2 animate-pulse";

    card.innerHTML = `
      <div class="h-96 bg-slate-200 rounded"></div>
      <div class="h-6 bg-slate-200 rounded"></div>
      <div class="h-6 w-24 bg-slate-200 rounded"></div>
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="h-2 bg-slate-200 rounded"></div>
    `;

    skeletonEle.appendChild(card);
  }
}
