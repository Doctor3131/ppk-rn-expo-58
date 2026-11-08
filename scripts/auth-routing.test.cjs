const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

test('session restoration, login and logout select mutually exclusive routes', () => {
  const states = [];
  let cursor = 0;
  let listener;
  let cleanup;
  let subscriptions = 0;
  let unsubscribed = false;
  const Stack = Object.assign(() => {}, { Protected: 'Protected', Screen: 'Screen' });
  const modules = {
    react: {
      createContext: () => ({ Provider: 'Provider' }),
      useState(initial) {
        const index = cursor++;
        if (!(index in states)) states[index] = initial;
        return [states[index], (value) => { states[index] = value; }];
      },
      useEffect(effect) {
        if (!cleanup) cleanup = effect();
      },
    },
    'react/jsx-runtime': {
      jsx: (type, props) => ({ type, props }),
      jsxs: (type, props) => ({ type, props }),
    },
    'expo-router': { Stack },
    'react-native': { View: 'View', Text: 'Text', ActivityIndicator: 'Spinner' },
    '@react-native-firebase/auth': {
      getAuth: () => ({}),
      onAuthStateChanged(_auth, callback) {
        subscriptions++;
        listener = callback;
        return () => { unsubscribed = true; };
      },
    },
  };
  const source = readFileSync(`${__dirname}/../src/app/_layout.tsx`, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    assert.ok(name in modules, `Unexpected dependency: ${name}`);
    return modules[name];
  } });
  function render() {
    cursor = 0;
    return exports.default();
  }
  function routes() {
    const tree = render();
    return Array.from(tree.props.children.props.children)
      .filter((group) => group.props.guard)
      .flatMap((group) => [].concat(group.props.children))
      .map((screen) => screen.props.name);
  }

  assert.equal(render().type, 'View');
  const user = { uid: 'test-user', email: 'test@example.com' };
  listener(user);
  assert.deepEqual(routes(), ['(tabs)']);
  for (let i = 0; i < 3; i++) {
    listener(null);
    assert.deepEqual(routes(), ['login']);
    assert.deepEqual(routes(), ['login']);
    listener(user);
    assert.deepEqual(routes(), ['(tabs)']);
  }
  assert.equal(subscriptions, 1);
  cleanup();
  assert.equal(unsubscribed, true);
});
