const countryEle = document.getElementById("country-dropdown");
const statesEle = document.getElementById("states-dropdown");
const cityEle = document.getElementById("city-dropdown");
const BASE_URL = "../apis/country_state_city/";

//Fetch country data
async function getCountries() {
  const countries = await fetchData(BASE_URL + `get_all_countries.php`);
  if (countries?.data && countries?.data.length !== 0) {
    appendData(countries?.data, countryEle);
  }
}
getCountries();

//Get country, state and city data
async function fetchData(url) {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

async function handleState(e) {
  const country_id = e.value;
  getData(
    fetchData(BASE_URL + `get_state_by_countrie.php?country_id=${country_id}`),
    statesEle,
  );
}

async function handleCity(e) {
  const state_id = e.value;
  getData(
    fetchData(BASE_URL + `get_city_by_state.php?state_id=${state_id}`),
    cityEle,
  );
}

async function getData(fn, ele) {
  ele.innerHTML = "";
  try {
    const data = await fn;
    if (data.success && data?.data.length !== 0) {
      appendData(data?.data, ele);
    }
  } catch (error) {
    console.error(error);
  }
}

function updateData(id, name) {
  const option = document.createElement("option");
  option.setAttribute("value", id);
  option.innerText = name;
  return option;
}

function appendData(data, ele) {
  data.forEach((i) => {
    ele.appendChild(updateData(i.id, i.name));
  });
}
