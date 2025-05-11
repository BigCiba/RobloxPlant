import { ipcClient } from "@rbxts/abstractify";

export class Event {
	static Init() { }
	static Emit<K extends keyof RemoteEventDeclare>(name: K, ...args: RemoteEventDeclare[K]): void {
		ipcClient.emit(name, ...args);
	}
}