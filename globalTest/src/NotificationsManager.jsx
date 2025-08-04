import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { commsHubApi as core } from './util/http';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: '19px'
    }
  },
  alert: {
    minWidth: '20%',
    maxWidth: '100%',
    wordBreak: 'break-all'
  }
}));

const Alert = React.forwardRef((props, ref) => {
  const classes = useStyles();
  return <MuiAlert className={classes.alert} ref={ref} variant="filled" {...props} />;
});

const AlertsManager = ({ setInternalServerErrorPageVisible }) => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState([]);

  const closeAlert = useCallback((idx) => {
    setAlerts(prevAlerts => prevAlerts.filter((_, aIdx) => aIdx !== idx));
  }, []); // Fix 1: Add missing dependency array

  useEffect(() => {
    const addAlert = (err) => {
      setAlerts(prevAlerts => [{ id: +moment(), err }, ...prevAlerts]); // Fix 2: Add missing +
    };

    core.subscribe({
      handle: addAlert,
      on500Error: () => setInternalServerErrorPageVisible(true)
    });

    return () => core.unsubscribe(); // Fix 3: Call as function with ()
  }, [setInternalServerErrorPageVisible]); // Fix 4: Add dependency

  return (
    <>
      {alerts.map((alert, idx) => (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClick={() => closeAlert(idx)}
          className={classes.root}
          style={{ bottom: idx * 50 + 10 }}
          key={alert.id}
          open={true}
          onClose={() => closeAlert(idx)}
          autoHideDuration={3000}
        >
          <Alert severity={Object.keys(alert.err)[0]}>
            {Object.values(alert.err)[0]}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default AlertsManager;