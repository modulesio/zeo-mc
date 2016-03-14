import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';
import classnames from 'classnames';

import {GRADIENTS} from '../resources/index';
import {KEYS} from '../utils/input/index';
import {FRAME_RATE, MENU_TIME} from '../constants/index';

const MENU_WIDTH = 300;
const MENU_CANVAS_WIDTH = 250;
const MENU_CANVAS_PIXELATION = 1.5;
const MENU_BAR_WIDTH = 256;
const MENU_BORDER_COLOR = '#333';

const MENU_FONT = '\'Press Start 2P\', cursive';
const MENU_FG_DIM = 0.75;
const MENU_BG_DIM = 0.5;
const MENU_TRANSITION_FN = 'cubic-bezier(0,1,0,1)';

const MENU_TABS = [
  {name: 'all', icon: 'search', value: '\uf002'},
  {name: 'blocks', icon: 'cube', value: '\uf1b2'},
  {name: 'items', icon: 'flask', value: '\uf0c3'},
  {name: 'structures', icon: 'industry', value: '\uf275'},
  {name: 'weapons', icon: 'bomb', value: '\uf1e2'},
  {name: 'materia', icon: 'level-up', value: '\uf219'},
];

const CUBE_SIZE = 0.7;
const CUBE_ROTATION_RATE = 5000;

const {min, max, floor, random} = Math;

export default class VoxelMenu extends React.Component {
  getStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      fontFamily: MENU_FONT,
      color: '#444',
      pointerEvents: 'none'
    };
  }

  onKeyDown = e => {
    const {which} = e;

    if (which === KEYS.TAB) {
      const {engines} = this.props;
      const menuEngine = engines.getEngine('menu');
      menuEngine.toggleOpen();

      e.preventDefault();
    }
  };

  render() {
    return <div style={this.getStyles()} onKeyDown={this.onKeyDown}>
      <MenuBg {...this.props} />
      <MenuFg {...this.props} />
    </div>;
  }
};

class MenuBg extends React.Component {
  getStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, ' + MENU_BG_DIM + ')',
      opacity: open ? 1 : 0,
      transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
    };
  }

  render() {
    return <div style={this.getStyles()} />;
  }
}

class MenuFg extends React.Component {
  render() {
    return <div>
      <Menu2d {...this.props} />
      <Menu3d {...this.props} />
    </div>;
  }
}

class Menu2d extends React.Component {
  render() {
    return <div>
      <Menu2dReact {...this.props} />
      <Menu2dCanvas {...this.props} />
    </div>;
  }
}

class Menu2dReact extends React.Component {
  getStyles() {
    return {
      pointerEvents: 'all'
    };
  }

  getLeftStyles() {
    const {open} = this.props;
    return _getLeftStyles({open, solid: true});
  }

  getRightStyles() {
    const {open} = this.props;
    return _getRightStyles({open, solid: true});
  }

  render() {
    const {tab, engines} = this.props;

    return <div style={this.getStyles()}>
      <div style={this.getLeftStyles()}>
        <MenuTabs tab={tab} engines={engines} />
      </div>
      <div style={this.getRightStyles()}>
        <MenuStats />
      </div>
    </div>;
  }
}

class MenuTabs extends React.Component {
  getStyles() {
    return {
      display: 'flex',
      // borderBottom: '2px solid rgba(0,0,0,0.2)',
    }
  }

  render() {
    const {tab: selectedTab, engines} = this.props;

    return <div style={this.getStyles()}>
      {MENU_TABS.map((tab, i, a) => {
        const {name, value} = tab;
        const selected = selectedTab === name;
        const first = i === 0;
        const last = i === a.length - 1;
        return <MenuTab name={name} value={value} selected={selected} first={first} last={last} engines={engines} key={name} />;
      })}
    </div>;
  }
}

class MenuTab extends React.Component {
  state = {
    hovered: false
  };

  getStyles() {
    const {selected} = this.props;
    // const {hovered} = this.state;

    return {
      display: 'flex',
      position: 'relative',
      flex: 1,
      height: 40,
      // marginBottom: -2,
      alignItems: 'center',
      justifyContent: 'center',
      // fontSize: 20,
      // color: (selected || hovered) ? '#333' : 'rgba(0,0,0,0.2)',
      cursor: !selected ? 'pointer' : null,
    };
  }

 /*  getIconStyles() {
    return {
      // fontSize: 10,
    };
  } */

  /* getIconClassValue() {
    const {icon} = this.props;
    return classnames(['fa', 'fa-' + icon]);
  } */

  getBorderSideStyles(side) {
    const {selected, first, last} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: side === 'left' ? 0 : null,
      right: side === 'right' ? 0 : null,
      borderWidth: 0,
      borderLeftWidth: (side === 'left' && !first) ? 2 : null,
      borderRightWidth: (side === 'right' && !last) ? 2 : null,
      borderStyle: 'solid',
      borderColor: selected ? MENU_BORDER_COLOR : 'transparent',
    };
  }

  getBorderVerticalStyles(side) {
    const {selected} = this.props;

    return {
      position: 'absolute',
      top: side === 'top' ? 0 : null,
      bottom: side === 'bottom' ? 0 : null,
      left: side === 'top' ? 2 : 0,
      right: side === 'top' ? 2 : 0,
      borderWidth: 0,
      borderTopWidth: side === 'top' ? 2 : null,
      borderBottomWidth: side === 'bottom' ? 2 : null,
      borderStyle: 'solid',
      borderColor: (() => {
        if (side === 'top') {
          return selected ? MENU_BORDER_COLOR : 'transparent';
        } else if (side === 'bottom') {
          return selected ? 'transparent' : MENU_BORDER_COLOR;
        } else {
          return null;
        }
      })(),
    };
  }

  onMouseOver = () => {
    this.setState({
      hovered: true
    });
  };

  onMouseOut = () => {
    this.setState({
      hovered: false
    });
  };

  onClick = () => {
    const {name, engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    menuEngine.selectTab(name);
  };

  render() {
    const {value, selected} = this.props;
    const {hovered} = this.state;

    return <div style={this.getStyles()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
      <FontAwesome
        width={32}
        height={32}
        pixelation={MENU_CANVAS_PIXELATION}
        fontSize={12}
        color='#000'
        value={value}
        x={10.5}
        y={14}
        selected={selected}
        hovered={hovered}
      />
      <div style={this.getBorderSideStyles('left')} />
      <div style={this.getBorderSideStyles('right')} />
      {/*<div style={this.getBorderVerticalStyles('top')} />*/}
      <div style={this.getBorderVerticalStyles('bottom')} />
    </div>;
  }
}

class FontAwesome extends React.Component {
  componentDidMount() {
    this.refresh(this.props);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const {selected: newSelected, hovered: newHovered} = nextProps;
    const {selected: oldSelected, hovered: oldHovered} = this.props;

    if (newSelected !== oldSelected || newHovered !== oldHovered) {
      this.refresh(nextProps);
    }
  }

  refresh(props) {
    const {fontSize, color, value, x, y, selected, hovered} = props;

    const canvas = this.domNode();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px FontAwesome';
    ctx.fillStyle = (selected || hovered) ? color : '#999';
    ctx.textAlign='center';
    ctx.fillText(value, x, y);
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  getCanvasStyles() {
    const {width, height} = this.props;

    return {
      width,
      height,
      imageRendering: 'pixelated',
    };
  }

  render() {
    const {width, height, pixelation} = this.props;

    return <canvas width={width / pixelation} height={height / pixelation} style={this.getCanvasStyles()}/>;
  }
}

class MenuStats extends React.Component {
  getStyles() {
    return {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 300,
      width: '100%',
    };
  }

  render() {
    return <div style={this.getStyles()}>
      <MenuStatsBar label='HP' value={2263 * 0.75} total={2263} colors={['#5AD427', '#A4E786']} />
      <MenuStatsBar label='MP' value={177 * 0.4} total={177} colors={['#1D77EF', '#81F3FD']} />
      <MenuStatsBar label='Str' value={124} total={124} colors={['#FB2B69', '#FF5B37']} />
      <MenuStatsBar label='Def' value={124} total={124} colors={['#F7F7F7', '#D7D7D7']} />
      <MenuStatsBar label='Mag' value={124} total={124} colors={['#C86EDF', '#E4B7F0']} />
      <MenuStatsBar label='Spd' value={124} total={124} colors={['#FF9500', '#FF5E3A']} />
    </div>;
  }
}

class MenuStatsBar extends React.Component {
  getStyles() {
    return {
      padding: '5px 20px',
      /* border: '2px solid rgba(0,0,0,0.2)',
      borderRadius: 5, */
    };
  }

  getLabelsStyles() {
    return {
      display: 'flex',
      paddingBottom: 5,
      fontSize: 10,
      // lineHeight: 1.4,
      textShadow: '0 2px rgba(255,255,255,0.35)',
    };
  }

  getLabelStyles() {
    return {
      flex: '1',
    };
  }

  getTotalStyles() {
    return {
      color: '#808080',
      alignContent: 'flex-end',
    };
  }

  getBarWrapperStyles() {
    return {
      height: 4,
      width: MENU_BAR_WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
      border: '2px solid transparent',
    };
  }

  /* getBarWrapperBorderStyles() {
    return {
      height: 2,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.2)',
    };
  } */

  getBarContainerStyles() {
    const {value, total} = this.props;

    return {
      height: '100%',
      width: ((value / total) * 100) + '%',
      overflow: 'hidden'
    };
  }

  getBarStyles() {
    const {colors} = this.props;

    return {
      height: '100%',
      width: MENU_BAR_WIDTH,
      backgroundImage: 'linear-gradient(to right, ' + colors.join(',') + ')',
    };
  }

  render() {
    const {label, total} = this.props;

    return <div style={this.getStyles()}>
      <div style={this.getLabelsStyles()}>
        <div style={this.getLabelStyles()}>{label}</div>
        <div style={this.getTotalStyles()}>{total}</div>
      </div>
      <div style={this.getBarWrapperStyles()}>
        <div style={this.getBarContainerStyles()}>
          <div style={this.getBarStyles()} />
        </div>
        {/* <div style={this.getBarWrapperBorderStyles()} /> */}
      </div>
    </div>;
  }
}

class Menu2dCanvas extends React.Component {
  componentWillMount() {
    _ManualRefreshComponent.componentWillMount.call(this);

    this._canvas = null;
    this._ctx = null;
  }

  /* componentDidMount() {
    const width = MENU_CANVAS_WIDTH;
    const height = MENU_CANVAS_WIDTH;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._canvas = canvas;
    this._ctx = ctx;
  } */

  componentWillUnmount() {
    _ManualRefreshComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshComponent.shouldComponentUpdate.call(this);
  }

  refresh() {
    // XXX
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  } 

  getStyles() {
    return {
      position: 'absolute',
    };
  }

  render() {
    return <div style={this.getStyles()} />;
  }
}

class Menu3d extends React.Component {
  /* getStyles() {
    return {
    };
  } */

  getLeftStyles() {
    const {open} = this.props;
    return _getLeftStyles({open});
  }

  getRightStyles() {
    const {open} = this.props;
    return _getRightStyles({open});
  }

  render() {
    return <div>
      <div style={this.getLeftStyles()}>
        <Menu3dLeft {...this.props} />
      </div>
      <div style={this.getRightStyles()}>
        <Menu3dRight {...this.props} />
      </div>
    </div>;
  }
}

class Menu3dLeft extends React.Component {
  componentWillMount() {
    _ManualRefreshComponent.componentWillMount.call(this);
  }

  componentWillUnmount() {
    _ManualRefreshComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshComponent.shouldComponentUpdate.call(this);
  }

  componentDidMount() {
    const width = MENU_CANVAS_WIDTH;
    const height = MENU_CANVAS_WIDTH;
    // const {devicePixelRatio} = this.props;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      // antialias: true,
    });
    renderer.setSize(width / MENU_CANVAS_PIXELATION, height / MENU_CANVAS_PIXELATION);
    const canvas = renderer.domElement;
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.imageRendering = 'pixelated';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 1000);
    camera.position.set(0, 0, 10);

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._menu = {
      renderer,
      scene,
      camera,
      object: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {tab} = nextProps;
    const {_menu: menu} = this;
    const {scene, object: oldObject} = menu;

    if (oldObject) {
      scene.remove(oldObject);
    }

    if (tab === 'blocks') {
      const blocks = _renderBlocks();
      scene.add(blocks);
      menu.object = blocks;
    } else if (tab === 'materia') {
      const materia = _renderMateria();
      scene.add(materia);
      menu.object = materia;
    }
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  getStyles() {
    return {
      position: 'absolute',
      top: 40,
      left: (MENU_WIDTH - MENU_CANVAS_WIDTH) / 2,
    };
  }

  refresh() {
    const {renderer, scene, camera, object} = this._menu;

    if (object) {
      object.refresh();
    }

    renderer.render(scene, camera);
  }

  render() {
    return <div style={this.getStyles()} />;
  }
}

class Menu3dRight extends React.Component {
  render() {
    return <div />;
  }
}

const _ManualRefreshComponent = {
  componentWillMount() {
    this._timeout = null;
    this._frame = null;

    _ManualRefreshComponent.listen.call(this);
  },

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    if (this._frame) {
      cancelAnimationFrame(this._frame);
    }
  },

  shouldComponentUpdate() {
    return false;
  },

  listen() {
    const recurse = () => {
      this._timeout = setTimeout(() => {
        this._timeout = null;

        this._frame = requestAnimationFrame(() => {
          this._frame = null;

          const {open} = this.props;
          if (open) {
            this.refresh();
          } else {
            const {lastOpenTime} = this.props;
            const now = new Date();
            if (((+now - +lastOpenTime) / 1000) < MENU_TIME) {
              this.refresh();
            }
          }

          recurse();
        });
      }, 1000 / FRAME_RATE);
    };

    recurse();
  }
};

function _getLeftStyles({open, solid}) {
  return {
    position: 'absolute',
    left: open ? 0 : -MENU_WIDTH,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: solid ? ('rgba(255, 255, 255, ' + MENU_FG_DIM + ')') : null,
    transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
  };
}

function _getRightStyles({open, solid}) {
  return {
    position: 'absolute',
    right: open ? 0 : -MENU_WIDTH,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: solid ? ('rgba(255, 255, 255, ' + MENU_FG_DIM + ')') : null,
    transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
  };
}

function _makeCubeGeometry(gradient) {
  const {colors} = gradient;

  const cubeGeometry = new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const {faces, vertices} = cubeGeometry;

  function getVertexColor(v) {
    if (v.x < 0) {
      return new THREE.Color(colors[0]);
    } else {
      return new THREE.Color(colors[1]);
    }
  }

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    face.vertexColors[0] = getVertexColor(vertices[face.a]);
    face.vertexColors[1] = getVertexColor(vertices[face.b]);
    face.vertexColors[2] = getVertexColor(vertices[face.c]);
  }

  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
  return bufferGeometry;
}

const CUBE_EMPTY_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0.15,
  wireframe: true,
});

const CUBE_FULL_MATERIALS = [
  new THREE.MeshBasicMaterial({
    // shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    // opacity: 0.9,
    // transparent: true
  }),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.8,
    wireframe: true,
    // wireframeLinewidth: 1.5,
    // transparent: true
  }),
];

function _renderBlocks() {
  return _renderMateria();
}

function _renderMateria() {
  const object = new THREE.Object3D();

  const materia = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const mesh = (() => {
        if (random() < 0.5) {
          const gradient = GRADIENTS[floor(random() * GRADIENTS.length)];
          const geometry = _makeCubeGeometry(gradient);
          const mesh = (() => {
            if (random() < 0.5) {
              const material = CUBE_EMPTY_MATERIAL;
              const mesh = new THREE.Mesh(geometry, material);
              return mesh;
            } else {
              const materials = CUBE_FULL_MATERIALS;
              const mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
              return mesh;
            }
          })();
          mesh.position.set(-3 + x * 2, -3 + y * 2, 0);
          mesh.rotation.order = 'XYZ';
          return mesh;
        } else {
          return null;
        }
      })();
      if (mesh) {
        materia.push(mesh);
      }
    }
  }
  materia.forEach(mesh => {
    object.add(mesh);
  });

  object.refresh = function() {
    const time = new Date();
    const timeFactor = (+time % CUBE_ROTATION_RATE) / CUBE_ROTATION_RATE;
    const rotationFactor = timeFactor * Math.PI * 2;
    materia.forEach((mesh, i) => {
      const localRotationFactor = rotationFactor + (((i % 4) / 4) * Math.PI * 2);
      mesh.rotation.set(0, localRotationFactor, localRotationFactor);
    });
  };

  return object;
}
