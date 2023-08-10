import { useState, useRef, getContext, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import {
  Button,
  ButtonGroup,
  Container,
  Box,
  TextField,
  Input,
  CircularProgress
} from '@mui/material';

const Canvas = props => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const { results } = props;
    const resultsBbox = toJS(results) || null;
    const canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.canvas.width = 600;
    context.canvas.height = 337;

    let img = new Image;
    img.onload = function() {
      context.canvas.width = img.width;
      context.canvas.height = img.height;
      context.drawImage(img, 0,0);
      for (let bboxInfo of results) {
        let bbox = bboxInfo['bbox'];
        let class_name = bboxInfo['name'];
        let score = bboxInfo['conf'];

        context.beginPath();
        context.lineWidth="4";
        context.strokeStyle="red";
        context.fillStyle="red";

        context.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
        context.stroke();

        context.font="30px Arial";

        let content = class_name + " " + parseFloat(score).toFixed(2);
        context.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1]-5);
      }
    }
    img.src = props.image;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }, [])

  return <canvas ref={canvasRef} {...props}/>
}


function TfView(props) {
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    state,
    data,
    getData,
    sendImage,
    resetImage,
  } = props.tfStore;

  const decodeImage = () => {
    sendImage(selectedImage)
  }

  const removeImage = () => {
    // setSelectedImage(null)
    // resetImage()
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        {!!selectedImage && (
          <div>
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            <br />
            <br />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button color="error" onClick={() => removeImage(null)}>Remove</Button>
              <Button variant="contained" onClick={() => decodeImage()}>Decode Image</Button>
            </ButtonGroup>
            <br />
          </div>
        )}
        <br />
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
        {state === 'stop' && (
          <>
            <br />
            <br />
            <Button variant="contained" onClick={() => getData(`http://192.168.1.100:5000/apidev/`)}>Get Data</Button>
          </>
        )}
        {state === 'pending' && (
          <CircularProgress />
        )}
        {!!selectedImage && state === 'done' && (
          <>
            <br />
            <br />
            <Canvas
              image={URL.createObjectURL(selectedImage)}
              results={data.results}
            />
            <br />
            <br />
          </>
        )}
      </Box>
    </Container>
  );
}

export default inject("tfStore")(observer(TfView));
