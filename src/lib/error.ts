import { $, $$ } from "./utils"

export const errorReset = (root: HTMLElement) => {
    $$('p[data-error]', root).forEach(p => { p.hidden = true; p.textContent = '' })
}

export const errorSet = (root: HTMLElement, name: string, msg: string) => {
    const p = $(`p[data-error="${name}"]`, root)
    p.hidden = false
    p.textContent = msg
}    