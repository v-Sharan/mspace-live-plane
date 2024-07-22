import React, { useEffect, useRef, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import './index.css';
import messageHub from '~/message-hub';
import store from '~/store';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';

const { dispatch } = store;

const video = [
  {
    id: 1,
    name: 'Camera 1',
    url: 'http://192.168.6.21:8000/video_1',
    ip: '192.168.6.131',
  },
  {
    id: 2,
    name: 'Camera 2',
    url: 'http://192.168.6.21:8000/video_2',
    ip: '192.168.6.161',
  },
  { id: 3, name: 'All Camera', url: 'http://192.168.6.21:8000/all_camera' },
];

const SpareDronePanel = () => {
  const [camId, setCamId] = useState(video[0].id);
  const [camUrl, setCamUrl] = useState(video[0].url);
  const [allCamera, setAllCamera] = useState(false);
  const [allCamUrl, setAllCamUrl] = useState([]);
  const [gimbal, setGimbal] = useState('');

  // const [camSelected, setCamSelected] = useState('');

  // useEffect(() => {
  //   dispatch(
  //     showNotification({
  //       message: `${camUrl} Message sent`,
  //       semantics: MessageSemantics.SUCCESS,
  //     })
  //   );
  // }, [camUrl]);

  const onCameraChange = async (id, url, ip) => {
    if (id == 3) {
      setAllCamera(true);
      setCamId(id);
      try {
        const res = await fetch(url);
        const data = await res.json();
        setAllCamUrl(data?.result);
        return;
      } catch (e) {
        console.log(e);
        dispatch(
          showNotification({
            message: `Something went wrong`,
            semantics: MessageSemantics.ERROR,
          })
        );
      }
    }
    setAllCamera(false);
    setCamId(id);
    setCamUrl(url);
    setGimbal(ip);
  };

  const onButtonPress = async (msg) => {
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        message: msg,
        ip: gimbal,
      });

      if (Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `${msg} Message sent`,
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

  const sourceRadioButtons = video.map((source) => (
    <FormControlLabel
      key={source.name}
      value={source.url}
      label={source.name}
      style={{ marginTop: 5 }}
      control={<Radio checked={camId === source.id} />}
      onChange={onCameraChange.bind(this, source.id, source.url, source.ip)}
    />
  ));

  return (
    <div>
      {allCamera ? (
        camId == 3 &&
        allCamUrl?.length != 0 && (
          <div className='allcamera'>
            {allCamUrl?.map(({ url, ip }) => (
              <img
                style={{
                  // position: 'absolute',
                  width: '50%',
                  height: '50%',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  dispatch(
                    showNotification({
                      message: `Gimabal ip set to ${ip}`,
                      semantics: MessageSemantics.SUCCESS,
                    })
                  );
                  setGimbal(ip);
                }}
                src={url}
              />
            ))}
          </div>
        )
      ) : (
        <img
          // ref={imgRef}
          style={{
            // position: 'absolute',
            width: '50%',
            height: '50%',
          }}
          src={camUrl}
        />
      )}
      <RadioGroup key='cameraPanel' name='source.camera'>
        {sourceRadioButtons}
      </RadioGroup>
      <h1>Gimbal Control</h1>
      <div className='joystick'>
        <button
          className='joystick-button up'
          onClick={() => onButtonPress('up')}
        >
          ↑
        </button>
        <div className='middle-row'>
          <button
            className='joystick-button left'
            onClick={() => onButtonPress('left')}
          >
            ←
          </button>
          <button
            className='joystick-button right'
            onClick={() => onButtonPress('right')}
          >
            →
          </button>
        </div>
        <button
          className='joystick-button down'
          onClick={() => onButtonPress('down')}
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default SpareDronePanel;
