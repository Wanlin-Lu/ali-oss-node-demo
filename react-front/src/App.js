import React from 'react';
import './App.less';

import Header from './components/Header'
import Uploader from './containers/Uploader'

function App() {
  return (
    <div className="App">
      <Header />
      <Uploader />
    </div>
  );
}

export default App;
