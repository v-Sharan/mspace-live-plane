import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {CoordinateField} from "~/components/forms";
import {getPreferredCoordinateFormatter} from "~/selectors/formatting";
import { Form } from 'react-final-form';

const FeaturePointsForm = ({feature,coordinateFormatter}) => <div>Not implemented yet</div>;

FeaturePointsForm.propTypes = {
  feature: PropTypes.object.isRequired,
  featureId: PropTypes.string.isRequired,
};

export default connect(
  // mapStateToProps
  (state, {featureId}) => ({
    coordinateFormatter: getPreferredCoordinateFormatter(state),
  }),
  // mapDispatchToProps
  (dispatch, {featureId}) => ({})
)(FeaturePointsForm);
