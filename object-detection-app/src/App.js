import { Provider } from 'mobx-react';
import { stores } from './stores/root-store';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import DetectionView from './containers/DetectionView';
import TfView from './containers/TfView';
import YoloView from './containers/YoloView';
import Navigation from './components/Navigation';

function App() {
  return (
    <Provider { ...stores }>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<TfView />} />
        <Route path="/detection" element={<DetectionView />} />
        <Route path="/tf" element={<TfView />} />
        <Route path="/yolo" element={<YoloView />} />
      </Routes>
    </Provider>
  );
}

export default App;
