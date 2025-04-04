import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { noPayload } from '~/utils/redux';

type Group = {
  [k: string]: string[];
};
interface SwarmSlice {
  coverage: number;
  gridSpacing: number;
  Direction: string;
  skip_waypoint: number;
  radius: number;
  speed: number;
  groupsplitDialog: boolean;
  numOfGroups: number;
  group: Group;
  selectedTab: 'Create' | 'Delete' | 'View Groups';
  time: number;
  timerRunning: boolean;
}

const initialState: SwarmSlice = {
  coverage: 500,
  gridSpacing: 50,
  Direction: 'ClockWise Direction',
  skip_waypoint: 0,
  radius: 0,
  speed: 18,
  groupsplitDialog: false,
  numOfGroups: 0,
  group: {},
  selectedTab: 'Create',
  time: 0,
  timerRunning: false,
};

const { actions, reducer } = createSlice({
  name: 'socketswarm',
  initialState,
  reducers: {
    changeCoverage(state, action: PayloadAction<{ coverage: number }>) {
      state.coverage = action.payload.coverage;
    },
    changeGridSpacing(state, action: PayloadAction<{ gridSpacing: number }>) {
      state.gridSpacing = action.payload.gridSpacing;
    },
    changeDirection(state, action: PayloadAction<{ direction: string }>) {
      state.Direction = action.payload.direction;
    },
    changeWayPoint(state, action: PayloadAction<{ waypoint: number }>) {
      state.skip_waypoint = action.payload.waypoint;
    },
    changeRadius(state, action: PayloadAction<{ radius: number }>) {
      state.radius = action.payload.radius;
    },
    changeSpeed(state, action: PayloadAction<{ speed: number }>) {
      state.speed = action.payload.speed;
    },
    openGroupSplitDialog: noPayload<SwarmSlice>((state) => {
      state.groupsplitDialog = true;
    }),
    closeGroupSplitingDialog: noPayload<SwarmSlice>((state) => {
      state.groupsplitDialog = false;
    }),
    addGroup: (
      state,
      action: PayloadAction<{ id: string; uavs: string[] }>
    ) => {
      state.group[action.payload.id] = action.payload.uavs;
    },
    changeSelectedTab: (
      state,
      action: PayloadAction<SwarmSlice['selectedTab']>
    ) => {
      state.selectedTab = action.payload;
    },
    resetGroup: noPayload<SwarmSlice>((state) => {
      state.group = {};
    }),
    deleteGroup: (state, action: PayloadAction<string>) => {
      delete state.group[action.payload];
    },
    setTime: (state, actions: PayloadAction<number>) => {
      state.time = actions.payload;
    },
    setTimerRunning: (state, action: PayloadAction<boolean>) => {
      state.timerRunning = action.payload;
    },
  },
});

export const {
  changeWayPoint,
  changeDirection,
  changeCoverage,
  changeGridSpacing,
  changeRadius,
  changeSpeed,
  openGroupSplitDialog,
  closeGroupSplitingDialog,
  addGroup,
  changeSelectedTab,
  resetGroup,
  setTime,
  setTimerRunning,
} = actions;

export default reducer;
