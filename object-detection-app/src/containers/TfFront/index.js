import { useState, useRef, getContext, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  CircularProgress
} from '@mui/material';
import MagicDropzone from "react-magic-dropzone";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { cropToCanvas, sendImageChange } from './helpers';

const StyledBox = styled(Box)({
  "& img": {
    maxWidth: "100%"
  }
});

function TfFront(props) {

  const [ model, setModel] = useState(null);
  const [ preview, setPreview] = useState('');
  const [ predictions, setPredictions] = useState([]);

  useEffect(() => {
    cocoSsd.load().then((model) => setModel(model));
  }, []);

  const onDrop = (accepted, rejected, links) => setPreview(accepted[0].preview || links[0]);

  const onImageChange = (e) => sendImageChange(e, model);

  return (
    <Container maxWidth="sm">
      <StyledBox sx={{ mt: 10 }}>
        <>
          {!model &&
            <center>
              <CircularProgress />
              <p>Loading tensorflow model...</p>
            </center>
          }
          {!!model &&
            <div className="Dropzone-page">
              <MagicDropzone
                className="Dropzone"
                accept="image/jpeg, image/png, .jpg, .jpeg, .png"
                multiple={false}
                onDrop={(accepted, rejected, links) => onDrop(accepted, rejected, links)}
              >
                {preview ? (
                  <img
                    alt="upload preview"
                    onLoad={(e) => onImageChange(e)}
                    className="Dropzone-img"
                    src={preview}
                  />
                ) : (
                  <center>Choose or drop a file.</center>
                )}
                <canvas id="canvas" />
              </MagicDropzone>
            </div>
          }
        </>
      </StyledBox>
    </Container>
  );
}
export default inject("tfStore")(observer(TfFront));
