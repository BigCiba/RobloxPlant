import { RandomInt } from "shared/helper/math";
import { NetData } from "./net_data";
import { Players } from "@rbxts/services";
import { PlayerData } from "server/modules/player_data";
import { Event } from "./event";
import { GameData } from "shared/modules/game_data";
import { CWeightPool } from "shared/class/weight_pool";

export class SeedShop {
	static SeedShopList: Record<number, SeedShopItem[]> = {};
	static restockTime: number = 300;
	static Init() {
		Event.On("CloseShop", (player) => {
			SeedShop.CloseSeedShop(player);
		});
		Event.On("RestockShop", (player) => {
			SeedShop.RestockShop(player);
		});
		Event.On("BuySeed", (player, data) => {
			SeedShop.BuySeed(player, data);
		});
		Event.OnServer("PlayerAdded", (player) => {
			print("PlayerAdded", player.Name);
			SeedShop.RestockShop(player);
		});
		Event.OnServer("PlayerRemoving", (player) => {
			delete SeedShop.SeedShopList[player.UserId];
		});
		NetData.SetNetData("SeedShopRestock", { time: SeedShop.restockTime });
	}
	static RestockShop(player: Player) {
		SeedShop.SeedShopList[player.UserId] = [];
		const SeedData = GameData.GetGameData("SeedShop");
		for (const [k, v] of pairs(SeedData)) {
			const pool = new CWeightPool({});
			v.Stock.split(";").map(v => {
				const [value, weight] = v.split(",");
				pool.set(value, tonumber(weight) as number);
			});
			SeedShop.SeedShopList[player.UserId].push({
				name: v.SeedName,
				price: v.CoinsPrice,
				stock: tonumber(pool.random()) as number,
				rarity: v.Rate,
				icon: v.Icon,
			});
		}
		SeedShop.restockTime = 300;
		NetData.SetNetData("SeedShopRestock", { time: SeedShop.restockTime });
		NetData.SetNetData("SeedShop", SeedShop.SeedShopList[player.UserId], player);
	}
	static OpenSeedShop(player: Player) {
		const playerGui = player.FindFirstChildOfClass("PlayerGui");
		if (playerGui === undefined) {
			warn("PlayerGui not found");
			return;
		}
		playerGui.SeedShop2.Enabled = true;
	}
	static CloseSeedShop(player: Player) {
		const playerGui = player.FindFirstChildOfClass("PlayerGui");
		if (playerGui === undefined) {
			warn("PlayerGui not found");
			return;
		}
		playerGui.SeedShop2.Enabled = false;
	}
	static BuySeed(player: Player, data: { index: number; }) {
		const shopInfo = SeedShop.SeedShopList[player.UserId];
		const seedInfo = shopInfo[data.index - 1];
		if (seedInfo === undefined) return;
		if (seedInfo.stock <= 0) return;
		if (PlayerData.GetGold(player) < seedInfo.price) return;
		PlayerData.ModifyGold(player, seedInfo.price);
		seedInfo.stock -= 1;
		NetData.SetNetData("SeedShop", SeedShop.SeedShopList[player.UserId], player);
	}
}
// 更新商店
spawn(() => {
	while (wait(1)) {
		SeedShop.restockTime -= 1;
		if (SeedShop.restockTime <= 0) {
			for (const [userid, data] of pairs(SeedShop.SeedShopList)) {
				SeedShop.RestockShop(Players.GetPlayerByUserId(userid) as Player);
			}
			SeedShop.restockTime = 300;
		}
		NetData.SetNetData("SeedShopRestock", { time: SeedShop.restockTime });
	}
});