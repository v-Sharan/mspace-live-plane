import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type Groups = {
    uav_ids: string[];
    point: number[]
}

interface SwarmSlice {
    coverage: number,
    gridSpacing: number
    Direction: string,
    groups: Groups[] | [],
    addedUavs_ids: string[] | [],
    skip_waypoint: number,
    radius:number,
    speed:number
}

const initialState: SwarmSlice = {
    coverage: 500,
    gridSpacing: 50,
    Direction: 'ClockWise Direction',
    groups: [],
    addedUavs_ids: [],
    skip_waypoint: 0,
    radius:0,
    speed:18,
}

const {actions, reducer} = createSlice({
    name: 'socketswarm',
    initialState,
    reducers: {
        changeCoverage(
            state,
            action: PayloadAction<{ coverage: number }>
        ) {
            state.coverage = action.payload.coverage;
        },
        changeGridSpacing(
            state,
            action: PayloadAction<{ gridSpacing: number }>
        ) {
            state.gridSpacing = action.payload.gridSpacing;
        },
        changeDirection(
            state,
            action: PayloadAction<{ direction: string }>
        ) {
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
        AddGroups(
            state,
            action: PayloadAction<{ uav_ids: string[], point: number[] }>
        ) {
            let grps: Groups = {
                uav_ids: action.payload.uav_ids,
                point: action.payload.point,
            }
            // @ts-ignore
            state.groups.push([...state.groups, grps]);
        }
    }
});

export const {changeWayPoint, changeDirection, changeCoverage, changeGridSpacing, AddGroups,changeRadius,changeSpeed} = actions

export default reducer;
