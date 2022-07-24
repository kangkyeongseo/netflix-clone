const API_KEY = "ab3b7b6adccc829a13ae5fa8eb9db2aa";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  video: false;
}

interface ITv {
  adult: boolean;
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  name: string;
  video: false;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
}

export async function getTopRatedMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`)
  ).json();
}

export async function getUpcomingtMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`)
  ).json();
}

export async function getNowVideos() {
  return await (
    await fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`)
  ).json();
}

export async function getTopRatedVideos() {
  return await (
    await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`)
  ).json();
}

export async function getUpcomingtVideos() {
  return await (
    await fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`)
  ).json();
}

export async function getSearchMovies(keyword: string) {
  return await (
    await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
  ).json();
}

export async function getSearchTv(keyword: string) {
  return await (
    await fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`)
  ).json();
}
