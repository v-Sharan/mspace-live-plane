import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Box,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  ListItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@material-ui/core';
import { getCurrentServerState } from '~/features/servers/selectors';
import { showNotification } from '~/features/snackbar/slice';
import { MessageSemantics } from '~/features/snackbar/types';
import { connect } from 'react-redux';
import store from '~/store';
import { withTranslation } from 'react-i18next';
import { getUAVIdList } from '~/features/uavs/selectors';
import messageHub from '~/message-hub';
import DraggableDialog from '@skybrush/mui-components/lib/DraggableDialog';
import DialogContent from '@material-ui/core/DialogContent';
import { getSelectedUAVIds } from '~/features/uavs/selectors';
import { ConnectionState } from '~/model/enums';

const swarm_location = ['DCE', 'TAMBARAM', 'LUCKNOW'];
const runway = ['Airport', 'Runway', 'Taxiway', 'Apron'];

const SwarmPanel = ({ selectedUAVIds, uavList, connectionState }) => {
  const [val, setVal] = useState({
    uav: 0,
    location: '',
    runwayName: '',
    goal: 0,
    same_alt: 0,
    alt: 0,
    alt_diff: 0,
  });

  const [coverage, setCoverge] = useState([]);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!selectedUAVIds?.length) return;
    setVal((prev) => {
      return { ...prev, uav: parseInt(selectedUAVIds[0]) };
    });
  }, [selectedUAVIds]);

  useEffect(() => {
    if (connectionState != ConnectionState.CONNECTED) return;
    const intervalId = setInterval(() => {
      handleMsg('coverage');
    }, 500);
    return () => clearInterval(intervalId);
  }, [connectionState == ConnectionState.CONNECTED]);

  const handleMsg = async (message) => {
    try {
      const res = await messageHub.sendMessage({
        type: 'X-UAV-socket',
        message,
        ...val,
      });
      if (res.body.method === 'coverage') {
        setCoverge(res.body.message);
        return;
      }
      if (Boolean(res.body.message)) {
        store.dispatch(
          showNotification({
            message: `${message} Message sent`,
            semantics: MessageSemantics.SUCCESS,
          })
        );
      }
    } catch (e) {
      store.dispatch(
        showNotification({
          message: `${message} Command is Failed`,
          semantics: MessageSemantics.ERROR,
        })
      );
    }
  };

  const handleGoal = () => {
    let msg = 'specific_bot_goal';
    if (uavList?.length === selectedUAVIds?.length) {
      msg = 'goal';
    }
    handleMsg(msg);
  };

  const handleAlt = () => {
    let alt_msg = 'same';
    if (val.alt_diff !== 0) alt_msg = 'different';
    handleMsg(alt_msg);
  };

  return (
    <Box style={{ margin: 10, gap: 20 }}>
      <FormGroup style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl fullWidth variant='standard'>
            <Button
              variant='contained'
              onClick={() => handleMsg('master')}
              disabled={selectedUAVIds?.length != 1}
            >
              Master
            </Button>
          </FormControl>
          <FormControl fullWidth variant='standard'>
            <label onClick={() => setEditing(true)}>
              <ListItem button>
                Choose Runway: {val.location} {val.runwayName}
              </ListItem>
            </label>
            <DraggableDialog
              fullWidth
              open={editing}
              maxWidth='sm'
              title='Choose Runway'
              onClose={() => {
                setVal((prev) => {
                  return {
                    ...prev,
                    location: '',
                    runwayName: '',
                  };
                });
                setEditing(false);
              }}
            >
              <DialogContent>
                <FormGroup>
                  <FormControl fullWidth variant='standard'>
                    <InputLabel id='location'>Location:</InputLabel>
                    <Select
                      fullWidth
                      value={val.location}
                      onChange={({ target: { value } }) => {
                        setVal((prev) => {
                          return {
                            ...prev,
                            location: value,
                          };
                        });
                      }}
                    >
                      {swarm_location.map((loc) => (
                        <MenuItem value={loc}>{loc}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant='filled'
                    style={{ marginTop: 5 }}
                  >
                    <FormLabel id='runway' style={{ marginTop: 20 }}>
                      Select position
                    </FormLabel>
                    <RadioGroup aria-labelledby='runway' row>
                      {runway?.length != 0 &&
                        runway.map((item) => (
                          <FormControlLabel
                            label={item}
                            value={item}
                            control={<Radio checked={val.runwayName == item} />}
                            onChange={() => {
                              setVal((prev) => {
                                return {
                                  ...prev,
                                  runwayName: item,
                                };
                              });
                            }}
                          />
                        ))}
                    </RadioGroup>
                  </FormControl>
                  <Button
                    variant='contained'
                    disabled={!(val.location != '' && val.runwayName != '')}
                    onClick={() => {
                      setEditing(false);
                      handleMsg('plot');
                    }}
                  >
                    Submit
                  </Button>
                </FormGroup>
              </DialogContent>
            </DraggableDialog>
          </FormControl>
        </Box>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl
            fullWidth
            variant='standard'
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            <Button variant='contained' onClick={() => handleMsg('start')}>
              Start
            </Button>
            <Button variant='contained' onClick={() => handleMsg('clear_csv')}>
              Clear CSV
            </Button>
            <Button variant='contained' onClick={() => handleMsg('disperse')}>
              Disperse
            </Button>
            <Button variant='contained' onClick={() => handleMsg('search')}>
              Search
            </Button>
            {coverage?.length != 0 && (
              <React.Fragment>
                <p>Area Covered: {parseFloat(coverage[0]).toFixed(2)}</p>
                <p>
                  Time: {coverage[1]}:{coverage[2]}
                </p>
              </React.Fragment>
            )}
          </FormControl>
        </Box>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl
            fullWidth
            variant='standard'
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            <Button variant='contained' onClick={() => handleMsg('aggregate')}>
              Aggregate
            </Button>
            <Button variant='contained' onClick={() => handleMsg('return')}>
              Return
            </Button>
            <Button variant='contained' onClick={() => handleMsg('home')}>
              Home
            </Button>
            <Button variant='contained' onClick={() => handleMsg('home_goto')}>
              Home Goto
            </Button>
          </FormControl>
        </Box>
        <Box style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <FormControl
            fullWidth
            variant='standard'
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            <Button variant='contained' onClick={() => handleMsg('share_data')}>
              share data
            </Button>
            <Button variant='contained' onClick={() => handleMsg('home_lock')}>
              Home Lock
            </Button>
            <Button variant='contained' onClick={() => handleMsg('add_link')}>
              Add Link
            </Button>
            <Button
              variant='contained'
              onClick={() => handleMsg('remove_link')}
            >
              Remove Link
            </Button>
          </FormControl>
        </Box>
        <Box
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <FormControl
            variant='standard'
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            <InputLabel id='goal'>Goal</InputLabel>
            <Input
              id='goal'
              value={val.goal}
              type='number'
              onChange={({ target: { value } }) => {
                setVal((prev) => {
                  return { ...prev, goal: parseInt(value) };
                });
              }}
            />
          </FormControl>
          <Button
            variant='contained'
            onClick={handleGoal}
            disabled={selectedUAVIds?.length === 0}
          >
            Goal
          </Button>
          <FormControl
            variant='standard'
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            <InputLabel id='alt'>Alt</InputLabel>
            <Input
              id='alt'
              value={val.alt}
              type='number'
              onChange={({ target: { value } }) => {
                setVal((prev) => {
                  return { ...prev, alt: parseInt(value) };
                });
              }}
            />
          </FormControl>
          <FormControl>
            <InputLabel id='alt_diff'>Different Alt</InputLabel>
            <Input
              id='alt_diff'
              value={val.alt_diff}
              type='number'
              onChange={({ target: { value } }) => {
                setVal((prev) => {
                  return { ...prev, alt_diff: parseInt(value) };
                });
              }}
            />
          </FormControl>
          <Button variant='contained' onClick={handleAlt} disabled={!val.alt}>
            Set Alt
          </Button>
        </Box>
        <FormControl
          fullWidth
          style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
        >
          <Button variant='contained' onClick={() => handleMsg('stop')}>
            Stop
          </Button>
          <Button variant='contained' onClick={() => handleMsg('remove_uav')}>
            Remove Uav
          </Button>
        </FormControl>
      </FormGroup>
    </Box>
  );
};

SwarmPanel.propTypes = {
  selectedUAVIds: PropTypes.arrayOf(PropTypes.string),
  uavList: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  // mapStateToProps
  (state) => ({
    selectedUAVIds: getSelectedUAVIds(state),
    uavList: getUAVIdList(state),
    connectionState: getCurrentServerState(state).state,
  }),
  // mapDispatchToProps
  (dispatch) => ({})
)(withTranslation()(SwarmPanel));
