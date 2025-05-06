import { HttpService, ReplicatedStorage } from "@rbxts/services";

const NetDataInstance = new Instance("IntValue");
NetDataInstance.Name = "NetDataInstance";
NetDataInstance.Parent = ReplicatedStorage;

export class NetData {
	static SetNetData(key: string, value: any, player?: Player) {
		if (player) {
			player.SetAttribute(key, HttpService.JSONEncode(value));
		} else {
			NetDataInstance.SetAttribute(key, HttpService.JSONEncode(value));
		}
	}
	static GetNetData(key: string, player?: Player) {
		if (player) {
			return HttpService.JSONDecode(player.GetAttribute(key) as string);
		} else {
			return HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string);
		}
	}
}