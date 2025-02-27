import { useMemo } from "react";

export const EMOJIS = ["🤓", "😈", "😇", "🥳", "🍺", "😩", "😍", "😭", "🎺", "⭐", "😁", "😋", "😎", "🥰", "😍", "😀", "😆", "😉", "🤩", "🥱"];

function useEmoji(){
    const randEmoji = useMemo(() =>{
        return EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    }, []);

    return randEmoji;
}

export default useEmoji;