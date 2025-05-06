import { HttpService, Players, ReplicatedStorage } from "@rbxts/services";
const NetDataInstance = ReplicatedStorage.WaitForChild("NetDataInstance") as IntValue;
NetDataInstance.AttributeChanged.Connect((key: string) => {
	const data = HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string);
	if (NetData.callbackList[key] !== undefined) {
		for (const callback of NetData.callbackList[key]) {
			callback(data);
		}
	}
});
Players.LocalPlayer.AttributeChanged.Connect((key: string) => {
	const data = HttpService.JSONDecode(Players.LocalPlayer.GetAttribute(key) as string);
	if (NetData.playerCallbackList[key] !== undefined) {
		for (const callback of NetData.playerCallbackList[key]) {
			callback(data);
		}
	}
});
export class NetData {
	static callbackList: Record<string, ((data: any) => void)[]> = {};
	static playerCallbackList: Record<string, ((data: any) => void)[]> = {};
	static GetNetData(key: string, player?: Player) {
		if (player) {
			return HttpService.JSONDecode(player.GetAttribute(key) as string);
		} else {
			return HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string);
		}
	}
	static ListenNetData(key: string, callback: (data: any) => void, player?: Player) {
		if (player) {
			if (NetData.playerCallbackList[key] === undefined) {
				NetData.playerCallbackList[key] = [];
			}
			NetData.playerCallbackList[key].push(callback);
		} else {
			if (NetData.callbackList[key] === undefined) {
				NetData.callbackList[key] = [];
			}
			NetData.callbackList[key].push(callback);
		}
	}
}