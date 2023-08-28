import { useState, useRef, useEffect } from "react";
import "../VideoRecorder/VideoRecorder.css";

const mimeType = "video/webm";

const VideoRecorder = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const liveVideoFeed1 = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [localstoragefill, setlocalstoragefill] = useState(false);

  useEffect(() => {
    return () => {
      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo);
        localStorage.removeItem("recordedVideo");
      }
    }
  }, [recordedVideo]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          video: {
            width: { min: 150 },
            height: { min: 150 },
          },
          audio: false,
        };
        const screenConstraints = {
          video: {
            width: { max: 600 },
            height: { max: 1200 },
          },
          audio: true,
        };
        const audioConstraints = { audio: true };

        const screenStream = await navigator.mediaDevices.getDisplayMedia(
          screenConstraints
        );

        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        let combinedStream = new MediaStream([...screenStream.getTracks()]);

        try {
          const audioStream = await navigator.mediaDevices.getUserMedia(
            audioConstraints
          );

          combinedStream.addTrack(audioStream.getAudioTracks()[0]);
        } catch (audioError) {
          // If audio permission is denied, use only video stream
          // combinedStream = videoStream;
        }

        setPermission(true);
        setStream(combinedStream);
        liveVideoFeed1.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setPermission(false);
    setRecordingStatus("inactive");

    stream.getTracks().forEach((track) => track.stop());

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
      if (videoBlob.size >= 5 * 1024 * 1024) setlocalstoragefill(true);
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
  
    };
  };
  const handleLocalStorage = () => {
    if (recordedVideo && !localstoragefill) {
      localStorage.setItem("recordedVideo", recordedVideo);
    }
    alert("Video uploaded")
  };

  return (
    <div className="main-control">
      <h2>Video Recorder</h2>
      <main>
        <div className="video-controls">
          {!permission ? (
            <button onClick={getCameraPermission} type="button">
              Get Permissions
            </button>
          ) : null}

          {permission && recordingStatus === "inactive" ? (
            <button
              onClick={startRecording}
              type="button"
              style={{ backgroundColor: "#5cb85c" }}
            >
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              onClick={stopRecording}
              type="button"
              style={{ backgroundColor: "#d9534f" }}
            >
              Stop Recording
            </button>
          ) : null}
        </div>
       
        <div className="video-screens">
          <div className="video-live">
            {liveVideoFeed1 ? (
              <video ref={liveVideoFeed1} autoPlay muted></video>
            ) : (
              <h1>Live Feed</h1>
            )}
          </div>

          <div className="video-player">
            {recordedVideo ? (
              <>
                <video src={recordedVideo} controls></video>
              </>
            ) : (
              <h1>Recorder Video</h1>
            )}
          </div>
        </div>
        {recordedVideo && (
          <div className="download">
            <a download href={recordedVideo}>
              Download Video
            </a>
            <button onClick={handleLocalStorage}>
              Local Storage (Website)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
export default VideoRecorder;
