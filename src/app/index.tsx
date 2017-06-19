import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { observer } from "mobx-react";
import './index.css';
import Font from './font';
import Swap from './plugins/swap';

useStrict(true);

const fontStore = new Font();
fontStore.loadFont(require('../assets/arkhip.woff'));
(window as any).font = fontStore;

@observer
class App extends React.Component<any, any> {
  render() {
    return <div>
      {fontStore.isLoading ? 'Loading' :
        <div>
          <style>{`
            @font-face {
              font-family: Arkhip;
              src: url(${fontStore.base64}) format('woff');
            }
          `}</style>
          <Swap fontStore={fontStore}/>
        </div>
      }
      <span style={{fontFamily: "Arkhip", border: "1px solid orange"}}>
        Hello World9
      </span>
    </div>
  }
}

(window as any).font = fontStore;

class Demo extends React.Component<any, any> {
  componentDidMount() {

  }
  render() {
    return <div>{this.props.children}</div>;
  }
}

// render react DOM
ReactDOM.render(
  <App />,
  document.getElementById('root')
);



