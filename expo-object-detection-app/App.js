import { Provider } from 'mobx-react';
import { stores } from './stores/root-store';
import DetectionView from './containers/DetectionView';

export default function App() {
  return (
    <Provider { ...stores }>
      <DetectionView />
    </Provider>
  );
}
