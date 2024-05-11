import React, { useEffect, useState } from 'react';
import config from 'config';
import { Button, Box } from '@material-ui/core';
import { showNotification } from '~/features/snackbar/slice';
import { MessageSemantics } from '~/features/snackbar/types';
import { openOnLoadImage } from '~/features/show/slice';
import { connect } from 'react-redux';
import store from '~/store';

const CameraPanel = ({ onLoadImage }) => {
  const semantics = {
    SUCCESS: MessageSemantics.SUCCESS,
    INFO: MessageSemantics.INFO,
    ERROR: MessageSemantics.ERROR,
    WARNING: MessageSemantics.WARNING,
  };

  const [url, setUrl] = useState([]);

  const handleURL = () => {
    (async () => {
      let urls = config['camera_url'];
      console.log(urls);
      try {
        for (let i in urls) {
          const res = await fetch(
            `http://${urls[i].url}:8000/ping/${urls[i].url}`
          );
          if (!res.ok) {
            store.dispatch(
              showNotification({
                message: `Connection to the Camera ${urls[i].id} is Failed`,
                semantics: semantics.ERROR,
              })
            );
            return;
          }
          const data = await res.json();
          if (!Boolean(data.message)) {
            store.dispatch(
              showNotification({
                message: `Connection to the Camera ${urls[i].id} is Failed`,
                semantics: semantics.ERROR,
              })
            );
            return;
          }
          store.dispatch(
            showNotification({
              message: `Connection to the Camera ${urls[i].id} is Success`,
              semantics: semantics.SUCCESS,
            })
          );
          urls[i].connection = true;
          setUrl((prev) => [...prev, urls[i]]);
        }
      } catch (e) {
        console.log(e);
        store.dispatch(
          showNotification({
            message: `Connection to the Camera ${urls[i].id} is Failed in Catch`,
            semantics: semantics.ERROR,
          })
        );
      }
    })();
  };

  useEffect(() => {
    (async () => {
      let urls = config['camera_url'];
      store.dispatch(
        showNotification({
          message: `${urls?.length} length of the urls`,
          semantics: semantics.SUCCESS,
        })
      );
      try {
        for (let i in urls) {
          const res = await fetch(
            `http://${urls[i].url}:8000/ping/${urls[i].url}`
          );
          if (!res.ok) {
            store.dispatch(
              showNotification({
                message: `Connection to the Camera ${urls[i].id} is Failed`,
                semantics: semantics.ERROR,
              })
            );
            return;
          }
          const data = await res.json();
          if (!Boolean(data.message)) {
            store.dispatch(
              showNotification({
                message: `Connection to the Camera ${urls[i].id} is Failed`,
                semantics: semantics.ERROR,
              })
            );
            return;
          }
          store.dispatch(
            showNotification({
              message: `Connection to the Camera ${urls[i].id} is Success`,
              semantics: semantics.SUCCESS,
            })
          );
          urls[i].connection = true;
          setUrl((prev) => [...prev, urls[i]]);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleTest = async () => {
    console.log(url);
    for (let x in url) {
      console.log(`http://${url[x].url}:8000/single_test/${url[x].id}`);
      const res = await fetch(
        `http://${url[x].url}:8000/single_test/${url[x].id}`
      );
      console.log(res.ok);
      if (!res.ok) {
        store.dispatch(
          showNotification({
            message: `Testing to the Camera ${url[x].id} is Failed`,
            semantics: semantics.ERROR,
          })
        );
        return;
      }
      const data = await res.json();
      if (typeof data.message == 'string') {
        store.dispatch(
          showNotification({
            message: `Testing to the Camera ${url[x].id} is Failed`,
            semantics: semantics.ERROR,
          })
        );
      }
      if (typeof data.message == 'boolean') {
        store.dispatch(
          showNotification({
            message: `Testing to the Camera ${url[x].id} is Success`,
            semantics: semantics.SUCCESS,
          })
        );
      }
    }
  };

  const handleStopCapture = async () => {
    try {
      for (let x in url) {
        const res = await fetch(`http://${url[x].url}:8000/stop_capture`, {
          method: 'POST',
        });
        if (!res.ok) {
          store.dispatch(
            showNotification({
              message: `Stop Command to the Camera ${url[x].id} is Failed`,
              semantics: semantics.ERROR,
            })
          );
          return;
        }
        const data = await res.json();
        if (typeof data.message == 'string') {
          store.dispatch(
            showNotification({
              message: data.message,
              semantics: semantics.INFO,
            })
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleStartCapture = async () => {
    try {
      for (let x in url) {
        const res = await fetch(`http://${url[x].url}:8000/start_capture`, {
          method: 'POST',
        });
        if (!res.ok) {
          store.dispatch(
            showNotification({
              message: `Start Command to the Camera ${url[x].id} is Failed`,
              semantics: semantics.ERROR,
            })
          );
          return;
        }
        const data = await res.json();
        if (typeof data.message == 'string') {
          store.dispatch(
            showNotification({
              message: data.message,
              semantics: semantics.INFO,
            })
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const handleLoadImage = () => {};

  return (
    <Box style={{ margin: 10, gap: 20 }}>
      <Box>
        <h3>Camera Test</h3>
        <Button onClick={handleTest} variant='contained'>
          Test All Camera
        </Button>
        <Button onClick={handleURL} variant='contained'>
          Load Url
        </Button>
        <Button onClick={onLoadImage} variant='contained'>
          Load Image
        </Button>
      </Box>
      <Button onClick={handleStartCapture} variant='contained'>
        Start Capture
      </Button>
      <Button onClick={handleStopCapture} variant='contained'>
        Stop Capture
      </Button>
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state) => ({
    // status: getSetupStageStatuses(state).setupEnvironment,
    // secondaryText: getEnvironmentDescription(state),
  }),
  // mapDispatchToProps
  {
    onLoadImage: openOnLoadImage,
  }
)(CameraPanel);
