import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  let captureTimeout: NodeJS.Timeout;

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const sendToBackend = async (imageData: string) => {
    const blob = dataURItoBlob(imageData);

    const formData = new FormData();
    formData.append('image', blob, 'photo.jpg');

    try {
      const response = await axios.post(
        'http://localhost:3001/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.log(error);
    }
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      await sendToBackend(imageSrc);
    }
    setImgSrc(imageSrc || null);

    setTimeout(() => {
      console.log('about to capture image...', new Date());
      capture();
    }, 5000);
  };

  useEffect(() => {
    capture();

    return () => {
      clearTimeout(captureTimeout);
    };
  }, []);

  return (
    <div className="App">
      <h1>webcam app</h1>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      {audioUrl && (
        <audio>
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default App;
