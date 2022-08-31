

export interface SelectedItem {
    value: string,
    name: string,
    icon?: {
        icon: string,
        color?:string|undefined|null,
        hFlip?:boolean|undefined|null,
    } | undefined|null
}