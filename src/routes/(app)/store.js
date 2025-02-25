import { writable } from "svelte/store";

export const buttonPressed = writable(false);

export function changeTheLayout() {
    buttonPressed.update(value => !value);
}

// this will change layout on all pages 