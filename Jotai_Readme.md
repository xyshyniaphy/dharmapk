<br>

![Jotai (light mode)](./img/jotai-header-light.png#gh-light-mode-only)
![Jotai (dark mode)](./img/jotai-header-dark.png#gh-dark-mode-only)

<br>

visit [jotai.org](https://jotai.org) or `npm i jotai`

[![Build Status](https://img.shields.io/github/actions/workflow/status/pmndrs/jotai/test.yml?branch=main&style=flat&colorA=000000&colorB=000000)](https://github.com/pmndrs/jotai/actions?query=workflow%3ALint)
[![Build Size](https://img.shields.io/bundlephobia/minzip/jotai?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=jotai)
[![Version](https://img.shields.io/npm/v/jotai?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/jotai)
[![Downloads](https://img.shields.io/npm/dt/jotai.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/jotai)
[![Discord Shield](https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=ffffff)](https://discord.gg/poimandres)
[![Open Collective](https://img.shields.io/opencollective/all/jotai?style=flat&colorA=000000&colorB=000000)](https://opencollective.com/jotai)

Jotai scales from a simple useState replacement to an enterprise TypeScript application.

- Minimal core API (2kb)
- Many utilities and extensions
- No string keys (compared to Recoil)

Examples: [Demo 1](https://codesandbox.io/s/jotai-demo-47wvh) |
[Demo 2](https://codesandbox.io/s/jotai-demo-forked-x2g5d)

### First, create a primitive atom

An atom represents a piece of state. All you need is to specify an initial
value, which can be primitive values like strings and numbers, objects, and
arrays. You can create as many primitive atoms as you want.

```jsx
import { atom } from 'jotai'

const countAtom = atom(0)
const countryAtom = atom('Japan')
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])
const mangaAtom = atom({ 'Dragon Ball': 1984, 'One Piece': 1997, Naruto: 1999 })
```

### Use the atom in your components

It can be used like `React.useState`:

```jsx
import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <h1>
      {count}
      <button onClick={() => setCount((c) => c + 1)}>one up</button>
      ...
```

### Create derived atoms with computed values

A new read-only atom can be created from existing atoms by passing a read
function as the first argument. `get` allows you to fetch the contextual value
of any atom.

```jsx
const doubledCountAtom = atom((get) => get(countAtom) * 2)

function DoubleCounter() {
  const [doubledCount] = useAtom(doubledCountAtom)
  return <h2>{doubledCount}</h2>
}
```

### Creating an atom from multiple atoms

You can combine multiple atoms to create a derived atom.

```jsx
const count1 = atom(1)
const count2 = atom(2)
const count3 = atom(3)

const sum = atom((get) => get(count1) + get(count2) + get(count3))
```

Or if you like fp patterns ...

```jsx
const atoms = [count1, count2, count3, ...otherAtoms]
const sum = atom((get) => atoms.map(get).reduce((acc, count) => acc + count))
```

### Derived async atoms [<img src="https://img.shields.io/badge/-needs_suspense-black" alt="needs suspense" />](https://react.dev/reference/react/Suspense)

You can make the read function an async function too.

```jsx
const urlAtom = atom('https://json.host.com')
const fetchUrlAtom = atom(async (get) => {
  const response = await fetch(get(urlAtom))
  return await response.json()
})

function Status() {
  // Re-renders the component after urlAtom is changed and the async function above concludes
  const [json] = useAtom(fetchUrlAtom)
  ...
```

### You can create a writable derived atom

Specify a write function at the second argument. `get` will return the current
value of an atom. `set` will update the value of an atom.

```jsx
const decrementCountAtom = atom(
  (get) => get(countAtom),
  (get, set, _arg) => set(countAtom, get(countAtom) - 1)
)

function Counter() {
  const [count, decrement] = useAtom(decrementCountAtom)
  return (
    <h1>
      {count}
      <button onClick={decrement}>Decrease</button>
      ...
```

### Write only derived atoms

Just do not define a read function.

```jsx
const multiplyCountAtom = atom(null, (get, set, by) =>
  set(countAtom, get(countAtom) * by),
)

function Controls() {
  const [, multiply] = useAtom(multiplyCountAtom)
  return <button onClick={() => multiply(3)}>triple</button>
}
```

### Async actions

Just make the write function an async function and call `set` when you're ready.

```jsx
const fetchCountAtom = atom(
  (get) => get(countAtom),
  async (_get, set, url) => {
    const response = await fetch(url)
    set(countAtom, (await response.json()).count)
  }
)

function Controls() {
  const [count, compute] = useAtom(fetchCountAtom)
  return (
    <button onClick={() => compute('http://count.host.com')}>compute</button>
    ...
```

### Note about functional programming

Jotai's fluid interface is no accident — atoms are monads, just like promises!
Monads are an [established](<https://en.wikipedia.org/wiki/Monad_(functional_programming)>)
pattern for modular, pure, robust and understandable code which is [optimized for change](https://overreacted.io/optimized-for-change/).
Read more about [Jotai and monads.](https://jotai.org/docs/basics/functional-programming-and-jotai)

## Links

- [website](https://jotai.org)
- [documentation](https://jotai.org/docs)
- [course](https://egghead.io/courses/manage-application-state-with-jotai-atoms-2c3a29f0)



---
title: Concepts
nav: 7.01
---

Jotai is a library that will make you return to the basics of React development & keep everything simple.

### From scratch

Before trying to compare Jotai with what we may have known previously, let's just dive straight into something very simple.

The React world is very much like our world, it's a big set of small entities, we call them components, and we know that they have their own state. Structuring your components to interact altogether will create your app.

Now, the Jotai world also has its small entities, atoms, and they also have their state. Composing atoms will create your app state!

Jotai considers anything to be an atom, so you may say: `Huh, I need objects and arrays, filter them and then sort them out`.
And here's the beauty of it, Jotai gracefully lets you create dumb atoms derived from even more dumb atoms.

If, for example, I have a page with 2 tabs: online friends and offline friends.
I will have 2 atoms simply derived from a common, dumber source.

```js
const dumbAtom = atom([{ name: 'Friend 1', online: false }])
const onlineAtom = atom((get) => get(dumbAtom).filter((item) => item.online))
const offlineAtom = atom((get) => get(dumbAtom).filter((item) => !item.online))
```

And you could keep going on complexity forever.

Another incredible feature of Jotai is the built-in ability to suspend when using asynchronous atoms. This is a relatively new feature that needs more experimentation, but is definitely the future of how we will build React apps. [Check out the docs](https://react.dev/blog/2022/03/29/react-v18#new-suspense-features) for more info.






---
title: Functional programming and Jotai
nav: 7.04
---

### Unexpected similarities

If you look at getter functions long enough, you may see a striking resemblance
to a certain JavaScript language feature.

```tsx
const nameAtom = atom('Visitor')
const countAtom = atom(1)
const greetingAtom = atom((get) => {
  const name = get(nameAtom)
  const count = get(countAtom)
  return (
    <div>
      Hello, {name}! You have visited this page {count} times.
    </div>
  )
})
```

Compare that code with `async`–`await`:

```tsx
const namePromise = Promise.resolve('Visitor')
const countPromise = Promise.resolve(1)
const greetingPromise = (async function () {
  const name = await namePromise
  const count = await countPromise
  return (
    <div>
      Hello, {name}! You have visited this page {count} times.
    </div>
  )
})()
```

This similarity is no coincidence. Both atoms and promises are **Monads**†, a
concept from functional programming. The syntax used in both `greetingAtom` and
`greetingPromise` is known as **do-notation**, a syntax sugar for the plainer
monad interface.

### About monads

The monad interface is responsible for the fluidity of the atom and promise
interfaces. The monad interface allowed us to define `greetingAtom` in terms of
`nameAtom` and `countAtom`, and allowed us to define `greetingPromise` in terms
of `namePromise` and `countPromise`.

If you're curious, a structure (like `Atom` or `Promise`) is a monad if you can
implement the following functions for it. A fun exercise is trying to implement
`of`, `map` and `join` for Arrays.

```ts
type SomeMonad<T> = /* for example... */ Array<T>
declare function of<T>(plainValue: T): SomeMonad<T>
declare function map<T, V>(
  anInstance: SomeMonad<T>,
  transformContents: (contents: T) => V,
): SomeMonad<V>
declare function join<T>(nestedInstances: SomeMonad<SomeMonad<T>>): SomeMonad<T>
```

The shared heritage of Promises and Atoms means many patterns and best-practices
can be reused between them. Let's take a look at one.

### Sequencing

When talking about callback hell, we often mention the boilerplate, the
indentation and the easy-to-miss mistakes. However, plumbing a single async
operation into another single async operation was not the end of the callback
struggle. What if we made four network calls and needed to wait for them all?
A snippet like this was common:

```ts
const nPending = 4
const results: string[]
function callback(err, data) {
  if (err) throw err
  results.push(data)
  if (results.length === nPending) {
    // do something with results...
  }
}
```

But what if the results have different types? and the order was important? Well,
we'd have a lot more frustrating work to do! This logic would be duplicated at
each usage, and would be easy to mess up. Since ES6, we simply call `Promise.all`:

```ts
declare function promiseAll<T>(promises: Array<Promise<T>>): Promise<Array<T>>
```

`Promise.all` "rearranges" `Array` and `Promise`. It turns out this concept,
_sequencing_, can be implemented for all monad–_Traversable_ pairs. Many kinds
of collections are Traversables, including Arrays. For example, this is a case
of sequencing specialized for atoms and arrays:

```ts
function sequenceAtomArray<T>(atoms: Array<Atom<T>>): Atom<Array<T>> {
  return atom((get) => atoms.map(get))
}
```

### Culmination

Monads have been an interest to mathematicians for 60 years, and to programmers
for 40. There are many resources out there on patterns for monads. Take a look
at them! Here are a select few:

- [_Inventing Monads_](https://stopa.io/post/247) by Stepan Parunashvili
- [_How Monads Solve Problems_](https://thatsnomoon.dev/posts/ts-monads/) by ThatsNoMoon
- Wiki page [list of monad tutorials](https://wiki.haskell.org/Monad_tutorials_timeline)
- [Typeclassopedia](https://wiki.haskell.org/Typeclassopedia) (for the curious)

Learning a neat trick on using promises may well translate to atoms, as
`Promise.all` and `sequenceAtomArray` did. Monads are not magic, just unusually
useful, and a tool worth knowing.

---

_Notes_

**[†]** The ES6 Promise is not a completely valid monad because it cannot nest other
Promises, e.g. `Promise<Promise<number>>` is semantically equivalent to
`Promise<number>`. This is why Promises only have a `.then`, and not both a
`.map` and `.flatMap`. ES6 Promises are probably more properly described as
"monadic" rather than as monads.

Unlike ES6 Promises, the ES6 Array is a completely lawful monad.





---
title: atom
description: This doc describes core `jotai` bundle.
nav: 2.01
keywords: atom,primitive,derived,debug,label,onmount
---

## atom

The `atom` function is to create an atom config.
We call it "atom config" as it's just a definition and it doesn't yet hold a value.
We may also call it just "atom" if the context is clear.

An atom config is an immutable object. The atom config object doesn't hold a value. The atom value exists in a store.

To create a primitive atom (config), all you need is to provide an initial value.

```js
import { atom } from 'jotai'

const priceAtom = atom(10)
const messageAtom = atom('hello')
const productAtom = atom({ id: 12, name: 'good stuff' })
```

You can also create derived atoms. We have three patterns:

- Read-only atom
- Write-only atom
- Read-Write atom

To create derived atoms, we pass a read function and an optional write function.

```js
const readOnlyAtom = atom((get) => get(priceAtom) * 2)
const writeOnlyAtom = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, update) => {
    // `update` is any single value we receive for updating this atom
    set(priceAtom, get(priceAtom) - update.discount)
    // or we can pass a function as the second parameter
    // the function will be invoked,
    //  receiving the atom's current value as its first parameter
    set(priceAtom, (price) => price - update.discount)
  },
)
const readWriteAtom = atom(
  (get) => get(priceAtom) * 2,
  (get, set, newPrice) => {
    set(priceAtom, newPrice / 2)
    // you can set as many atoms as you want at the same time
  },
)
```

`get` in the read function is to read the atom value.
It's reactive and read dependencies are tracked.

`get` in the write function is also to read atom value, but it's not tracked.
Furthermore, it can't read unresolved async values in Jotai v1 API.

`set` in the write function is to write atom value.
It will invoke the write function of the target atom.

### Note about creating an atom in render function

Atom configs can be created anywhere, but referential equality is important.
They can be created dynamically too.
To create an atom in render function, `useMemo` or `useRef` is required to get a stable reference. If in doubt about using `useMemo` or `useRef` for memoization, use `useMemo`.
Otherwise, it can cause infinite loop with `useAtom`.

```js
const Component = ({ value }) => {
  const valueAtom = useMemo(() => atom({ value }), [value])
  // ...
}
```

### Signatures

```ts
// primitive atom
function atom<Value>(initialValue: Value): PrimitiveAtom<Value>

// read-only atom
function atom<Value>(read: (get: Getter) => Value): Atom<Value>

// writable derived atom
function atom<Value, Args extends unknown[], Result>(
  read: (get: Getter) => Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>

// write-only derived atom
function atom<Value, Args extends unknown[], Result>(
  read: Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>
```

- `initialValue`: the initial value that the atom will return until its value is changed.
- `read`: a function that's evaluated whenever the atom is read. The signature of `read` is `(get) => Value`, and `get` is a function that takes an atom config and returns its value stored in Provider as described below. Dependency is tracked, so if `get` is used for an atom at least once, the `read` will be reevaluated whenever the atom value is changed.
- `write`: a function mostly used for mutating atom's values, for a better description; it gets called whenever we call the second value of the returned pair of `useAtom`, the `useAtom()[1]`. The default value of this function in the primitive atom will change the value of that atom. The signature of `write` is `(get, set, ...args) => Result`. `get` is similar to the one described above, but it doesn't track the dependency. `set` is a function that takes an atom config and a new value which then updates the atom value in Provider. `...args` is the arguments that we receive when we call `useAtom()[1]`. `Result` is the return value of the `write` function.

```js
const primitiveAtom = atom(initialValue)
const derivedAtomWithRead = atom(read)
const derivedAtomWithReadWrite = atom(read, write)
const derivedAtomWithWriteOnly = atom(null, write)
```

There are two kinds of atoms: a writable atom and a read-only atom. Primitive atoms are always writable. Derived atoms are writable if the `write` is specified. The `write` of primitive atoms is equivalent to the `setState` of `React.useState`.

### `debugLabel` property

The created atom config can have an optional property `debugLabel`. The debug label is used to display the atom in debugging. See [Debugging guide](../guides/debugging.mdx) for more information.

Note: While, the debug labels don’t have to be unique, it’s generally recommended to make them distinguishable.

### `onMount` property

The created atom config can have an optional property `onMount`. `onMount` is a function which takes a function `setAtom` and returns `onUnmount` function optionally.

The `onMount` function is called when the atom is subscribed in the provider in the first time,
and `onUnmount` is called when it’s no longer subscribed.
In some cases (like [React strict mode](https://react.dev/reference/react/StrictMode)),
an atom can be unmounted and then mounted immediately.

```js
const anAtom = atom(1)
anAtom.onMount = (setAtom) => {
  console.log('atom is mounted in provider')
  setAtom(c => c + 1) // increment count on mount
  return () => { ... } // return optional onUnmount function
}

const Component = () => {
  // `onMount` will be called when the component is mounted in the following cases:
  useAtom(anAtom)
  useAtomValue(anAtom)

  // however, in the following cases,
  //  `onMount` will not be called because the atom is not subscribed:
  useSetAtom(anAtom)
  useAtomCallback(
    useCallback((get) => get(anAtom), []),
  )
  // ...
}
```

Calling `setAtom` function will invoke the atom’s `write`. Customizing `write` allows changing the behavior.

```js
const countAtom = atom(1)
const derivedAtom = atom(
  (get) => get(countAtom),
  (get, set, action) => {
    if (action.type === 'init') {
      set(countAtom, 10)
    } else if (action.type === 'inc') {
      set(countAtom, (c) => c + 1)
    }
  },
)
derivedAtom.onMount = (setAtom) => {
  setAtom({ type: 'init' })
}
```

### Advanced API

Since Jotai v2, the `read` function has the second argument `options`.

#### `options.signal`

It uses [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) so that you can abort async functions.
Abort is triggered before new calculation (invoking `read` function) is started.

How to use it:

```ts
const readOnlyDerivedAtom = atom(async (get, { signal }) => {
  // use signal to abort your function
})

const writableDerivedAtom = atom(
  async (get, { signal }) => {
    // use signal to abort your function
  },
  (get, set, arg) => {
    // ...
  },
)
```

The `signal` value is [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
You can check `signal.aborted` boolean value, or use `abort` event with `addEventListener`.

For `fetch` use case, we can simply pass `signal`.

See the below example for `fetch` usage.

#### `options.setSelf`

It's a special function to invoke the write function of the self atom.

⚠️ It's provided primarily for internal usage and third-party library authors. Read the source code carefully to understand the behavior. Check release notes for any breaking/non-breaking changes.

## Stackblitz

<Stackblitz id="vitejs-vite-ccqxix" file="src%2FApp.tsx" />

```tsx
import { Suspense } from 'react'
import { atom, useAtom } from 'jotai'

const userIdAtom = atom(1)
const userAtom = atom(async (get, { signal }) => {
  const userId = get(userIdAtom)
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`,
    { signal },
  )
  return response.json()
})

const Controls = () => {
  const [userId, setUserId] = useAtom(userIdAtom)
  return (
    <div>
      User Id: {userId}
      <button onClick={() => setUserId((c) => c - 1)}>Prev</button>
      <button onClick={() => setUserId((c) => c + 1)}>Next</button>
    </div>
  )
}

const UserName = () => {
  const [user] = useAtom(userAtom)
  return <div>User name: {user.name}</div>
}

const App = () => (
  <>
    <Controls />
    <Suspense fallback="Loading...">
      <UserName />
    </Suspense>
  </>
)

export default App
```


---
title: Provider
description: This doc describes core `jotai` bundle.
nav: 2.04
keywords: provider,usestore,ssr
---

## Provider

The `Provider` component is to provide state for a component sub tree.
Multiple Providers can be used for multiple subtrees, and they can even be nested.
This works just like React Context.

If an atom is used in a tree without a Provider,
it will use the default state. This is so-called provider-less mode.

Providers are useful for three reasons:

1. To provide a different state for each sub tree.
2. To accept initial values of atoms.
3. To clear all atoms by remounting.

```jsx
const SubTree = () => (
  <Provider>
    <Child />
  </Provider>
)
```

### Signatures

```ts
const Provider: React.FC<{
  store?: Store
}>
```

Atom configs don't hold values. Atom values reside in separate stores. A Provider is a component that contains a store and provides atom values under the component tree. A Provider works like React context provider. If you don't use a Provider, it works as provider-less mode with a default store. A Provider will be necessary if we need to hold different atom values for different component trees. Provider can take an optional prop `store`.

```jsx
const Root = () => (
  <Provider>
    <App />
  </Provider>
)
```

### `store` prop

A Provider accepts an optional prop `store` that you can use for the Provider subtree.

#### Example

```jsx
const myStore = createStore()

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
```

## useStore

This hook returns a store within the component tree.

```jsx
const Component = () => {
  const store = useStore()
  // ...
}
```




---
title: Store
description: This doc describes core `jotai` bundle.
nav: 2.03
keywords: store,createstore,getdefaultstore,defaultstore
---

## createStore

This function is to create a new empty store.
The store can be used to pass in `Provider`.

The store has three methods: `get` for getting atom values,
`set` for setting atom values, and `sub` for subscribing to atom changes.

```jsx
const myStore = createStore()

const countAtom = atom(0)
myStore.set(countAtom, 1)
const unsub = myStore.sub(countAtom, () => {
  console.log('countAtom value is changed to', myStore.get(countAtom))
})
// unsub() to unsubscribe

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
```

## getDefaultStore

This function returns a default store that is used in provider-less mode.

```js
const defaultStore = getDefaultStore()
```






---
title: useAtom
description: This doc describes core `jotai` bundle.
nav: 2.02
keywords: use,useatom,useatomvalue,usesetatom,atomvalue,setatom
---

## useAtom

The `useAtom` hook is used to read an atom from the state.
The state can be seen as a WeakMap of atom configs and atom values.

The `useAtom` hook returns the atom value and an update function as a tuple,
just like React's `useState`.
It takes an atom config created with `atom()` as a parameter.

At the creation of the atom config, there is no value associated with it.
Only once the atom is used via `useAtom`, does the initial value get stored in the state.
If the atom is a derived atom, the read function is called to compute its initial value.
When an atom is no longer used, meaning all the components using it are unmounted
and the atom config no longer exists, the value in the state is garbage collected.

```js
const [value, setValue] = useAtom(anAtom)
```

The `setValue` takes just one argument, which will be passed
to the write function of the atom as the third parameter.
The end result depends on how the write function is implemented.
If the write function is not explicitly set, the atom will simply receive the value passed as a parameter to `setValue`.

**Note:** as mentioned in the _atom_ section, referential equality is important when creating atoms,
so you need to handle it properly otherwise it can cause infinite loops.

```js
const stableAtom = atom(0)
const Component = () => {
  const [atomValue] = useAtom(atom(0)) // This will cause an infinite loop since the atom instance is being recreated in every render
  const [atomValue] = useAtom(stableAtom) // This is fine
  const [derivedAtomValue] = useAtom(
    useMemo(
      // This is also fine
      () => atom((get) => get(stableAtom) * 2),
      [],
    ),
  )
}
```

**Note**: Remember that React is responsible for calling your component, meaning it has to be idempotent, ready to be called multiple times. You will often see an extra re-render even if no props or atoms have changed. An extra re-render without a commit is an expected behavior, since it is the default behavior of useReducer in React 18.

### Signatures

```ts
// primitive or writable derived atom
function useAtom<Value, Update>(
  atom: WritableAtom<Value, Update>,
  options?: { store?: Store },
): [Value, SetAtom<Update>]

// read-only atom
function useAtom<Value>(
  atom: Atom<Value>,
  options?: { store?: Store },
): [Value, never]
```

### How atom dependency works

Every time we invoke the "read" function, we refresh the dependencies and dependents.

> The read function is the first parameter of the atom.
> If B depends on A, it means that A is a dependency of B, and B is a dependent on A.

```js
const uppercaseAtom = atom((get) => get(textAtom).toUpperCase())
```

When you create the atom, the dependency will not be present. On first use, we run the read function and conclude that `uppercaseAtom` depends on `textAtom`. So `uppercaseAtom` is added to the dependents of `textAtom`.
When we re-run the read function of `uppercaseAtom` (because its `textAtom` dependency is updated),
the dependency is created again, which is the same in this case. We then remove stale dependents from `textAtom` and replace them with their latest versions.

### Atoms can be created on demand

While the basic examples here show defining atoms globally outside components,
there's no restrictions about where or when we can create an atom.
As long as we remember that atoms are identified by their object referential identity,
we can create them anytime.

If you create atoms in render functions, you would typically want to use
a hook like `useRef` or `useMemo` for memoization. If not, the atom would be re-created each time the component renders.

You can create an atom and store it with `useState` or even in another atom.
See an example in [issue #5](https://github.com/pmndrs/jotai/issues/5).

You can also cache atoms somewhere globally.
See [this example](https://twitter.com/dai_shi/status/1317653548314718208) or
[that example](https://github.com/pmndrs/jotai/issues/119#issuecomment-706046321).

Check [`atomFamily`](../utilities/family.mdx) in utils for parameterized atoms.

## useAtomValue

```jsx
const countAtom = atom(0)

const Counter = () => {
  const setCount = useSetAtom(countAtom)
  const count = useAtomValue(countAtom)

  return (
    <>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  )
}
```

Similar to the `useSetAtom` hook, `useAtomValue` allows you to access a read-only atom. Nonetheless, it can also be used to access read-write atom's values.

## useSetAtom

```jsx
const switchAtom = atom(false)

const SetTrueButton = () => {
  const setCount = useSetAtom(switchAtom)
  const setTrue = () => setCount(true)

  return (
    <div>
      <button onClick={setTrue}>Set True</button>
    </div>
  )
}

const SetFalseButton = () => {
  const setCount = useSetAtom(switchAtom)
  const setFalse = () => setCount(false)

  return (
    <div>
      <button onClick={setFalse}>Set False</button>
    </div>
  )
}

export default function App() {
  const state = useAtomValue(switchAtom)

  return (
    <div>
      State: <b>{state.toString()}</b>
      <SetTrueButton />
      <SetFalseButton />
    </div>
  )
}
```

In case you need to update a value of an atom without reading it, you can use `useSetAtom()`.

This is especially useful when the performance is a concern, as the `const [, setValue] = useAtom(valueAtom)` will cause unnecessary rerenders on each `valueAtom` update.






---
title: Performance
description: How to limit extra re-renders
nav: 8.08
keywords: performance
---

**Note**: This guide has room for improvement. Consider it as FYI for now.

Jotai & React gives us quite a few tools to manage the re-renders that happen in the app lifecycle.
First, please read about the difference [between render & commit](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#browsing-commits), because that's very important to understand before going further.

### Cheap renders

As seen in the [core section](../core/atom.mdx), due to React 18 default behaviour (but overall good practice), you have to make sure your component functions are _idempotent_.
They will be called multiple times during the render phase, even at mount. So we need to keep our renders cheap at all cost!

#### Heavy computation

Always make heavy computation outside of the React lifecycle (in actions for example)

Dont's:

```js
// Heavy computation for each item
const selector = (s) => s.filter(heavyComputation)
const Profile = () => {
  const [computed] = useAtom(selectAtom(friendsAtom, selector))
}
```

Do's:

```js
const friendsAtom = atom([])
const fetchFriendsAtom = atom(null, async (get, set, payload) => {
  // Fetch all friends
  const res = await fetch('https://...')
  // Make heavy computation once only
  const computed = res.filter(heavyComputation)
  set(friendsAtom, computed)
})
// Usage in components
const Profile = () => {
  const [friends] = useAtom(friendsAtom)
}
```

#### Small components

Observed atoms should only re-render small parts of your application that required an update. The less comparison React has to make, the shorter your render time will be.

Dont's:

```jsx
const Profile = () => {
  const [name] = useAtom(nameAtom)
  const [age] = useAtom(ageAtom)
  return (
    <>
      <div>{name}</div>
      <div>{age}</div>
    </>
  )
}
```

Do's:

```jsx
const NameComponent = () => {
  const [name] = useAtom(nameAtom)
  return <div>{name}</div>
}
const AgeComponent = () => {
  const [age] = useAtom(ageAtom)
  return <div>{age}</div>
}
const Profile = () => {
  return (
    <>
      <NameComponent />
      <AgeComponent />
    </>
  )
}
```

### Render on demand

Usually, the main performance overhead will come from re-rendering parts of your app that did not need to, or way more than they should.

We have a few tools to deal with "when" React should render our components. If you have not seen the usage of `useMemo` and `useCallback`, please check the official React documentation for more info before going further.
They are of great use to reduce un-necessary renders where your app is not fluid.

But Jotai also provides its set of tools to handle the "when" our atoms should trigger a re-render.

- Out of the box, Jotai encourages you to split your data into atomic parts, hence each atom is stored separately and will only trigger a re-render when their own value change
- `selectAtom` allows you to subscribe to specific part of a large object and only re-render on value change
- `focusAtom` same as selectAtom, but creating a new atom for the part, giving a setter to update that specific part easily
- `splitAtom` does the work of selectAtom/focusAtom for a dynamic list

While this seems simplistic, it is simple to reason about. That was the goal, let's keep it simple to keep it fast.

#### Frequent or rare updates

Ask yourself whether your atom is usually going to be frequently update or more rarely.
Let's imagine an atom containing an object that changes almost every second, it may not be best suited to "focus" on a specific properties of this object using `focusAtom`, because anyway they will all re-render in the same time, so best adding no overhead and not create any more atoms.

On the other hand, if your object has properties that rarely change, and most importantly, that change independently from the other properties, then you may want to use `focusAtom` or `selectAtom` to prevent un-necessary renders.




---
title: Vite
description: How to use Jotai with Vite
nav: 8.99
keywords: vite
published: false
---

You can use the plugins from the `jotai/babel` bundle to enhance your developer experience when using Vite and Jotai.

In your `vite.config.ts`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
  ],
  // ... The rest of your configuration
})
```

There's a template below to try it yourself.

### Examples

#### Vite Template

<Stackblitz id="vitejs-vite-xhhxve" file="vite.config.ts" />




---
title: Persistence
description: How to persist atoms
nav: 8.14
---

Jotai has an [atomWithStorage function in the utils bundle](../utilities/storage.mdx) for persistence that supports persisting state in `sessionStorage`, `localStorage`, `AsyncStorage`, or the URL hash.

(Note: This guide is a bit outdated and requires some rewrites.)

There are also several alternate implementations here:

### A simple pattern with localStorage

```js
const strAtom = atom(localStorage.getItem('myKey') ?? 'foo')

const strAtomWithPersistence = atom(
  (get) => get(strAtom),
  (get, set, newStr) => {
    set(strAtom, newStr)
    localStorage.setItem('myKey', newStr)
  },
)
```

### A helper function with localStorage and JSON parse

```js
const atomWithLocalStorage = (key, initialValue) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item)
    }
    return initialValue
  }
  const baseAtom = atom(getInitialValue())
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
    },
  )
  return derivedAtom
}
```

(Error handling should be added.)

### A helper function with AsyncStorage and JSON parse

This requires [onMount](../core/atom.mdx#onmount-property).

```js
const atomWithAsyncStorage = (key, initialValue) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ;(async () => {
      const item = await AsyncStorage.getItem(key)
      setValue(JSON.parse(item))
    })()
  }
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      AsyncStorage.setItem(key, JSON.stringify(nextValue))
    },
  )
  return derivedAtom
}
```

Don't forget to check out the [Async documentation](../guides/async.mdx) for more details on how to use async atoms.

### Example with sessionStorage

Same as AsyncStorage, just use `atomWithStorage` util and override the default storage with the `sessionStorage`

```js
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage(() => sessionStorage)
const someAtom = atomWithStorage('some-key', someInitialValue, storage)
```

### A serialize atom pattern

```tsx
type Actions =
  | { type: 'serialize'; callback: (value: string) => void }
  | { type: 'deserialize'; value: string }

const serializeAtom = atom(null, (get, set, action: Actions) => {
  if (action.type === 'serialize') {
    const obj = {
      todos: get(todosAtom).map(get),
    }
    action.callback(JSON.stringify(obj))
  } else if (action.type === 'deserialize') {
    const obj = JSON.parse(action.value)
    // needs error handling and type checking
    set(
      todosAtom,
      obj.todos.map((todo: Todo) => atom(todo)),
    )
  }
})

const Persist = () => {
  const [, dispatch] = useAtom(serializeAtom)
  const save = () => {
    dispatch({
      type: 'serialize',
      callback: (value) => {
        localStorage.setItem('serializedTodos', value)
      },
    })
  }
  const load = () => {
    const value = localStorage.getItem('serializedTodos')
    if (value) {
      dispatch({ type: 'deserialize', value })
    }
  }
  return (
    <div>
      <button onClick={save}>Save to localStorage</button>
      <button onClick={load}>Load from localStorage</button>
    </div>
  )
}
```

#### Examples

<Stackblitz id="vitejs-vite-zda5uw" file="src%2FApp.tsx" />

### A pattern with atomFamily

```tsx
type Actions =
  | { type: 'serialize'; callback: (value: string) => void }
  | { type: 'deserialize'; value: string }

const serializeAtom = atom(null, (get, set, action: Actions) => {
  if (action.type === 'serialize') {
    const todos = get(todosAtom)
    const todoMap: Record<string, { title: string; completed: boolean }> = {}
    todos.forEach((id) => {
      todoMap[id] = get(todoAtomFamily({ id }))
    })
    const obj = {
      todos,
      todoMap,
      filter: get(filterAtom),
    }
    action.callback(JSON.stringify(obj))
  } else if (action.type === 'deserialize') {
    const obj = JSON.parse(action.value)
    // needs error handling and type checking
    set(filterAtom, obj.filter)
    obj.todos.forEach((id: string) => {
      const todo = obj.todoMap[id]
      set(todoAtomFamily({ id, ...todo }), todo)
    })
    set(todosAtom, obj.todos)
  }
})

const Persist = () => {
  const [, dispatch] = useAtom(serializeAtom)
  const save = () => {
    dispatch({
      type: 'serialize',
      callback: (value) => {
        localStorage.setItem('serializedTodos', value)
      },
    })
  }
  const load = () => {
    const value = localStorage.getItem('serializedTodos')
    if (value) {
      dispatch({ type: 'deserialize', value })
    }
  }
  return (
    <div>
      <button onClick={save}>Save to localStorage</button>
      <button onClick={load}>Load from localStorage</button>
    </div>
  )
}
```

#### Examples

<Stackblitz id="vitejs-vite-z4kjv3" file="src%2FApp.tsx" />

