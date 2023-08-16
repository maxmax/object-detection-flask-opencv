import { observable, makeAutoObservable, makeObservable, action } from 'mobx';
// import { API_SOURCE, API_DETECTION } from '@env'

class TfStore {
  data = [];
  // source = API_SOURCE;
  state = "stop";

  constructor() {
    makeObservable(this, {
      // source: observable,
      data: observable,
      state: observable,
      getData: action.bound,
      sendImage: action.bound,
    })
  }

  getData(source) {
    // const url = `${API_SOURCE}/apidev`;
    const url = source;
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
    // const url = `${API_SOURCE}/apidev`;
    const url = `http://192.168.1.100:5000/api-tf-image/`;
    this.data = [];
    this.state = "pending";
    console.log('sendImage_____image__S', image);
    let data = new FormData();
    data.append('file', image);
    // data.append('filename', this.fileName.value);

    const options = {
      method: 'POST',
      body: data,
    };

    fetch(url, options)
      .then(response => response.json())
      .then(result => {
        this.data = result.data;
        this.state = "done";
      })
      .catch((error) => {
        this.state = "error";
        console.log(error)
    })
  }
}

const tfStore = new TfStore();

export default tfStore;
export { TfStore };
