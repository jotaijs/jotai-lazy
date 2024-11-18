# jotai-lazy

> Jotai lazy evaluation React hook

👻🥱

## Installation

```bash
npm install jotai-lazy
```

## Usage

### large `useAtom` wrapper function for hooks

```tsx
import { useAtom } from "jotai";

export function useChat() {
  const [messages] = useAtom(messagesAtom);
  const [isPending] = useAtom(isPendingAtom);
  const [input, setInput] = useAtom(inputAtom);
  // ... more atoms

  return {
    messages,
    isPending,
    input,
    setInput,
    // ... more atoms
  };
}
```

In this case, every time `useChat` is called, all atoms are evaluated.
This is not efficient if only a few atoms are used in the component.

```tsx
const MessageList = () => {
  // we only need `messages` and `isPending` in this component, but all atoms are mounted and will be re-evaluated every time one of them changes
  const { messages, isPending } = useChat();
  return (
    <div>
      {isPending && <p>Loading...</p>}
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
    </div>
  );
};
```

After:

```tsx
import { useAtom } from "jotai-lazy";

// before
export function useChat() {
  const messagesObject = useAtom(messagesAtom);
  const isPendingObject = useAtom(isPendingAtom);
  const inputObject = useAtom(inputAtom);
  // ... more atoms

  return {
    get messages() {
      return messagesObject[0];
    },
    get isPending() {
      return isPendingObject[0];
    },
    get input() {
      return inputObject[0];
    },
    setInput: inputObject[1],
    // ... more atoms
  };
}
```

## LICENSE

MIT