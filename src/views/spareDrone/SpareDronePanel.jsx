import React from 'react';
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from '@material-ui/core';
import { getCurrentServerState } from '~/features/servers/selectors';
import { connect } from 'react-redux';
import { getMissionState } from '~/utils/messaging';
import {
  updateUavNumberToMission,
  updateMissionNumberToMission,
  updateMissionAltToMission,
} from '~/features/uav-control/slice';
import { getUAVIdList } from '~/features/uavs/selectors';
import { showNotification } from '~/features/snackbar/slice';
import { MessageSemantics } from '~/features/snackbar/types';
import messageHub from '~/message-hub';

const SpareDronePanel = ({
  uavList,
  uav,
  mission,
  alt,
  updateUav,
  updateMission,
  updateAlt,
  dispatch,
}) => {
  const uploadMission = async () => {
    try {
      const res = await messageHub.sendMessage({
        type: 'X-UAV-MISSION',
        message: 'sparedrones',
        mission,
        uav,
        alt,
      });
      if (Boolean(res.body.message)) {
        dispatch(
          showNotification({
            message: `sparedrones Message sent`,
            semantics: MessageSemantics.SUCCESS,
          })
        );
      }
    } catch (e) {
      dispatch(
        showNotification({
          message: `sparedrones Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  return (
    <Box>
      <Box
        style={{
          margin: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FormControl variant='standard' fullWidth>
          <InputLabel style={{ padding: 5 }} htmlFor='uavs-spare-drone'>
            Uavs
          </InputLabel>
          <Select
            disabled={uavList?.length === 0}
            value={uav}
            variant='filled'
            inputProps={{ id: 'uavs-spare-drone' }}
            fullWidth
            onChange={({ target: { value } }) => updateUav(value)}
          >
            {uavList?.length != 0 &&
              uavList?.map((uavid) => (
                <MenuItem value={uavid}>{Number(uavid)}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl variant='standard' fullWidth>
          <InputLabel htmlFor='mission-spare-drone' style={{ padding: 5 }}>
            Mission
          </InputLabel>
          <Select
            disabled={uavList?.length === 0}
            value={mission}
            variant='filled'
            inputProps={{ id: 'mission-spare-drone' }}
            fullWidth
            onChange={({ target: { value } }) => updateMission(value)}
          >
            {uavList?.length != 0 &&
              uavList?.map((uavid) => (
                <MenuItem value={uavid}>{Number(uavid)}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        style={{
          margin: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FormControl variant='standard' fullWidth>
          <InputLabel htmlFor='alt-spare-drone' style={{ padding: 5 }}>
            Mission Alt
          </InputLabel>
          <Input
            value={alt}
            onChange={({ target: { value } }) => updateAlt(value)}
          />
        </FormControl>
        <FormControl variant='standard' fullWidth>
          <Button
            disabled={!(uav && mission && alt)}
            variant='contained'
            onClick={uploadMission}
          >
            Upload Mission and Start
          </Button>
        </FormControl>
      </Box>
    </Box>
    // <svg
    //   enable-background='new 0 0 141.732 141.732'
    //   height='141.732px'
    //   id='Livello_1'
    //   version='1.1'
    //   viewBox='0 0 141.732 141.732'
    //   width='141.732px'
    //   // xml:space='preserve'
    //   // xmlns='http://www.w3.org/2000/svg'
    //   // xmlns:xlink='http://www.w3.org/1999/xlink'
    // >
    //   <g id='Livello_24'>
    //     <path
    //       d='M140.488,88.613V86.09L78.213,44.375V76.15c-0.004-0.094-0.009-0.188-0.012-0.283V19.195   c0-6.924-2.146-13.219-5.654-17.955C72.157,0.514,71.219,0,70.121,0c-1.097,0-2.036,0.516-2.426,1.239   c-3.506,4.736-5.654,11.031-5.654,17.955c0,0.922,0.045,1.83,0.119,2.729v22.529L0,86.09v2.522l61.975-8.342   c-0.026,1.412-0.039,2.834-0.039,4.267c0,11.11,0.78,21.625,2.179,30.995l-13.19,17.998v1.334l16.16-4.432v-0.027   c0.922,3.56,1.949,6.82,3.066,9.732c1.114-2.902,2.136-6.15,3.055-9.693l16.116,4.42v-1.334l-13.146-17.938   c1.402-9.389,2.189-19.924,2.189-31.059c0-1.438-0.014-2.871-0.04-4.291L140.488,88.613z'
    //       fill='blue'
    //     />
    //   </g>
    //   <g id='Livello_1_1_' />
    // </svg>
    // <iframe
    //   style={{
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     bottom: 0,
    //     right: 0,
    //     width: '100%',
    //     height: '100%',
    //   }}
    //   src='http://192.168.0.127:5000/video_feed'
    //   title='YouTube video player'
    //   frameborder='0'
    //   allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    //   referrerpolicy='strict-origin-when-cross-origin'
    //   allowfullscreen
    // ></iframe>
  );
};

export default connect(
  // mapStateToProps
  (state) => ({
    connectionState: getCurrentServerState(state).state,
    ...getMissionState(state),
    uavList: getUAVIdList(state),
  }),
  // mapDispatchToProps
  (dispatch) => ({
    dispatch,
    updateUav(UavNum) {
      dispatch(updateUavNumberToMission(UavNum));
    },
    updateMission(MissionNum) {
      dispatch(updateMissionNumberToMission(MissionNum));
    },
    updateAlt(alt) {
      dispatch(updateMissionAltToMission(alt));
    },
  })
)(SpareDronePanel);
