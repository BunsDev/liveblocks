import { useMyPresence } from "./liveblocks.config";

export function Room() {
  const [myPresence, updateMyPresence] = useMyPresence();

  // Update cursor coordinates on pointer move

  // Set cursor to null on pointer leave

  return <div>Cursor: {JSON.stringify(myPresence.cursor)}</div>;
}
