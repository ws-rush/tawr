import React from "react";
import { createRoot } from "react-dom/client";

import { asyncInc, counterStore, dec, inc, incBy, rename, useCounterStore } from "./countreStore";
import { setUserId } from "./postsStore";
import { Awaitable } from "tawr-state";

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
        onClick={() => rename("rush", "wusaby")}
      >
        chnage name
      </button>
      <button type="button" onClick={() => counterStore.$underive(['doubleCount'])}>$underive double_count</button>
      <button type="button" onClick={() => counterStore.$invalidate(['doubleCount'])}>$invalidate double_count</button>
    </div>
  );
}

function Name() {
  const counter = useCounterStore()

  return <h2>{counter.full_name}</h2>;
}

function Count() {
  const counter = useCounterStore()

  return <>
  <p>count: {counter.count}</p>
  <p>double count: {counter.doubleCount}</p>
  <p>quadro count: {counter.quadroCount}</p>
  </>;
}

const data = {
  resolve: new Promise((resolveit) => setTimeout(() => {
    resolveit([{ id: 1, title: 'test' }, { id: 2, title: 'test2' }])
  }, 2000))
};

function Posts({ resolve }: any) {


  const myresolve = resolve

  return (
    <ul>
      <Awaitable resolve={myresolve}
         // fallback={<p>loading ...</p>}
         error={(e) => <p>{e.message}</p>} 
         children={(posts) => (posts as any).map((post: any) => <li key={post.id}>{post.title}</li>)} />
    </ul>
  );
}

// function Posts() {
//   const snap = usePostsStore();

//   const resolve = new Promise((resolveit) => setTimeout(() => resolveit([{ id: 1, title: 'test' }, { id: 2, title: 'test2' }]), 1000));

//   // check if it promise or not
//   const posts = resolve instanceof Promise ?  use(resolve) : resolve;

//   return (
//     <ul>
//       {
//         // check if it promise or not
//         posts.map((post: any) => <li key={post.id}>{post.title}</li>)
//       }
//       {/* <Awaitable resolve={snap.posts}
//         // fallback={<p>loading ...</p>}
//         error={(e) => <p>{e.message}</p>} 
//         children={(posts) => posts.map((post) => <li key={post.id}>{post.title}</li>)} /> */}
//     </ul>
//   );
// }

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <input type="number" onChange={(e) => setUserId(Number(e.target.value))} defaultValue={1} />
    {/* <Suspense fallback={<p>loading ...</p>}> */}
      <Posts resolve={data.resolve} />
    {/* </Suspense> */}
    <Name />
    <Count />
    <Actions />
  </React.StrictMode>
);

// counterStore.$onAction(({
//   name,
//   args,
//   after,
//   onError,
// }) => {
//   const startTime = Date.now();
//   console.log(`Start "${name}" with params [${args.join(', ')}].`);

//   after((result) => {
//     console.log(
//       `Finished "${name}" after ${
//         Date.now() - startTime
//       }ms.\nResult: ${result}.`
//     );
//   });

//   onError((error) => {
//     console.warn(
//       `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
//     );
//   });
// });