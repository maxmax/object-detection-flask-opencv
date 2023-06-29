import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Object detection</h1>
      <section className="container-video">
        <img id="videoElement" src="http://127.0.0.1:5000/video_feed" />
      </section>
    </div>
  );
}

export default App;
