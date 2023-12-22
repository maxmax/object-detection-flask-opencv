import { observable, makeAutoObservable, makeObservable, action } from 'mobx';

const API_DETECTION = process.env.REACT_APP_API_DETECTION;

class DetectionStore {
  data = [];
  // source = API_SOURCE;
  source = '';
  state = "stop";
  sourceForm = false;

  constructor() {
    makeObservable(this, {
      data: observable,
      state: observable,
      source: observable,
      sourceForm: observable,
      getVideo: action.bound,
      getVideoUrl: action.bound,
      resetCamera: action.bound,
      stopVideo: action.bound,
      swithSourceForm: action.bound,
      sendSource: action.bound,
    })
  }

  getVideo() {
    this.state = "done";
  }

  stopVideo() {
    this.state = "stop";
  }

  swithSourceForm() {
    this.state = "close";
    this.sourceForm = !this.sourceForm;
  }

  sendSource(userSource) {
    this.source = userSource;
    this.sourceForm = false;
    this.state = "done";
  }

  getVideoUrl() {
    const url = `${API_DETECTION}/video-feed`;
    this.data = [];
    this.state = "pending";
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.source = result.source;
        this.data = result;
        this.state = "done";
    })
  }

  resetCamera() {
    const url = `${API_DETECTION}/api-reset-camera`;
    // this.data = [];
    this.state = "pending";
    // this.state = "stop";
    fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log('result__resetCamera_2__', result);
        this.source = "";
        this.state = "stop";
     })
  }
}

const detectionStore = new DetectionStore();

export default detectionStore;
export { DetectionStore };
