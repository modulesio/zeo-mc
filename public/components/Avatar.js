import React from 'react';

const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Avatar extends React.Component {
  getStyles() {
    const {special} = this.props;
    return {
      position: 'relative',
      width: '100%',
      height: '100%',
      border: '2px solid ' + (special ? DARK_COLOR : LIGHT_COLOR),
      boxSizing: 'border-box',
    };
  }

  getImageStyles() {
    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#EEE',
      backgroundImage: 'url(\'' + this.getImageUrl() + '\')',
      backgroundSize: 'cover',
      imageRendering: 'pixelated',
    };
  }

  getImageUrl() {
    const {type} = this.props;
    if (type === 'user') {
      const {gender, value} = this.props;
      return '/api/img/users/' + gender + '/' + value;
    } else if (type === 'world') {
      return '';
    } else {
      return null;
    }
  }

  render() {
    return <div style={this.props.style}>
      <div style={this.getStyles()}>
        <div style={this.getImageStyles()} />
      </div>
    </div>;
  }
}