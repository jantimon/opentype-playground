import { observable, action, computed } from "mobx";
import { load } from 'opentype.js';

function loadFontPromise(fontUrl) {
  return new Promise((resolve, reject) => {
    load(fontUrl, action((err, font) => {
      if (err) {
        return reject(err);
      }
      resolve(font);
    }));
  })
}

export default class Font {
  @observable isLoading: boolean;
  @observable font?;
  _originalFont;
  @observable plugins: Array<(font, originalFont) => void>;

  constructor() {
    this.isLoading = true;
    this.plugins = [];
  }

  @action registerPlugin(callback) {
    this.plugins.push(callback);
    return () => (this.unregisterPlugin(callback));
  }

  @action unregisterPlugin(callback) {
    var index = this.plugins.indexOf(callback);
    if (index !== -1) {
      this.plugins.splice(index, 1);
    }
  }

  @action async loadFont(fontUrl) {
    this.isLoading = true;
    Promise.all([
      loadFontPromise(fontUrl),
      loadFontPromise(fontUrl)
    ])
      .then(action(([font, originalFont]) => {
      this.font = font;
      this._originalFont = originalFont;
      this.isLoading = false;
    }));
  }

  @computed get base64() {
    if (!this.font) {
      return;
    }
    const newFont = Object.create(
      Object.getPrototypeOf(this.font),
      (Object as any).getOwnPropertyDescriptors(this.font as any)
    );
    this.plugins.forEach((plugin) => plugin(newFont, this._originalFont));
    return `data:application/font-woff;base64,${arrayBufferToBase64(newFont.toArrayBuffer())}`;
  }
}


function arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}
