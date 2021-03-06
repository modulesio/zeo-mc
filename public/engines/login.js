import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;
import {Worlds, World} from '../stores/login';
import configJson from '../../config/index.json';

export default class LoginEngine extends Engine {
  static NAME = 'login';

  init() {
    let pending = 2;
    const pend = () => {
      if (--pending === 0) {
        this.updateState('login', state => state
          .set('loading', false));
      }
    };

    const handleError = err => {
      console.warn(err);
      pend();
    };

    // log in existing session
    const session = localStorage.getItem('session');
    if (session) {
      _getGraphQl('query', 'login', {
        session,
      }, {
        user: {
          id: true,
          username: true,
          gender: true,
        },
        session: true
      }).then(data => {
        if (data && data.login) {
          this.succeedInitialLogin(data.login);

          pend();
        } else {
          handleError('Invalid session');
        }
      }).catch(handleError);
    }

    // fetch worlds
    _getGraphQl('query', 'worlds', {}, {
      worlds: {
        worldname: true,
        seed: true,
      }
    }).then(data => {
      if (data && data.worlds) {
        const {worlds} = data.worlds;
        const world = (() => {
          const worldname = localStorage.getItem('worldname');
          if (worldname) {
            const matchingWorlds = worlds.filter(world => world.worldname === worldname);
            if (matchingWorlds.length > 0) {
              const matchingWorld = matchingWorlds[0];
              return matchingWorld;
            } else {
              return null;
            }
          } else {
            return null;
          }
        })();
        this.succeedGetWorlds({
          worlds,
          world,
        });

        pend();
      } else {
        handleError('Failed to fetch worlds');
      }
    }).catch(handleError);

    return null;
  }

  loginWithUsernamePassword({username, password}) {
    if (username && password) {
      _getGraphQl('mutation', 'login', {
        username,
        password,
      }, {
        user: {
          id: true,
          username: true,
          gender: true,
        },
        session: true
      }).then(data => {
        if (data && data.login) {
          this.succeedLogin(data.login);
        } else {
          this.fail('Invalid username or password');
        }
      }).catch(err => { this.fail(err); });
    } else {
      this.fail('Username and password are required');
    }
  }

  logout() {
    localStorage.removeItem('session');
    localStorage.removeItem('worldname');

    this.updateState('login', state => state
      .set('user', null)
      .set('session', null)
      .set('world', null));
  }

  succeedInitialLogin(data) {
    const {user, session} = data;

    console.log('successfully initially logged in', {user, session});

    this.updateState('login', state => state
      .set('user', user)
      .set('session', session));
  }

  succeedLogin(data) {
    const {user, session} = data;

    console.log('successfully logged in', {user, session});

    localStorage.setItem('session', session);

    this.updateState('login', state => state
      .set('user', user)
      .set('session', session)
      .set('world', null)
      .set('mode', 'mainMenu')
      .set('error', null));
  }

  succeedGetWorlds(data) {
    const {worlds, world} = data;

    console.log('successfully got worlds', {worlds, world});

    this.updateState('login', state => state
      .set('worlds', Worlds.create(worlds))
      .set('world', world)
      .set('mode', 'mainMenu')
      .set('error', null));
  }

  succeedCreateUser(data) {
    const {user, session} = data;

    console.log('successfully created user', {user, session});

    localStorage.setItem('session', session);

    this.updateState('login', state => state
      .set('user', user)
      .set('session', session)
      .set('world', null)
      .set('creatingUser', false)
      .set('mode', 'mainMenu')
      .set('error', null));
  }

  succeedCreateWorld(data) {
    const {world} = data;
    const {worldname, seed} = world;

    console.log('successfully created world', {worldname, seed});

    this.updateState('login', state => state
      .update('worlds', worlds => worlds.push(new World({worldname, seed})))
      .set('creatingWorld', false)
      .set('error', null));
  }

  succeedDeleteWorld(data) {
    const {worldname} = data;

    console.log('successfully deleted world', worldname);

    this.updateState('login', state => state
      .update('world', world => ((world && world.worldname !== worldname) ? world : null))
      .update('worlds', worlds => worlds.filter(world => world.worldname !== worldname))
      .set('error', null));
  }

  fail(err) {
    this.updateState('login', state => state
      .set('error', String(err)));
  }

  clearError() {
    this.updateState('login', state => state
      .set('error', null));
  }

  startCreateUser() {
    this.updateState('login', state => state
      .set('creatingUser', true));
  }

  createUser({username, password, gender}) {
    if (username && password && gender) {
      _getGraphQl('mutation', 'createUser', {
        username,
        password,
        gender,
      }, {
        user: {
          id: true,
          username: true,
          gender: true,
        },
        session: true
      }).then(data => {
        if (data && data.createUser) {
          this.succeedCreateUser(data.createUser);
        } else {
          this.fail('Failed to create account');
        }
      }).catch(err => { this.fail(err); });
    } else {
      this.fail('Username and password are required');
    }
  }

  startCreateWorld() {
    this.updateState('login', state => state
      .set('creatingWorld', true));
  }

  createWorld({worldname, seed}) {
    if (worldname && seed) {
      _getGraphQl('mutation', 'createWorld', {
        worldname,
        seed,
      }, {
        world: {
          worldname: true,
          seed: true,
        }
      }).then(data => {
        if (data && data.createWorld) {
          this.succeedCreateWorld(data.createWorld);
        } else {
          this.fail('Failed to create world');
        }
      }).catch(err => { this.fail(err); });
    } else {
      this.fail('Worldname and seed are required');
    }
  }

  deleteWorld(worldname) {
    _getGraphQl('mutation', 'deleteWorld', {
      worldname,
    }, {
      worldname: true,
    }).then(data => {
      if (data && data.deleteWorld) {
        this.succeedDeleteWorld(data.deleteWorld);
      } else {
        this.fail('Failed to delete world');
      }
    }).catch(err => { this.fail(err); });
  }

  selectWorld(worldname) {
    localStorage.setItem('worldname', worldname);

    this.updateState('login', state => state
      .set('world', {worldname})
      .set('mode', 'mainMenu'));
  }

  changeUser(mode) {
    this.updateState('login', state => state
      .set('mode', 'login'));
  }

  changeWorld(mode) {
    this.updateState('login', state => state
      .set('mode', 'enter'));
  }

  play(worldname) {
    this.updateState('login', state => state
      .set('mode', 'live'));
  }

  back() {
    this.updateState('login', state => {
      const {mode, user, world, creatingUser, creatingWorld} = state;
      if (mode === 'mainMenu') {
        return state;
      } if (mode === 'login') {
        if (creatingUser) {
          return state.set('creatingUser', false);
        } else {
          return state.set('mode', 'mainMenu');
        }
      } else if (mode === 'enter') {
        if (creatingWorld) {
          return state.set('creatingWorld', false);
        } else {
          return state.set('mode', 'mainMenu');
        }
      } else if (mode === 'live') {
        return state.set('mode', 'mainMenu');
      } else {
        return state;
      }
    });
  }
}

function _getGraphQl(type, method, args, fields) {
  const query = _makeGraphQlQuery(type, method, args, fields);
  const body = JSON.stringify({query});

  return fetch(configJson.apiPrefix + '/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body,
    // credentials: 'include',
  }).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.text().then(responseText => {
        const responseJson = _jsonParse(responseText);
        const responseData = _getGraphQlResultData(responseJson);
        return responseData;
      });
    } else {
      return null;
    }
  });
}

function _makeGraphQlQuery(type, method, args, fields) {
  function _stringifyMethod(method) {
    return method;
  }
  function _stringifyArgs(args) {
    const argsKeys = Object.keys(args);
    if (argsKeys.length > 0) {
      const parameters = argsKeys.map(k => k + ':' + JSON.stringify(String(args[k])));
      const result = '(' + parameters.join(', ') + ')';
      return result;
    } else {
      return '';
    }
  }
  function _stringifyFields(fields) {
    let acc = [];
    for (let k in fields) {
      const v = fields[k];
      if (typeof v === 'object') {
        acc.push(k + ' { ' + _stringifyFields(v) + ' }');
      } else {
        acc.push(k);
      }
    }
    return acc.join(', ');
  }

  return type + ' { ' + _stringifyMethod(method) + _stringifyArgs(args) + ' { ' + _stringifyFields(fields) + ' } }';
}

function _jsonParse(s) {
  try {
    return JSON.parse(s);
  } catch(err) {
    return null;
  }
}

function _getGraphQlResultData(result) {
  if (result && result.data) {
    return result.data;
  } else {
    return null;
  }
}

module.exports = LoginEngine;
