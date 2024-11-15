// @ts-expect-error handle later
import React, { Suspense, use } from "react";
import { createRoot } from "react-dom/client";

import { useSnapshot } from "../lib";
import { asyncInc, counterStore, dec, inc, incBy } from "./countreStore";
import { postsStore } from "./postsStore";

function Actions() {
  return (
    <div>
      <button type="button" onClick={() => inc()}>
        inc
      </button>
      <button type="button" onClick={() => asyncInc()}>
        async inc
      </button>
      <button type="button" onClick={() => dec()}>
        dec
      </button>
      <button type="button" onClick={() => incBy(2)}>
        inc by 2
      </button>
      <button
        type="button"
        onClick={() => counterStore.actions.rename("rush", "wusaby")}
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
    <input type="number" onChange={(e) => postsStore.actions.setUserId(e.target.value)} defaultValue={0} />
    {/* <Suspense fallback={<p>Loading...</p>}> */}
      <Posts />
    {/* </Suspense> */}
    <Name />
    <Count />
    <Actions />
  </React.StrictMode>
);

const unsubscribe = counterStore.$onAction(({
  name,
  args,
  after,
  onError,
}) => {
  const startTime = Date.now();
  console.log(`Start "${name}" with params [${args.join(', ')}].`);

  after((result) => {
    console.log(
      `Finished "${name}" after ${
        Date.now() - startTime
      }ms.\nResult: ${result}.`
    );
  });

  onError((error) => {
    console.warn(
      `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
    );
  });
});