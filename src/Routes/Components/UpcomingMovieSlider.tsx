import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import { getTopRatedMovies, getUpcomingtMovies, IGetMovieResult } from "../api";
import { boxVariants, infoVariants, rowVariants } from "../Home";

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 650px;
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
  top: 600px;
`;

const offset = 6;

function UpcomingMovieSlider() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], getUpcomingtMovies);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increadeUpcomingIndex = () => {
    if (upcomingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upcomingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const { scrollY } = useViewportScroll();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    upcomingData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  console.log(bigMovieMatch, clickedMovie);
  return (
    <>
      <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
        <SlideTitle>Upcoming</SlideTitle>
        <Row
          key={upcomingIndex}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
        >
          {upcomingData?.results
            .slice(1)
            .slice(offset * upcomingIndex, offset * upcomingIndex + offset)
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
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
          <NextBtn onClick={increadeUpcomingIndex}>〉</NextBtn>
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
              layoutId={bigMovieMatch.params.movieId}
              style={{ top: scrollY.get() - 700 }}
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
                  <BigTitle>{clickedMovie.title}</BigTitle>
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

export default UpcomingMovieSlider;
