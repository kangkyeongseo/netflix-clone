import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  getSearchMovies,
  getSearchTv,
  IGetMovieResult,
  IGetTvResult,
} from "./api";
import MovieSearch from "./Components/MovieSearch";
import TvSearch from "./Components/TvSearch";

const Wrapper = styled.div`
  position: relative;
  margin: 0px 60px;
`;

const Loading = styled.span``;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMovieResult>(["movies", "search"], () =>
      getSearchMovies(keyword as any)
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["tv", "search"],
    () => getSearchTv(keyword as any)
  );
  console.log(movieData);
  const loading = movieLoading || tvLoading;
  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Wrapper>
          <MovieSearch keyword={keyword as any} />
          <TvSearch keyword={keyword as any} />
        </Wrapper>
      )}
    </>
  );
}

export default Search;
