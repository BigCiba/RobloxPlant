import { HttpService, ReplicatedStorage } from "@rbxts/services";

const NetDataInstance = new Instance("IntValue");
NetDataInstance.Name = "NetDataInstance";
NetDataInstance.Parent = ReplicatedStorage;

export class NetData {
	static Init() { }
	static SetNetData<
		K extends keyof NetDataDeclare,
		T extends NetDataDeclare[K],
	>(key: K, value: T, player?: Player) {
		if (player) {
			player.SetAttribute(key, HttpService.JSONEncode(value));
		} else {
			NetDataInstance.SetAttribute(key, HttpService.JSONEncode(value));
		}
	}
	static GetNetData<
		K extends keyof NetDataDeclare,
		T extends NetDataDeclare[K],
	>(key: K, player?: Player): T {
		if (player) {
			return HttpService.JSONDecode(player.GetAttribute(key) as string) as T;
		} else {
			return HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string) as T;
		}
	}
}