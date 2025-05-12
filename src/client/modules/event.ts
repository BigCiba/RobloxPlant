import { ipcClient } from "@rbxts/abstractify";

export class Event {
	/** 事件实例的存放文件夹，abstractify库会创建这个文件夹 */
	static RemoteEventsFolder: Instance;
	/** 事件缓存 */
	static EventMap: Map<string, BindableEvent> = new Map();
	static Init() {
		Event.RemoteEventsFolder = ipcClient.eventLocation;
	}
	static Emit<K extends keyof RemoteEventDeclare>(name: K, ...args: RemoteEventDeclare[K]): void {
		ipcClient.emit(name, ...args);
	}

	// 服务端同端通信
	static EmitClient<
		K extends keyof BindableEventDeclare,
		T extends BindableEventDeclare[K]
	>(name: K, ...args: T): void {
		Event.GetBindableEvent(name).Fire(...args);
	}
	/** 接收服务器消息 */
	static OnClient<
		K extends keyof BindableEventDeclare,
		T extends BindableEventDeclare[K]
	>(name: K, callback: (...args: T) => any) {
		Event.GetBindableEvent(name).Event.Connect(callback);
	}

	/** 获取一个BindableEvent，如果没有就创建 */
	static GetBindableEvent<
		K extends keyof BindableEventDeclare,
	>(name: K): BindableEvent {
		if (Event.EventMap.has(name)) {
			return Event.EventMap.get(name)!;
		} else {
			const event = new Instance("BindableEvent");
			event.Name = name;
			event.Parent = Event.RemoteEventsFolder;
			Event.EventMap.set(name, event);
			return event;
		}
	}
}