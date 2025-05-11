import { DataStoreService, Players } from "@rbxts/services";
import { Event } from "./event";

const playerDataStore = DataStoreService.GetDataStore("PlayerDataStore");

interface PlayerDataProp {
	Gold: number;
	PetTicket: number;
}

/** 玩家数据模块 */
export class PlayerData {
	/** 自动保存间隔 */
	static autoSaveTime: number = 30;
	/** 本地缓存 */
	static sessionData: { [userid: number]: PlayerDataProp; } = {};
	static Init() {
		Event.OnServer("PlayerAdded", (player) => {
			print("PlayerAdded", player.Name);
			// 初始化玩家数据
			PlayerData.InitData(player);
		});
		Event.OnServer("PlayerRemoving", (player) => {
			print("PlayerRemoving", player.Name);
			// 保存玩家数据并移除缓存
			PlayerData.SaveData(player.UserId);
			delete PlayerData.sessionData[player.UserId];
		});
	}
	static GetData(player: Player): PlayerDataProp {
		if (PlayerData.sessionData[player.UserId] === undefined) {
			PlayerData.sessionData[player.UserId] = {
				Gold: 0,
				PetTicket: 0,
			};
		}
		return PlayerData.sessionData[player.UserId];
	}

	static InitData(player: Player) {
		const userid = player.UserId;
		const [success, data] = pcall(() => {
			return playerDataStore.GetAsync("Player_" + player.UserId);
		});
		if (success) {
			PlayerData.sessionData[userid] = (data ?? {
				Gold: 0,
				PetTicket: 0,
			}) as PlayerDataProp;
			this.SyncClientData(player);
		} else {
			warn("GetAsync failed");
		}

	}

	/** 同步数据到客户端 */
	static SyncClientData(player: Player) {
		const [success] = pcall(() => {
			for (const [k, v] of pairs(this.sessionData[player.UserId])) {
				player.SetAttribute(k, v);
			}
		});
		if (!success) {
			warn("SyncClientData failed");
		}
	}

	/** 保存数据到Roblox服务器 */
	static SaveData(userid: number) {
		const data = PlayerData.sessionData[userid];
		const [success] = pcall(() => {
			playerDataStore.SetAsync("Player_" + userid, data);
		});
		if (success) {
			print("SaveData success");
		} else {
			warn("SaveData failed");
		}
	}

	static GetGold(player: Player): number {
		return PlayerData.GetData(player).Gold;
	}
	static GetPetTicket(player: Player): number {
		return PlayerData.GetData(player).PetTicket;
	}
	static ModifyGold(player: Player, value: number) {
		const data = PlayerData.GetData(player);
		data.Gold += value;
		player.SetAttribute("Gold", data.Gold);
	}
	static ModifyPetTicket(player: Player, value: number) {
		const data = PlayerData.GetData(player);
		data.PetTicket += value;
		player.SetAttribute("PetTicket", data.PetTicket);
	}
}

// 自动保存
spawn(() => {
	while (wait(PlayerData.autoSaveTime)) {
		for (const [userid, data] of pairs(PlayerData.sessionData)) {
			PlayerData.SaveData(userid);
		}
	}
});