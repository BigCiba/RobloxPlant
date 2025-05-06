import { DataStoreService, Players } from "@rbxts/services";

const playerDataStore = DataStoreService.GetDataStore("PlayerDataStore");

interface PlayerDataProp {
	Gold: number;
	PetTicket: number;
}

export class PlayerData {
	/** 自动保存间隔 */
	static autoSaveTime: number = 30;
	/** 本地缓存 */
	static sessionData: { [userid: number]: PlayerDataProp; } = {};

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
}

// 自动保存
spawn(() => {
	while (wait(PlayerData.autoSaveTime)) {
		for (const [userid, data] of pairs(PlayerData.sessionData)) {
			PlayerData.SaveData(userid);
		}
	}
});

Players.PlayerAdded.Connect((player) => {
	// 初始化玩家数据
	PlayerData.InitData(player);
});
Players.PlayerRemoving.Connect((player) => {
	PlayerData.SaveData(player.UserId);
	delete PlayerData.sessionData[player.UserId];
});