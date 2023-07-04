import { observable, makeAutoObservable, makeObservable, action } from 'mobx';
// import { API_SOURCE, API_DETECTION } from '@env'

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
      getData: action.bound,
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

  getData() {
    // const url = `${API_DETECTION}/api`;
    const url = `/api`;
    this.data = [];
    this.state = "pending";
    fetch(url)
      .then(response => response.json())
      .then(result => {
        this.data = result;
        this.state = "done";
    })
  }
}

const detectionStore = new DetectionStore();

export default detectionStore;
export { DetectionStore };
