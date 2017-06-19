import * as React from 'react';
import { observer } from "mobx-react";
import FontStore from '../font';

type PropTypes = {
  fontStore: FontStore
};

@observer
export default class Swap extends React.Component<PropTypes, any> {

  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  componentDidMount() {
    this.props.fontStore.registerPlugin(this.modifyFont);
  }

  componentWillUnmount() {
    this.props.fontStore.unregisterPlugin(this.modifyFont);
  }

  modifyFont = (font, originalFont) => {
    const keys = Object.keys(originalFont.glyphs.glyphs);
    keys.forEach((i) => {
      const origGlyph = originalFont.glyphs.glyphs[i];
      const delta = this.state.checked ? -1 : 0;
      const index = (keys.length + Number(i) + delta) % keys.length;
      font.glyphs.glyphs[index].path = origGlyph.path;
    });
  }

  handleChange = () => {
    this.setState({checked: !this.state.checked});
  }

  render() {
    return <div>
      <input type="checkbox" checked={this.state.checked} onChange={this.handleChange} />{this.state.checked ? 'RV@O' : 'SWAP'}
    </div>
  }
}
