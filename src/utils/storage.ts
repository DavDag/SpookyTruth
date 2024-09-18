class Storage {
    public Store<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    public Retrieve<T>(key: string, def: T | null = null) {
        const item = localStorage.getItem(key)
        if (item) {
            return JSON.parse(item) as T
        }
        return def
    }
}

export const MyStorage = new Storage()
