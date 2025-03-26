import * as React from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  Tab,
  Dialog,
  Chip,
  OutlinedInput,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  closeGroupSplitingDialog,
  addGroup,
  changeSelectedTab,
  resetGroup,
} from '~/features/swarm/slice';
// import DronePlaceholderList from '~/components/uavs/DronePlaceholderList';
import { getSelectedUAVIds, getUAVIdList } from '~/features/uavs/selectors';
import DialogTabs from '@skybrush/mui-components/lib/DialogTabs';
import {
  getFeatureByPoints,
  getGroup,
  valueExists,
} from '~/features/swarm/selectors';
import { showError, showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';

const MultipleSelectChip = ({
  onClose,
  open,
  uavIds,
  features,
  group,
  uavExist,
  markerExists,
  SplitGroup,
  showErrorMsg,
  showMsg,
  onTabSelected,
  selectedTab,
  deleteAllGroup,
}) => {
  let content;
  const actions = [];

  const [inputs, setInputs] = React.useState([]);

  const addInput = () => {
    setInputs([...inputs, { id: Date.now(), value: '', uavs: [] }]); // Add an input object
  };

  const removeInput = () => {
    setInputs([]);
  };

  const updateInput = (id, newValue) => {
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      )
    );
  };

  const updateUav = (id, uavslist) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          const newUavs = input.uavs.includes(uavslist)
            ? input.uavs.filter((uav) => uav !== uavslist) // Remove UAV if it exists
            : [...input.uavs, uavslist]; // Add UAV if it doesn't exist

          return { ...input, uavs: newUavs };
        }
        return input;
      })
    );
  };

  const handleSubmit = () => {
    for (const val in inputs) {
      console.log(inputs[val]);
    }
    // const alreadyExist = markerExists(personName);
    // if (alreadyExist) {
    //   showErrorMsg(`${personName} is already in a Group`);
    // } else {
    //   if (uavIds.length == 0) {
    //     showErrorMsg(`There is No UAV Selected`);
    //     return;
    //   }
    //   SplitGroup({ id: personName, uavs: uavIds });
    //   showMsg(`${personName} is added to a Group`);
    //   onClose();
    // }
  };

  if (features.length == 0) {
    content = (
      <DialogContent>
        <p>Feature does not exist</p>
      </DialogContent>
    );
  } else {
    switch (selectedTab) {
      case 'Create':
        content = (
          <DialogContent>
            {/* <DronePlaceholderList
              title='Selection:'
              items={uavIds}
              mt={0}
              mb={1}
            /> */}
            <Button onClick={addInput}>Add Group</Button>
            {inputs.map((input, i) => (
              <Box
                style={{
                  marginTop: 5,
                  marginBottom: 5,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FormControl fullWidth>
                  {/* <InputLabel id='demo-multiple-chip-label'>
                    Group {i + 1}
                    </InputLabel> */}
                  <Select
                    labelId='demo-multiple-chip-label'
                    style={{ flex: 1 }}
                    type='text'
                    value={input.value}
                    onChange={(e) => updateInput(input.id, e.target.value)}
                    className='w-full p-2 border rounded-lg'
                    placeholder={`Input ${input.id}`}
                  >
                    {features.map((val) => (
                      <MenuItem value={val.id}>{val.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Select
                    id='demo-multiple-chip'
                    multiples
                    style={{ flex: 1 }}
                    value={input.uavs}
                    onChange={(e) => updateUav(input.id, e.target.value)}
                    // input={
                    //   <OutlinedInput id='select-multiple-chip' label='Chip' />
                    // }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {uavIds.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </DialogContent>
        );
        actions.push(
          <Button onClick={handleSubmit}>Submit</Button>,
          <Button onClick={onClose}>Close</Button>,
          <Button
            onClick={() => {
              removeInput();
              deleteAllGroup();
            }}
          >
            Reset Group
          </Button>
        );
        break;

      case 'Delete':
        content = <DialogContent>Delete</DialogContent>;
        break;

      default:
        content = <DialogContent>Default</DialogContent>;
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      title='Group Spliting'
      onClose={onClose}
    >
      <DialogTabs value={selectedTab} onChange={onTabSelected}>
        <Tab value='Create' label='Create Group' />
        <Tab value='Delete' label='Delete Group' />
      </DialogTabs>

      {content}
      <DialogActions>
        {actions}
        {/* <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={onClose}>Close</Button> */}
      </DialogActions>
    </Dialog>
  );
};

MultipleSelectChip.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  uavIds: PropTypes.arrayOf(PropTypes.string),
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  group: PropTypes.object,
  uavExist: PropTypes.bool,
  markerExists: PropTypes.func,
  SplitGroup: PropTypes.func,
  showErrorMsg: PropTypes.func,
  showMsg: PropTypes.func,
  selectedTab: 'Create' | 'Delete' | 'View Groups',
  onTabSelected: PropTypes.func,
  deleteAllGroup: PropTypes.func,
};

const GroupSplitDialog = connect(
  // mapStateToProps
  (state) => ({
    open: state.socket.groupsplitDialog,
    uavIds: getUAVIdList(state),
    features: getFeatureByPoints(state),
    group: getGroup(state),
    uavExist: valueExists(state),
    markerExists: (markerToCheck) => {
      return state.socket.group.hasOwnProperty(markerToCheck);
    },
    selectedTab: state.socket.selectedTab,
  }),
  // mapDispatchToProps
  (dispatch) => ({
    onClose: () => dispatch(closeGroupSplitingDialog()),
    SplitGroup: ({ id, uavs }) => dispatch(addGroup({ id, uavs })),
    showErrorMsg: (msg) => dispatch(showError(msg)),
    showMsg: (msg) =>
      dispatch(
        showNotification({
          message: msg,
          semantics: MessageSemantics.INFO,
        })
      ),
    onTabSelected(_event, value) {
      dispatch(changeSelectedTab(value));
    },
    deleteAllGroup() {
      dispatch(resetGroup());
    },
  })
)(MultipleSelectChip);

export default GroupSplitDialog;
