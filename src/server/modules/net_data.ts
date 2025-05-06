import { HttpService, ReplicatedStorage } from "@rbxts/services";

const NetDataInstance = new Instance("IntValue");
NetDataInstance.Name = "NetDataInstance";
NetDataInstance.Parent = ReplicatedStorage;

export class NetData {
	static SetNetData(key: string, value: any) {
		NetDataInstance.SetAttribute(key, HttpService.JSONEncode(value));
	}
	static GetNetData(key: string) {
		return HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string);
	}
}