import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { ReactMic } from "react-mic";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
function App() {
  //States
  const [title, setTitle] = useState("Start");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [record, setRecord] = useState(false);
  const [track, setTrack] = useState();
  const [data, setData] = useState();
  //References
  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  // Function to Format the Time
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  //Funtion to Handle Play / Pause
  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      setTitle("Recorded Playing");
      animationRef.current = setInterval(whilePlaying, 1000);
    } else {
      audioPlayer.current.pause();
      setTitle("Playing Stopped");
      clearInterval(animationRef.current);
    }
  };
  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}`
    );
    setCurrentTime(progressBar.current.value);
  };
  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
  };
  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };
  const handleMic = () => {
    setRecord(true);
    document.getElementById("mic").style.opacity = "0";
    document.getElementById("stop").style.opacity = "1";
    setTitle("Recording");
  };
  const onStop = (recordedBlob) => {
    setData(recordedBlob);
    setTrack(recordedBlob.blobURL);
    document.getElementById("a_r").style.opacity = "0";
    document.getElementById("a_p").style.opacity = "1";
    document.getElementById("stop").style.opacity = "0";
    setTitle("Recording Stopped");
  };
  const handleStop = () => {
    setRecord(false);
  };
  const handleBtn = () => {
    setTitle("Recording Sent");
    console.log("The Result is", data);
  };
  return (
    <div className="App">
      <div>
        <div className="recorder">
          <div className="recorder_up">
            <div className="recorder_duration">
              <p className="rec_title">{title}</p>
              <div>
                <p className="rec_dur1">{calculateTime(currentTime)}</p>{" "}
                <p className="rec_dur2">
                  / {duration && !isNaN(duration) && calculateTime(duration)}
                </p>
              </div>
            </div>
            <div className="rec_send">
              <div id="mic" className="mic_icon" onClick={handleMic}>
                <MicIcon />
              </div>
              <div id="stop" className="stop_btn" onClick={handleStop}>
                <StopIcon />
              </div>
              <button
                id="btn"
                className="send_btn"
                type="button"
                onClick={handleBtn}
              >
                Send
              </button>
            </div>
          </div>
          <div className="recorder_down">
            <div id="a_p" className="audio_player">
              <audio
                ref={audioPlayer}
                // Audio File for Testing Player Features ::: https://aac.saavncdn.com/264/eb5bf3908be1c26cfda000e615c647d6_320.mp4
                src={track}
                preload="metadata"
              />
              <div className="play_btn" onClick={togglePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </div>
              <div className="audio_seek">
                <input
                  type="range"
                  defaultValue="0"
                  ref={progressBar}
                  onChange={changeRange}
                />
              </div>
            </div>
            <div id="a_r" className="audio_recorder">
              <ReactMic
                record={record}
                className="sound-wave"
                visualSetting="sinewave"
                onStop={onStop}
                strokeColor="#9730ea"
                mimeType="audio/webm"
                backgroundColor="#061732"
              />
            </div>
          </div>
        </div>
      </div>
      <div id="triangle-down"></div>
    </div>
  );
}

export default App;
