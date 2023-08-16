import detectionStore from "./detection-store";
import tfStore from "./tf-store";
import yoloStore from "./yolo-store";

class RootStore {}

const rootStore = new RootStore();

export const stores = {
  detectionStore,
  tfStore,
  yoloStore
}
