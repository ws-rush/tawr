import React from "react";
import { createRoot } from "react-dom/client";

import { counterStore } from "./countreStore";
import { _observer as observer, useObserve } from "tawr-state";
import { postsStore } from "./postsStore";
import { nestedStore } from "./nestedStore";

const NestedWrapper = () => {
  const user = useObserve(() => nestedStore.user);

  return (
    <div>
      <div>{user.profile.name}</div>
      <div>{user.profile.settings.theme}</div>
      <div>{user.stats.visits}</div>

      <div>
        <button type="button" onClick={() => nestedStore.user.profile.name = "wusaby"}>change name</button>
        <button type="button" onClick={() => nestedStore.user.profile.settings.theme = "new theme"}>change theme</button>
        <button type="button" onClick={() => nestedStore.user.stats.visits = 5000}>change stats</button>
      </div>
    </div>
  );
};

function Actions() {
  return (
    <div>
      <button type="button" onClick={() => counterStore.inc()}>
        inc
      </button>
      <button type="button" onClick={() => counterStore.asyncInc()}>
        async inc
      </button>
      <button type="button" onClick={() => counterStore.dec()}>
        dec
      </button>
      <button type="button" onClick={() => counterStore.incBy(2)}>
        inc by 2
      </button>
      <button
        type="button"
        onClick={() => counterStore.rename("rush", "wusaby")}
      >
        change name
      </button>
      <button type="button" onClick={() => counterStore.$underive(['doubleCount'])}>$underive double_count</button>
      <button type="button" onClick={() => counterStore.$invalidate(['doubleCount'])}>$invalidate double_count</button>
    </div>
  );
}

function Name() {
  const full_name = useObserve(() => counterStore.full_name);
  return <h2>{full_name} (using hook)</h2>;
}

export const ObservedName = observer(() => {
  console.log('observed name');
  return <h2>{counterStore.full_name} (using HoC)</h2>;
});

function Count() {
  const counter = useObserve(() => counterStore);

  return <>
    <p>count: {counter.count}</p>
    <p>double count: {counter.doubleCount}</p>
    <p>quadro count: {counter.quadroCount}</p>
  </>;
}

function Posts() {
  const [posts, randoms] = useObserve(() => [postsStore.posts, postsStore.randoms]);

  console.log('posts loading', posts);
  if (posts.isLoading) return <p>loading ...</p>;

  return (
    <ul>
      {posts.value?.map((post: any) => <li key={post.id}>{post.title}</li>)}
      <p>randoms: {JSON.stringify(randoms.value)}</p>
      <button type="button" onClick={() => postsStore.regenerate()}>regenerate</button>
    </ul>
  );
}

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <input type="number" onChange={(e) => postsStore.setUserId(Number(e.target.value))} defaultValue={1} />
    <Posts />
    <Name />
    <ObservedName />
    <Count />
    <Actions />
    <NestedWrapper />
  </React.StrictMode>
);
