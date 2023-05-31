import { createSignal, onCleanup, onMount, For, Show } from "solid-js";
import type { TypedRoom } from "../liveblocks.config";
import Avatar from "./components/Avatar.jsx";
import styles from "./App.module.css";

function App(props: { room: TypedRoom }) {
  const room = props.room;
  const [currentUser, setCurrentUser] = createSignal(room.getPresence());
  const [users, setUsers] = createSignal([]);
  const hasMoreUsers = () => users().length > 3;

  onMount(() => {
    const unsubscribePresence = room.subscribe("my-presence", (presence) => {
      setCurrentUser(presence);
    });

    const unsubscribeOthers = room.subscribe("others", (others) => {
      const othersWithPresence = others.filter((other) => other?.presence);
      setUsers(othersWithPresence);
    });

    onCleanup(() => {
      unsubscribePresence();
      unsubscribeOthers();
    });
  });

  return (
    <main class={styles.App}>
      <For each={users().slice(0, 3)}>
        {({ presence }) => (
          <Avatar picture={presence.picture} name={presence.name} />
        )}
      </For>

      <Show when={hasMoreUsers()}>
        <div class={styles.more}>+{users().length - 3}</div>
      </Show>

      <Show when={currentUser()}>
        <div class={styles.you}>
          <Avatar picture={currentUser().picture} name="You" />
        </div>
      </Show>
    </main>
  );
}

export default App;
