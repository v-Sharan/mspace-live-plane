import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { shouldOptimizeUIForTouch } from '~/features/settings/selectors';
import { Form } from 'react-final-form';
import { Box, Button, FormControl, InputLabel, Input } from '@material-ui/core';

const FeaturePointsForm = ({ feature, optimizeUIForTouch }) => {
  const handleChangeLatLon = (fields) => {
    console.log(fields);
  };

  return (
    <Box>
      <FormControl
        variant='standard'
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box>
          <InputLabel id='drone-id1'>Target Latitude:</InputLabel>
          <Input
            style={{ padding: 5 }}
            type='string'
            value={'sample'}
            onChange={() => {}}
          />
        </Box>
        <Box>
          <InputLabel id='drone-id2'>Target :</InputLabel>
          <Input
            style={{ padding: 5 }}
            type='string'
            value={'sample'}
            onChange={() => {}}
          />
        </Box>
      </FormControl>
    </Box>
  );
};

FeaturePointsForm.propTypes = {
  feature: PropTypes.object.isRequired,
  featureId: PropTypes.string.isRequired,
  optimizeUIForTouch: PropTypes.bool.isRequired,
};

export default connect(
  // mapStateToProps
  (state, { featureId }) => ({
    optimizeUIForTouch: shouldOptimizeUIForTouch(state),
  }),
  // mapDispatchToProps
  (dispatch, { featureId }) => ({})
)(FeaturePointsForm);
