import { HttpService, ReplicatedStorage } from "@rbxts/services";
const NetDataInstance = ReplicatedStorage.WaitForChild("NetDataInstance") as IntValue;

export class NetData {
	static GetNetData(key: string) {
		return HttpService.JSONDecode(NetDataInstance.GetAttribute(key) as string);
	}
	static UseNetData(key: string) {

	}
}