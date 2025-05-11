import { ReplicatedStorage } from "@rbxts/services";

interface GameDataDeclare {
	SeedShop: {
		[id: string]: {
			ID: string;
			Note: string;
			SeedName: string;
			Icon: string;
			Rate: string;
			CoinsPrice: number;
			RobuxPrice: number;
			RobuxID: string;
			Stock: string;
		};
	};
}

/** 游戏配置模块 */
export class GameData {
	static GameData: GameDataDeclare;
	static Init() {
		GameData.GameData = require(ReplicatedStorage.WaitForChild("GameData").WaitForChild("GameData") as ModuleScript) as GameDataDeclare;
	}
	/** 获取物品的配置信息 */
	static GetGameData<
		K extends keyof GameDataDeclare,
	>(name: K) {
		return GameData.GameData[name];
	}
}