import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import { getSearchTv, getTopRatedVideos, IGetTvResult } from "../api";
import { boxVariants, infoVariants, rowVariants } from "../Home";

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 550px;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 180px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const NextBtn = styled.span`
  position: absolute;
  right: -40px;
  top: 65px;
  font-size: 42px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

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
  z-index: 100;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
  padding: 20px;
  font-size: 24px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

const SlideTitle = styled.h3`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  position: absolute;
  top: 500px;
`;

const offset = 6;

interface IProp {
  keyword: string;
}

function TvSearch({ keyword }: IProp) {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/search/tv/:tvId");
  const { data, isLoading } = useQuery<IGetTvResult>(["video", "search"], () =>
    getSearchTv(keyword)
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increadeTopIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const { scrollY } = useViewportScroll();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/search/tv/${tvId}`);
  };
  const onOverlayClick = () => navigate("/search");
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    data?.results.find((tv) => tv.id + "" === bigMovieMatch.params.tvId);
  console.log(bigMovieMatch, clickedMovie);
  return (
    <>
      <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
        <SlideTitle>Tv</SlideTitle>
        <Row
          key={index}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                onClick={() => onBoxClicked(movie.id)}
                layoutId={movie.id + ""}
                key={movie.id}
                variants={boxVariants}
                whileHover="hover"
                initial="noremal"
                transition={{ type: "tween" }}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.name}</h4>
                </Info>
              </Box>
            ))}
          <NextBtn onClick={increadeTopIndex}>〉</NextBtn>
        </Row>
      </AnimatePresence>
      <AnimatePresence>
        {clickedMovie ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigMovieMatch.params.tvId}
              style={{ top: scrollY.get() + 100 }}
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
                  <BigTitle>{clickedMovie.name}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TvSearch;
