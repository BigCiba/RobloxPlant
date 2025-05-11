import { ipcServer } from "@rbxts/abstractify";

/** 事件模块 */
export class Event {
	/** 事件实例的存放文件夹，abstractify库会创建这个文件夹 */
	static RemoteEventsFolder: Instance;
	/** 事件缓存 */
	static EventMap: Map<string, BindableEvent> = new Map();
	static Init() {
		Event.RemoteEventsFolder = ipcServer.eventLocation;
	}

	/** 发给客户端 */
	static Emit<
		K extends keyof RemoteEventDeclare,
		T extends RemoteEventDeclare[K]
	>(name: K, target: Player, ...args: T): Promise<void> {
		return ipcServer.emit(name, target, ...args);
	}
	/** 接收客户端发来的事件 */
	static On<
		K extends keyof RemoteEventDeclare,
		T extends RemoteEventDeclare[K]
	>(name: K, callback: (player: Player, ...args: T) => any): Promise<RBXScriptConnection> {
		return ipcServer.on(name, callback);
	}
	/** 广播给所有客户端 */
	static Broadcast<
		K extends keyof RemoteEventDeclare,
		T extends RemoteEventDeclare[K]
	>(name: K, ...args: T): void {
		ipcServer.broadcast(name, ...args);
	}

	// 暂时不用
	// static Fire<
	// 	K extends keyof RemoteEventDeclare,
	// 	T extends RemoteEventDeclare[K]
	// >(object: RemoteEvent, target: Player, ...args: T): void {
	// 	ipcServer.fire(object, target, ...args);
	// }
	// static FireBroad<
	// 	K extends keyof RemoteEventDeclare,
	// 	T extends RemoteEventDeclare[K]
	// >(object: RemoteEvent, ...args: T): void {
	// 	ipcServer.fireBroad(object, ...args);
	// }
	// static Connect(object: RemoteEvent, callback: (...args: unknown[]) => any): RBXScriptConnection {
	// 	return ipcServer.connect(object, callback);
	// }
	// static GetEvent<
	// 	K extends keyof RemoteEventDeclare,
	// >(name: K): RemoteEvent {
	// 	return ipcServer.getEvent(name);
	// }
	// static GetEventLocation(): Instance {
	// 	return ipcServer.eventLocation;
	// }

	// 服务端同端通信
	static EmitServer<
		K extends keyof BindableEventDeclare,
		T extends BindableEventDeclare[K]
	>(name: K, ...args: T): void {
		Event.GetBindableEvent(name).Fire(...args);
	}
	/** 接收服务器消息 */
	static OnServer<
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