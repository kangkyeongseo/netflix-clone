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

export async function getMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
}
