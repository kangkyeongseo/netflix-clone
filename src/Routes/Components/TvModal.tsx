import { motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import { getMoviesDetail, getTvDetail, IMovie } from "../api";

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 100;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const BigWrap = styled.div`
  padding: 20px;
  position: relative;
  top: -120px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 24px;
  margin-bottom: 15px;
`;

const BigBtn = styled.div``;

const PlayBtn = styled(motion.div)`
  color: ${(props) => props.theme.black.veryDark};
  background-color: ${(props) => props.theme.white.lighter};
  width: 150px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 35px;
`;

const BigInfo = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
`;

const Genres = styled.ul`
  display: flex;
  margin-bottom: 15px;
`;

const Genre = styled.li`
  margin-right: 10px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  width: 80%;
`;

function TvModal({ bigMovieMatch, clickedMovie, locate }: any) {
  const { scrollY } = useViewportScroll();
  const {
    params: { tvId },
  } = bigMovieMatch;
  const { data, isLoading } = useQuery<IMovie>(["tv", "detail"], () =>
    getTvDetail(tvId)
  );
  console.log(data);
  return (
    <BigMovie
      layoutId={bigMovieMatch.params.movieId}
      style={{ top: scrollY.get() + locate }}
    >
      {clickedMovie && (
        <>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(to top,  black, transparent), url(${makeImagePath(
                clickedMovie.backdrop_path,
                "w500"
              )})`,
            }}
          />
          <BigWrap>
            <BigTitle>{clickedMovie.name}</BigTitle>
            <BigBtn>
              <PlayBtn
                whileHover={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                ▶︎ Play
              </PlayBtn>
            </BigBtn>
            <BigInfo>
              {data?.release_date.slice(0, 4)} / {data?.runtime}min
            </BigInfo>
            <Genres>
              {data?.genres?.map((genre) => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
            </Genres>
            <BigOverview>{clickedMovie.overview}</BigOverview>
          </BigWrap>
        </>
      )}
    </BigMovie>
  );
}

export default TvModal;
