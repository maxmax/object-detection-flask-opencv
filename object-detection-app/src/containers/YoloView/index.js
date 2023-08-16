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


function YoloView(props) {
  // const [selectedImage, setSelectedImage] = useState(null);

  const {
    state,
    data,
    getData,
    sendImage,
    resetImage,
    selectedImage,
    selectedImageUrl,
    setSelectedImage,
    sourceImageUrl
  } = props.yoloStore;

  const decodeImage = () => {
    selectedImage && sendImage(selectedImage)
  }

  const removeImage = () => {
    // setSelectedImage(null)
    // resetImage()
  }

  // const sendSelectedImage = () => {
    // setSelectedImage(null)
    // resetImage()
  // }

  //console.log('props_____yoloStore__', props.yoloStore)
  // console.log('selectedImage_____WWWWW__', selectedImage)
  //if (selectedImage) {
  //  console.log('selectedImage_____WWWWW_2_', selectedImage)
  //  console.log('selectedImage_____WWWWW_3_', selectedImageUrl)
  //}

  // sourceImageUrl
  // console.log('selectedImage____sourceImageUrl_', sourceImageUrl)

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        {!!selectedImage && selectedImageUrl && (
          <div>
            <img
              alt="not found"
              width={"250px"}
              src={selectedImageUrl}
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
            setSelectedImage(event.target.files[0]);
          }}
        />
        {state === 'pending' && (
          <CircularProgress />
        )}
        {!!sourceImageUrl && state === 'done' && (
          <>
            <br />
            <br />
            <img
              alt="not found"
              width={"600px"}
              src={sourceImageUrl}
            />
            <br />
            <br />
          </>
        )}
      </Box>
    </Container>
  );
}

export default inject("yoloStore")(observer(YoloView));
