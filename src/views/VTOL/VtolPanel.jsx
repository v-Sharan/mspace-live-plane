import React, { useState } from 'react';
import {
  Button,
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  Input,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import messageHub from '~/message-hub';
import { MessageSemantics } from '~/features/snackbar/types';
import { showNotification } from '~/features/snackbar/slice';
import store from '~/store';
import {
  setMissionFromServer,
  DownloadMissionTrue,
} from '~/features/uavs/details';
import VideoSrc from '../../../assets/animation-man.mp4';
const { dispatch } = store;

const VtolPanel = () => {
  const [data, setData] = useState({
    numofdrone: 0,
    turn: '',
    skip: 0,
  });

  const handleMsg = async (msg) => {
    if (msg == 'uploadmission') {
      if (data.numofdrone == 0 && data.turn == '') {
        dispatch(
          showNotification({
            message: `Failed to send message ${`${msg}`} due to invalid inputs`,
            semantics: MessageSemantics.ERROR,
          })
        );
      }
    }
    try {
      const res = await messageHub.sendMessage({
        type: 'X-VTOL-MISSION',
        message: msg,
        ...data,
      });

      if (Boolean(res?.body?.message)) {
        dispatch(
          showNotification({
            message: `${msg} Message sent`,
            semantics: MessageSemantics.SUCCESS,
          })
        );
      }
      if (msg === 'download') {
        if (res?.body?.message[0]?.length == 0) {
          dispatch(
            showNotification({
              message: `Read a Empty Mission`,
              semantics: MessageSemantics.ERROR,
            })
          );
          return;
        }
        dispatch(
          showNotification({
            message: `${res.body.message?.length}`,
            semantics: MessageSemantics.ERROR,
          })
        );
        dispatch(setMissionFromServer(res.body.message));
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `${msg} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  return (
    <Box style={{ margin: 10, gap: 20 }}>
      {/* <video
        autoPlay
        loop
        width='auto'
        height='auto'
        src={'http://192.168.0.104:8000/video_feed'}
        type='video/mp4'
      ></video> */}
      <FormGroup style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl fullWidth variant='standard'>
            <InputLabel htmlFor='numofdrone'>Number of Drones</InputLabel>
            <Input
              type='number'
              inputMode='numeric'
              name='numofdrone'
              inputProps={{ id: 'numofdrone' }}
              value={data.numofdrone}
              onChange={({ target: { value, name } }) =>
                setData((prev) => {
                  return { ...prev, [name]: value };
                })
              }
            />
          </FormControl>
          <FormControl fullWidth variant='standard'>
            <FormLabel htmlFor='turn'>Choose Turn:</FormLabel>
            <RadioGroup
              row
              inputProps={{ id: 'turn' }}
              defaultValue=''
              name='turn'
              value={data.turn}
              onChange={({ target: { value, name } }) =>
                setData((prev) => {
                  return { ...prev, [name]: value };
                })
              }
            >
              <FormControlLabel
                value='right'
                control={<Radio checked={data.turn === 'right'} />}
                label='Right'
              />
              <FormControlLabel
                value='left'
                control={<Radio checked={data.turn === 'left'} />}
                label='Left'
              />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth variant='standard'>
            <Button
              variant='contained'
              disabled={!(data.numofdrone && data.turn != '')}
              onClick={() => handleMsg('uploadmission')}
            >
              Upload Mission
            </Button>
          </FormControl>
        </Box>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Button variant='contained' onClick={() => handleMsg('download')}>
            Download All Mission
          </Button>
          <Button
            variant='contained'
            onClick={() => dispatch(DownloadMissionTrue())}
          >
            Plot the Mission
          </Button>
        </Box>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl variant='standard'>
            <InputLabel htmlFor='skip'>Skip waypoint</InputLabel>
            <Input
              name='skip'
              type='number'
              inputMode='numeric'
              inputProps={{ id: 'skip' }}
              value={data.skip}
              onChange={({ target: { value, name } }) =>
                setData((prev) => {
                  return { ...prev, [name]: value };
                })
              }
            />
          </FormControl>
          <Button variant='contained' onClick={() => handleMsg('Skipwaypoint')}>
            Skip waypoint
          </Button>
        </Box>
      </FormGroup>
    </Box>
  );
};

export default VtolPanel;
