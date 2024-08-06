import React, { useEffect, useRef, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import './index.css';
import messageHub from '~/message-hub';
import store from '~/store';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';
import { Joystick } from 'react-joystick-component';
import LongPressButton from '~/components/button/LongPressButton';

const { dispatch } = store;

const video = [
  {
    id: 1,
    name: 'Camera 1',
    url: 'http://192.168.1.101:8000/video_1',
    ip: '192.168.6.122',
  },
  {
    id: 2,
    name: 'Camera 2',
    url: 'http://192.168.1.101:8000/video_2',
    ip: '192.168.6.126',
  },
  {
    id: 3,
    name: 'Camera 3',
    url: 'http://192.168.1.101:8000/video_3',
    ip: '192.168.6.128',
  },
  {
    id: 4,
    name: 'Camera 4',
    url: 'http://192.168.1.101:8000/video_4',
    ip: '192.168.6.129',
  },
  {
    id: 5,
    name: 'Camera 5',
    url: 'http://192.168.1.101:8000/video_5',
    ip: '192.168.6.130',
  },
  {
    id: 6,
    name: 'Camera 6',
    url: 'http://192.168.1.101:8000/video_6',
    ip: '192.168.6.133',
  },
  {
    id: 7,
    name: 'Camera 7',
    url: 'http://192.168.1.101:8000/video_7',
    ip: '192.168.6.134',
  },
  {
    id: 8,
    name: 'Camera 8',
    url: 'http://192.168.1.101:8000/video_8',
    ip: '192.168.6.135',
  },
  {
    id: 9,
    name: 'All Camera',
    url: 'http://192.168.1.101:8000/video_8',
    ip: 'All Camera',
  },
];

function getUrlByIp(ip) {
  const foundObject = video.find((item) => item.ip === ip);
  return foundObject ? foundObject : 'Not found';
}

const SpareDronePanel = () => {
  const [camId, setCamId] = useState(video[0].id);
  const [camUrl, setCamUrl] = useState(video[0].url);
  const [allCamera, setAllCamera] = useState(false);
  const [allCamUrl, setAllCamUrl] = useState([]);
  const [gimbal, setGimbal] = useState(video[0].ip);
  const [tracking, setTracking] = useState(false);

  // const joystickRef = useRef();

  const onCameraChange = async ({ target }) => {
    const { id, url } = getUrlByIp(target.value);
    if (id == 9) {
      setAllCamera(true);
      setCamId(id);
      setGimbal(target.value);
      try {
        const res = await fetch(url);
        const data = await res.json();
        setAllCamUrl(data?.result);
      } catch (e) {
        console.log(e);
        dispatch(
          showNotification({
            message: `Something went wrong`,
            semantics: MessageSemantics.ERROR,
          })
        );
      } finally {
        return;
      }
    }

    setAllCamera(false);
    setCamId(id);
    setCamUrl(url);
    setGimbal(target.value);
  };

  const onButtonPress = async (msg) => {
    if (allCamera) return;
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        message: msg,
        ip: gimbal,
      });

      if (!Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `${msg} Message Failed`,
            semantics: MessageSemantics.ERROR,
          })
        );
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `${e} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  // const sourceRadioButtons = video.map((source) => (
  //   <FormControlLabel
  //     key={source.name}
  //     value={source.url}
  //     label={source.ip}
  //     style={{ marginTop: 5 }}
  //     control={<Radio checked={camId === source.id} />}
  //     onChange={onCameraChange.bind(this, source.id, source.url, source.ip)}
  //   />
  // ));

  const handleDoubleClick = async (event) => {
    if (tracking) {
      dispatch(
        showNotification({
          message: `Tracking is already enabled`,
          semantics: MessageSemantics.INFO,
        })
      );
      return;
    }
    const rect = event.target.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // setCoordinates({ x, y });
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        x: parseInt(x),
        y: parseInt(y),
        ip: gimbal,
        message: 'track',
      });

      if (!Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `Tracking Message Failed`,
            semantics: MessageSemantics.ERROR,
          })
        );
      } else {
        setTracking(true);
        dispatch(
          showNotification({
            message: `Tracking Started`,
            semantics: MessageSemantics.SUCCESS,
          })
        );
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `${e} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  const imageStyle = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '5px',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
<<<<<<< HEAD
    <div>
      <div style={{ backgroundColor: 'red', alignSelf: 'center' }}>
        <FormControl>
          <InputLabel id='demo-simple-select-label'>Age</InputLabel>
          <Select
            id='demo-simple-select-label'
            onChange={onCameraChange}
            value={gimbal}
          >
            {video.map(({ id, ip, name, url }) => (
              <MenuItem value={ip} name={url}>
                {ip}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'zoom_in')}
          onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
        >
          Zoom in
        </LongPressButton>
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'zoom_out')}
          onLongPressEnd={onButtonPress.bind(this, 'zoom_stop')}
        >
          Zoom out
        </LongPressButton>
        <Button
          disabled={!tracking}
          onClick={() => {
            setTracking(false);
          }}
        >
          Stop Recording
        </Button>
        <div className='data'>
          <div class='gamepad'>
            <div class='row'>
              <div className='button'></div>
              <LongPressButton
                onLongPress={onButtonPress.bind(this, 'up')}
                onLongPressEnd={onButtonPress.bind(this, 'stop')}
              >
                Up
              </LongPressButton>
              <div className='button'></div>
            </div>
            <div class='row'>
              <LongPressButton
                onLongPress={onButtonPress.bind(this, 'left')}
                onLongPressEnd={onButtonPress.bind(this, 'stop')}
              >
                Left
              </LongPressButton>
              <Button onClick={onButtonPress.bind(this, 'home')}>HOME</Button>
              <LongPressButton
                onLongPress={onButtonPress.bind(this, 'right')}
                onLongPressEnd={onButtonPress.bind(this, 'stop')}
              >
                RIGHT
              </LongPressButton>
            </div>
            <div class='row'>
              <div className='button'></div>
              <LongPressButton
                onLongPress={onButtonPress.bind(this, 'down')}
                onLongPressEnd={onButtonPress.bind(this, 'stop')}
              >
                Down
              </LongPressButton>
              <div className='button'></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{}}>
        {allCamera ? (
          allCamUrl.length != 0 &&
          allCamUrl.map((url, i) => <img id={i} style={imageStyle} src={url} />)
        ) : (
          <img
            style={{
              width: '1280px',
              height: '720px',
            }}
            onDoubleClick={handleDoubleClick}
            src={camUrl}
          />
        )}
      </div>
    </div>
=======
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
      {/* <iframe
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
      /> */}
    </>
>>>>>>> 563adb982eda2c76be127b99f804d30d596f64fe
  );
};

export default SpareDronePanel;
