export class StorageService {
    async storenotedata(d) {
        const value = await localStorage.setItem("note", JSON.stringify(d));
        return value;
    }
    async getnotedata() {
        const value = await localStorage.getItem("note");
        return value;
    }
}