import { observable, makeAutoObservable, makeObservable, action } from 'mobx';

const API_SOURCE = process.env.REACT_APP_API_SOURCE;

class YoloStore {
  data = [];
  // source = API_SOURCE;
  state = "stop";
  selectedImage = null;
  selectedImageUrl = '';
  sourceImageUrl = null;

  constructor() {
    makeObservable(this, {
      // source: observable,
      data: observable,
      state: observable,
      selectedImage: observable,
      selectedImageUrl: observable,
      sourceImageUrl: observable,
      getData: action.bound,
      sendImage: action.bound,
    })
  }

  setSelectedImage = (img) => {
    if (img) {
      this.selectedImage = img;
      this.selectedImageUrl = URL.createObjectURL(img);
    }
  }

  getData(source) {
    const url = `${API_SOURCE}/apidev`;
    this.data = [];
    this.state = "pending";
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.data = result;
        this.state = "done";
    })
  }

  resetImage() {}

  sendImage(image) {
    const url = `${API_SOURCE}/api-yolo-image`;
    this.data = [];
    this.state = "pending";
    let data = new FormData();
    data.append('file', image);

    const options = {
      method: 'POST',
      body: data,
    };

    fetch(url, options)
      .then(response => response.json())
      .then(result => {
        this.data = result.data;
        this.state = "done";
        let image = new Image();
        image.src = `data:image/jpg;base64,${result.image}`;
        this.sourceImageUrl = image.src;
      })
      .catch((error) => {
        this.state = "error";
        console.log(error)
    })
  }
}

const yoloStore = new YoloStore();

export default yoloStore;
export { YoloStore };
