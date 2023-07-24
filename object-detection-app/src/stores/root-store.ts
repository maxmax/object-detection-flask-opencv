import detectionStore from "./detection-store";
import tfStore from "./tf-store";

class RootStore {}

const rootStore = new RootStore();

export const stores = {
  detectionStore,
  tfStore
}
