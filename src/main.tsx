// @ts-expect-error handle later
import React, { Suspense, use } from "react";
import { createRoot } from "react-dom/client";

import { useSnapshot } from "../lib";
import { counterStore } from "./countreStore";
import { postsStore } from "./postsStore";

function Actions() {
  return (
    <div>
      <button type="button" onClick={() => counterStore.inc()}>
        inc
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
        chnage name
      </button>

      <button type="button" onClick={() => counterStore.$underive(['doubleCount'])}>$underive double_count</button>
      <button type="button" onClick={() => counterStore.$invalidate(['doubleCount'])}>$invalidate double_count</button>
    </div>
  );
}

function Name() {
  const counter = useSnapshot(counterStore);

  return <h2>{counter.full_name}</h2>;
}

function Count() {
  const counter = useSnapshot(counterStore);

  return <>
  <p>{counter.count}</p>
  <p>{counter.doubleCount}</p>
  </>;
}

function Posts() {
  const snap = useSnapshot(postsStore);

  return (
    <ul>
      {use(snap.posts)?.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <input type="number" onChange={(e) => postsStore.setUserId(e.target.value)} defaultValue={0} />
    {/* <Suspense fallback={<p>Loading...</p>}> */}
      <Posts />
    {/* </Suspense> */}
    <Name />
    <Count />
    <Actions />
  </React.StrictMode>
);
