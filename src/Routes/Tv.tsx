import styled from "styled-components";
import { useQuery } from "react-query";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getNowVideos, IGetMovieResult, IGetTvResult } from "./api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import TopMovieSlider from "./Components/TopMovieSlieder";
import UpcomingMovieSlider from "./Components/UpcomingMovieSlider";
import TopVideoSlider from "./Components/TopVideoSlider";
import UpcomingVideoSlider from "./Components/UpcomingVideoSlider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h1`
  font-size: 68px;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 22px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 0px 60px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
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

const NextBtn = styled.span`
  position: absolute;
  right: -40px;
  top: 65px;
  font-size: 42px;
`;

const SlideTitle = styled.h3`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function TV() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetTvResult>(
    ["video", "nowPlaying"],
    getNowVideos
  );
  console.log(nowData);
  const [nowIndex, setNowIndex] = useState(0);
  const increadeIndex = () => {
    if (nowData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    nowData?.results.find((tv) => tv.id + "" === bigMovieMatch.params.tvId);
  return (
    <Wrapper>
      {nowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].name}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
              <SlideTitle>Airing Today</SlideTitle>
              <Row
                key={nowIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {nowData?.results
                  .slice(1)
                  .slice(offset * nowIndex, offset * nowIndex + offset)
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
                <NextBtn onClick={increadeIndex}>〉</NextBtn>
              </Row>
              <TopVideoSlider />
              <UpcomingVideoSlider />
            </AnimatePresence>
          </Slider>
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
      )}
    </Wrapper>
  );
}

export default TV;
