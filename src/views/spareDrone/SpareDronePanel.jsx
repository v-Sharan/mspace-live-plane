import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

const SpareDronePanel = () => {
  const iframeRef = useRef(null);

  return (
    <>
      {/* <ReactPlayer
        url='http://192.168.6.215:8000/video_feed'
        controls
        width='640'
        height='360'
      /> */}
      {/* <img
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
        src='http://192.168.6.215:8000/video_feed'
      /> */}
      {/* <iframe src='https://www.youtube.com/embed/cWDJoK8zw58'></iframe> */}
      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
        src='http://192.168.6.215:8000/video_feed'
        typeof='multipart/x-mixed-replace; boundary=frame'
        // frameborder='0'
        ref={iframeRef}
        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerpolicy='strict-origin-when-cross-origin'
        loading='lazy'
      />
    </>
  );
};

export default SpareDronePanel;
