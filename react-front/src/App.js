import React from 'react';
import './App.less';

import Header from './components/Header'
import Uploader from './containers/Uploader'
import Pictures from './containers/Pictures'

function App() {
  return (
    <div className="App">
      <Header />
      <Pictures />
      <Uploader />
    </div>
  );
}

export default App;
