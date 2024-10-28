import React, { Fragment, useState } from 'react';
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import messageHub from '~/message-hub';
import store from '~/store';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';
import LongPressButton from '~/components/button/LongPressButton';
const video = [
  {
    id: 1,
    name: 'Camera 1',
    url: 'http://127.0.0.1:8000/video1',
    ip: '192.168.6.211',
  },
  {
    id: 2,
    name: 'Camera 2',
    url: 'http://127.0.0.1:8000/video2',
    ip: '192.168.6.212',
  },
  {
    id: 3,
    name: 'Camera 3',
    url: 'http://127.0.0.1:8000/video3',
    ip: '192.168.6.213',
  },
  {
    id: 4,
    name: 'Camera 4',
    url: 'http://127.0.0.1:8000/video4',
    ip: '192.168.6.214',
  },
  {
    id: 5,
    name: 'Camera 5',
    url: 'http://127.0.0.1:8000/video5',
    ip: '192.168.6.215',
  },
  {
    id: 6,
    name: 'Camera 6',
    url: 'http://127.0.0.1:8000/video6',
    ip: '192.168.6.216',
  },
  {
    id: 7,
    name: 'Camera 7',
    url: 'http://127.0.0.1:8000/video7',
    ip: '192.168.6.217',
  },
  {
    id: 8,
    name: 'Camera 8',
    url: 'http://127.0.0.1:8000/video8',
    ip: '192.168.6.218',
  },
  {
    id: 9,
    name: 'Camera 9',
    url: 'http://127.0.0.1:8000/video9',
    ip: '192.168.6.219',
  },
  {
    id: 10,
    name: 'Camera 10',
    url: 'http://127.0.0.1:8000/video10',
    ip: '192.168.6.130',
  },
  {
    id: 11,
    name: 'All Camera',
    ip: 'All Camera',
  },
];

const { dispatch } = store;

function getUrlByIp(ip) {
  const foundObject = video.find((item) => item.ip === ip);
  return foundObject ? foundObject : {};
}

const SpareDronePanel = () => {
  const [camUrl, setCamUrl] = useState(video[0].url);
  const [allCamera, setAllCamera] = useState(false);
  const [allCamUrl, setAllCamUrl] = useState([]);
  const [gimbal, setGimbal] = useState(video[0].ip);
  const [gimbalControl, setGimbalControl] = useState(video[0].ip);
  const [tracking, setTracking] = useState(false);
  const [record, setRecording] = useState(false);

  const onCameraChange = async ({ target }) => {
    const { id, url } = getUrlByIp(target.value);
    if (id === 11) {
      setCamUrl('');
      setAllCamera(true);
      setAllCamUrl([
        {
          id: 1,
          name: 'Camera 1',
          url: 'http://127.0.0.1:8000/video1',
          ip: '192.168.6.211',
        },
        {
          id: 2,
          name: 'Camera 2',
          url: 'http://127.0.0.1:8000/video2',
          ip: '192.168.6.212',
        },
        {
          id: 3,
          name: 'Camera 3',
          url: 'http://127.0.0.1:8000/video3',
          ip: '192.168.6.213',
        },
        {
          id: 4,
          name: 'Camera 4',
          url: 'http://127.0.0.1:8000/video4',
          ip: '192.168.6.214',
        },
        {
          id: 5,
          name: 'Camera 5',
          url: 'http://127.0.0.1:8000/video5',
          ip: '192.168.6.215',
        },
        {
          id: 6,
          name: 'Camera 6',
          url: 'http://127.0.0.1:8000/video6',
          ip: '192.168.6.216',
        },
        {
          id: 7,
          name: 'Camera 7',
          url: 'http://127.0.0.1:8000/video7',
          ip: '192.168.6.217',
        },
        {
          id: 8,
          name: 'Camera 8',
          url: 'http://127.0.0.1:8000/video8',
          ip: '192.168.6.218',
        },
        {
          id: 9,
          name: 'Camera 9',
          url: 'http://127.0.0.1:8000/video9',
          ip: '192.168.6.219',
        },
        {
          id: 10,
          name: 'Camera 10',
          url: 'http://127.0.0.1:8000/video10',
          ip: '192.168.6.210',
        },
      ]);
      setGimbal(target.value);
      setGimbalControl('192.168.6.211');
      return;
    }
    setAllCamera(false);
    setCamUrl(url);
    setGimbalControl(target.value);
    setGimbal(target.value);
  };

  const onButtonPress = async (msg) => {
    // if (allCamera) return;
    try {
      const res = await messageHub.sendMessage({
        type: 'X-Camera-MISSION',
        message: msg,
        ip: gimbalControl,
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
    width: '250px',
    height: '250px',
    objectFit: 'cover',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '5px',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    justifyContent: 'center',
    padding: '15px',
  };

  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          alignSelf: 'center',
          gap: 10,
        }}
      >
        <FormControl>
          <InputLabel id='demo-simple-select-label'>Ip</InputLabel>
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
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'up')}
          onLongPressEnd={onButtonPress.bind(this, 'stop')}
        >
          Up
        </LongPressButton>
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
        <LongPressButton
          onLongPress={onButtonPress.bind(this, 'down')}
          onLongPressEnd={onButtonPress.bind(this, 'stop')}
        >
          Down
        </LongPressButton>
        <Button
          onClick={() => {
            onButtonPress('start_record');
            setRecording(true);
          }}
        >
          Start Recording
        </Button>
        <Button
          onClick={() => {
            onButtonPress('stop_record');
            setRecording(false);
          }}
        >
          Stop Recording
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={gridStyle}>
          {allCamera ? (
            allCamUrl.map(({ url, id, ip }) => (
              <img
                id={`${id}-${Math.random()}`}
                style={imageStyle}
                src={`${url}?random=${Math.random()}`}
                onClick={() => {
                  dispatch(
                    showNotification({
                      message: ip,
                      semantics: MessageSemantics.INFO,
                    })
                  );
                  setGimbalControl(ip);
                }}
              />
            ))
          ) : (
            <img
              style={{
                width: '1180px',
                height: '620px',
              }}
              id={Math.random()}
              onDoubleClick={handleDoubleClick}
              src={`${camUrl}?random=${Math.random()}`}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default SpareDronePanel;
