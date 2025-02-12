import React from "react";
import { createRoot } from "react-dom/client";

import { counterStore } from "./countreStore";
import { _observer as observer, useObserve } from "tawr-state";
import { postsStore } from "./postsStore";
import { nestedStore } from "./nestedStore";

const NestedWrapper = () => {
  const user = useObserve(nestedStore.user);

  return (
    <div>
      <div>{user.profile.name}</div>
      <div>{user.profile.settings.theme}</div>
      <div>{user.stats.visits}</div>

      <div>
        <button type="button" onClick={() => nestedStore.user.profile.name = "wusaby"}>chnage name</button>
        <button type="button" onClick={() => nestedStore.user.profile.settings.theme = "new theme"}>chnage theme</button>
        <button type="button" onClick={() => nestedStore.user.stats.visits = 5000}>chnage stats</button>
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
        chnage name
      </button>
      <button type="button" onClick={() => counterStore.$underive(['doubleCount'])}>$underive double_count</button>
      <button type="button" onClick={() => counterStore.$invalidate(['doubleCount'])}>$invalidate double_count</button>
    </div>
  );
}

function Name() {
  const full_name = useObserve(counterStore.full_name)

  return <h2>{full_name} (using hook)</h2>;
}

export const ObservedName = observer(() => {
  console.log('observed name')
  return <h2>{counterStore.full_name} (using HoC)</h2>;
})

function Count() {
  const counter = useObserve(counterStore)

  return <>
    <p>count: {counter.count}</p>
    <p>double count: {counter.doubleCount}</p>
    <p>quadro count: {counter.quadroCount}</p>
  </>;
}

function Posts() {
  const posts = useObserve(postsStore)

  console.log('posts loading', posts.posts)
  // if (posts.randoms.isLoading) return <p>loading ...</p>
  if (posts.posts.isLoading) return <p>loading ...</p>


  return (
    <ul>
      {(posts as any).posts.value?.map((post: any) => <li key={post.id}>{post.title}</li>)}
      <p>randoms: {JSON.stringify(posts.randoms.value)}</p>
      <button type="button" onClick={() => posts.regenerate()}>regenerate</button>
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

// function Randoms() {
//   const posts = usePostsStore()

//   return <>
//     <p>randoms: {JSON.stringify(posts.randoms.value)}</p>
//     <button type="button" onClick={() => posts.regenerate()}>regenerate</button>
//   </>
// }

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <input type="number" onChange={(e) => postsStore.setUserId(Number(e.target.value))} defaultValue={1} />
    {/* <Suspense fallback={<p>loading ...</p>}> */}
    <Posts />
    {/* </Suspense> */}
    <Name />
    <ObservedName />
    <Count />
    <Actions />
    <NestedWrapper />
    {/* <Randoms /> */}
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