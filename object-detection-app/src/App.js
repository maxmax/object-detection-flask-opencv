import { Provider } from 'mobx-react';
import { stores } from './stores/root-store';
import DetectionView from './containers/DetectionView';

function App() {
  return (
    <Provider { ...stores }>
      <DetectionView />
    </Provider>
  );
}

export default App;
