import { useState } from 'react';
import { observer, inject } from 'mobx-react';
import {
  Button,
  Container,
  Box,
  TextField,
  CircularProgress
} from '@mui/material';

function DetectionView(props) {

  const [ stateSource, onChangeStateSource] = useState('');

  const {
    state,
    source,
    sourceForm,
    getVideoUrl,
    getVideo,
    resetCamera,
    stopVideo,
    swithSourceForm,
    sendSource,
  } = props.detectionStore;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        {sourceForm && (
          <>
            <TextField
              id="outlined-basic"
              label="url"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={e => onChangeStateSource(e.target.value)}
              />
            <br />
            <Button variant="contained" onClick={() => sendSource(stateSource)}>Save source</Button>
          </>
        )}
        {state === 'stop' && (
          <>
            <Button variant="contained" onClick={() => getVideoUrl()}>Start</Button>
            <br />
            <br />
            <Button variant="contained" color="success" onClick={() => swithSourceForm()}>Change source</Button>
          </>
        )}
        {state === 'pending' && (
          <CircularProgress />
        )}
        {state === 'done' && (
          <>
            <Box
              id="videoElement"
              component="img"
              sx={{
                height: 450,
                width: 600,
                // maxHeight: { xs: 233, md: 167 },
                // maxWidth: { xs: 350, md: 250 },
              }}
              src={source}
            />
            <br />
            <Button variant="contained" onClick={() => resetCamera()}>Stop</Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default inject("detectionStore")(observer(DetectionView));
