import isEmpty from 'lodash-es/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';

import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Engine from '@material-ui/icons/SportsMotorsports';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Assignment from '@material-ui/icons/Assignment';
import Home from '@material-ui/icons/Home';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Refresh from '@material-ui/icons/Refresh';
import GuidedMode from '@material-ui/icons/Bookmark';
import AutoMode from '@material-ui/icons/Autorenew';
import { TooltipWithContainerFromContext as Tooltip } from '~/containerContext';

import Colors from '~/components/colors';
import ToolbarDivider from '~/components/ToolbarDivider';

import {
  requestRemovalOfUAVsByIds,
  requestRemovalOfUAVsMarkedAsGone,
} from '~/features/uavs/actions';
import { openUAVDetailsDialog } from '~/features/uavs/details';
import { createUAVOperationThunks } from '~/utils/messaging';
import { getPreferredCommunicationChannelIndex } from '~/features/mission/selectors';
import { getUAVIdList } from '~/features/uavs/selectors';
import { updateAutoPanSettings, stopAutoPan } from '~/features/map/autopan';

/**
 * Main toolbar for controlling the UAVs.
 */
// eslint-disable-next-line complexity
const UAVOperationsButtonGroup = ({
  broadcast,
  dispatch,
  hideSeparators,
  openUAVDetailsDialog,
  requestRemovalOfUAVsByIds,
  requestRemovalOfUAVsMarkedAsGone,
  selectedUAVIds,
  size,
  startSeparator,
  t,
  autopan,
}) => {
  const isSelectionEmpty = isEmpty(selectedUAVIds) && !broadcast;
  const isSelectionSingle = selectedUAVIds.length === 1 && !broadcast;

  const handleAutoPan = () => {
    const uavid = selectedUAVIds[0];
    if (autopan.isAutoPan && uavid == autopan.uavid) {
      dispatch(stopAutoPan());
      return;
    }
    dispatch(
      updateAutoPanSettings({ uavid: selectedUAVIds[0], isAutoPan: true })
    );
  };

  const {
    reset,
    returnToHome,
    shutdown,
    turnMotorsOff,
    turnMotorsOn,
    guided,
    automode,
    takeOff,
    qloiter,
    land,
  } = bindActionCreators(
    createUAVOperationThunks({
      getTargetedUAVIds(state) {
        return broadcast ? getUAVIdList(state) : selectedUAVIds;
      },

      getTransportOptions(state) {
        const result = {
          channel: getPreferredCommunicationChannelIndex(state),
        };

        if (broadcast) {
          result.broadcast = true;
          result.ignoreIds = true;
        }

        return result;
      },
    }),
    dispatch
  );

  const fontSize = size === 'small' ? 'small' : 'medium';
  const iconSize = size;

  return (
    <>
      {!hideSeparators && startSeparator && (
        <ToolbarDivider orientation='vertical' />
      )}

      <Tooltip content={t('UAVOpButtonGrp.takeOff')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={takeOff}
        >
          <FlightTakeoff fontSize={fontSize} />
        </IconButton>
      </Tooltip>
      {/* <Input
        value={alt}
        disabled={isSelectionEmpty}
        style={{ width: 25 }}
        onChange={({ target: { value } }) => {
          TakeoffChangeFunc(value);
        }}
      /> */}

      <Tooltip content={'QLoiter Mode'}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={qloiter}
        >
          <GuidedMode fontSize={fontSize} />
        </IconButton>
      </Tooltip>
      <Tooltip content={'Guided Mode'}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={guided}
        >
          <GuidedMode fontSize={fontSize} />
        </IconButton>
      </Tooltip>
      <Tooltip content={'QLAND Mode'}>
        <IconButton disabled={isSelectionEmpty} size={iconSize} onClick={land}>
          <GuidedMode fontSize={fontSize} />
        </IconButton>
      </Tooltip>
      <Tooltip content={'Auto Mode'}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={automode}
        >
          <AutoMode fontSize={fontSize} />
        </IconButton>
      </Tooltip>

      <Tooltip content={t('UAVOpButtonGrp.returnToHome')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={returnToHome}
        >
          <Home fontSize={fontSize} />
        </IconButton>
      </Tooltip>
      {/* <Tooltip content={'Start Engine'}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={engineStart}
        >
          <Engine fontSize={fontSize} />
        </IconButton>
      </Tooltip> */}

      <Tooltip content={'Auto Pan'}>
        <Checkbox
          disabled={!isSelectionSingle}
          size={iconSize}
          onClick={handleAutoPan}
          checked={selectedUAVIds[0] == autopan.uavid}
        />
      </Tooltip>

      {/* {!hideSeparators && <ToolbarDivider orientation='vertical' />} */}

      {size !== 'small' && (
        <>
          <Tooltip content={t('UAVOpButtonGrp.properties')}>
            <IconButton
              disabled={!isSelectionSingle}
              size={iconSize}
              onClick={() => openUAVDetailsDialog(selectedUAVIds[0])}
            >
              <Assignment />
            </IconButton>
          </Tooltip>
        </>
      )}

      {!hideSeparators && <ToolbarDivider orientation='vertical' />}

      <Tooltip content={t('UAVOpButtonGrp.armMotors')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={turnMotorsOn}
        >
          <PlayArrow
            fontSize={fontSize}
            htmlColor={isSelectionEmpty ? undefined : Colors.warning}
          />
        </IconButton>
      </Tooltip>

      <Tooltip content={t('UAVOpButtonGrp.disarmMotors')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={turnMotorsOff}
        >
          <Clear
            fontSize={fontSize}
            htmlColor={isSelectionEmpty ? undefined : Colors.warning}
          />
        </IconButton>
      </Tooltip>

      {!hideSeparators && <ToolbarDivider orientation='vertical' />}

      {/* <Tooltip content={t('UAVOpButtonGrp.powerOn')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={wakeUp}
        >
          <Bolt
            htmlColor={isSelectionEmpty ? undefined : Colors.success}
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>

      <Tooltip content={t('UAVOpButtonGrp.sleep')}>
        <IconButton disabled={isSelectionEmpty} size={iconSize} onClick={sleep}>
          <Moon
            htmlColor={isSelectionEmpty ? undefined : Colors.warning}
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip> */}

      <Tooltip content={t('UAVOpButtonGrp.reboot')}>
        <IconButton disabled={isSelectionEmpty} size={iconSize} onClick={reset}>
          <Refresh
            htmlColor={isSelectionEmpty ? undefined : Colors.error}
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>

      <Tooltip content={t('UAVOpButtonGrp.powerOff')}>
        <IconButton
          disabled={isSelectionEmpty}
          size={iconSize}
          onClick={shutdown}
        >
          <PowerSettingsNew
            htmlColor={isSelectionEmpty ? undefined : Colors.error}
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>

      {size !== 'small' && (
        <>
          {!hideSeparators && <ToolbarDivider orientation='vertical' />}

          <Tooltip
            content={
              isSelectionEmpty
                ? t('UAVOpButtonGrp.removeItemsMarkedGone')
                : t('UAVOpButtonGrp.removeSelectedItems')
            }
          >
            <IconButton
              size={iconSize}
              onClick={() => {
                isSelectionEmpty
                  ? requestRemovalOfUAVsMarkedAsGone()
                  : requestRemovalOfUAVsByIds(selectedUAVIds);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
};

UAVOperationsButtonGroup.propTypes = {
  broadcast: PropTypes.bool,
  dispatch: PropTypes.func,
  openUAVDetailsDialog: PropTypes.func,
  requestRemovalOfUAVsByIds: PropTypes.func,
  requestRemovalOfUAVsMarkedAsGone: PropTypes.func,
  selectedUAVIds: PropTypes.arrayOf(PropTypes.string),
  hideSeparators: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  startSeparator: PropTypes.bool,
  t: PropTypes.func,
};

export default connect(
  // mapStateToProps
  (state) => ({
    autopan: state.map.autopan,
  }),
  // mapDispatchToProps
  (dispatch) => ({
    ...bindActionCreators(
      {
        openUAVDetailsDialog,
        requestRemovalOfUAVsMarkedAsGone,
        requestRemovalOfUAVsByIds,
      },
      dispatch
    ),
    dispatch,
  })
)(withTranslation()(UAVOperationsButtonGroup));
