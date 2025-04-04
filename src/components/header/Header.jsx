import config from 'config';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Shapeshifter from 'react-shapeshifter';

import Box from '@material-ui/core/Box';

import AlertButton from './AlertButton';
import AppSettingsButton from './AppSettingsButton';
import AuthenticationButton from './AuthenticationButton';
import BroadcastButton from './BroadcastButton';
import ConnectionStatusButton from './ConnectionStatusButton';
import FullScreenButton from './FullScreenButton';
import GeofenceSettingsButton from './GeofenceSettingsButton';
import HelpButton from './HelpButton';
import ServerConnectionSettingsButton from './ServerConnectionSettingsButton';
import SessionExpiryBox from './SessionExpiryBox';
import ToolboxButton from './ToolboxButton';

import UAVStatusSummary from '~/components/uavs/UAVStatusSummary';
import PerspectiveBar from '~/features/perspectives/PerspectiveBar';
import RTKStatusHeaderButton from '~/features/rtk/RTKStatusHeaderButton';
import { BROADCAST_MODE_TIMEOUT_LENGTH } from '~/features/settings/constants';
import { toggleSidebar } from '~/features/sidebar/actions';
import { isSidebarOpen } from '~/features/sidebar/selectors';
import AltitudeSummaryHeaderButton from '~/features/uavs/AltitudeSummaryHeaderButton';
import BatteryStatusHeaderButton from '~/features/uavs/BatteryStatusHeaderButton';
import WeatherHeaderButton from '~/features/weather/WeatherHeaderButton';
import { shouldSidebarBeShown } from '~/features/workbench/selectors';
import { hasFeature } from '~/utils/configuration';
import Timer from './Time';

const style = {
  backgroundColor: '#333',
  flexGrow: 0,
  minHeight: 48,
};

const innerStyle = {
  display: 'flex',
  flexFlow: 'row nowrap',
};

const componentRegistry = {
  'alert-button': AlertButton,
  'altitude-summary-header-button': AltitudeSummaryHeaderButton,
  'app-settings-button': AppSettingsButton,
  'authentication-button': AuthenticationButton,
  'battery-status-header-button': BatteryStatusHeaderButton,
  'broadcast-button': () => (
    <BroadcastButton timeoutLength={BROADCAST_MODE_TIMEOUT_LENGTH} />
  ),
  'connection-status-button': ConnectionStatusButton,
  'full-screen-button': FullScreenButton,
  'geofence-settings-button': GeofenceSettingsButton,
  'help-button': () => (config.urls.help ? <HelpButton /> : null),
  'rtk-status-header-button': () =>
    hasFeature('toolboxMenu') && <RTKStatusHeaderButton />,
  'server-connection-settings-button': () => (
    <ServerConnectionSettingsButton
      hideTooltip={config.optimizeUIForTouch.default}
    />
  ),
  'session-expiry-box': SessionExpiryBox,
  'toolbox-button': () => hasFeature('toolboxMenu') && <ToolboxButton />,
  'uav-status-summary': UAVStatusSummary,
  'weather-header-button': WeatherHeaderButton,
};

/**
 * Presentation component for the header at the top edge of the main
 * window.
 *
 * @returns  {Object}  the rendered header component
 */
const Header = ({ isSidebarOpen, showSidebar, toggleSidebar }) => (
  <div id='header' style={{ ...style }}>
    <div id='header-inner' style={innerStyle}>
      {showSidebar && (
        <Shapeshifter
          color='#999'
          style={{ cursor: 'pointer' }}
          shape={isSidebarOpen ? 'close' : 'menu'}
          onClick={toggleSidebar}
        />
      )}

      <p
        style={{
          fontSize: 25,
          margin: 0,
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 5,
        }}
      >
        Dhaksha Live
      </p>
      {/* <PerspectiveBar /> */}
      <Timer />
      <Box pr={0.5} />

      {config.headerComponents
        .flatMap((group) => [
          <hr key={`header-group:${group.join(',')}`} />,
          ...group.map((component) => {
            const Component = componentRegistry[component];
            return <Component key={component} />;
          }),
        ])
        .slice(1)}
    </div>
  </div>
);

Header.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  showSidebar: PropTypes.bool,
  toggleSidebar: PropTypes.func.isRequired,
};

export default connect(
  // mapStateToProps
  (state) => ({
    sessionExpiresAt: state.session.expiresAt,
    isSidebarOpen: isSidebarOpen(state),
    showSidebar: shouldSidebarBeShown(state),
  }),
  // mapDispatchToProps
  { toggleSidebar }
)(Header);
