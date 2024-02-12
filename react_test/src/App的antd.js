// import logo from './logo.svg';
// import './App.css';
import {ConfigProvider} from 'antd'
import 'antd/dist/reset.css';
import './App.css';
import UseReducer from './components/UseReducer'

function App() {
  
  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
   <UseReducer/>
  </ConfigProvider>
    
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
