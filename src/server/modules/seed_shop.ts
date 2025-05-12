import { RandomInt } from "shared/helper/math";
import { NetData } from "./net_data";
import { Players } from "@rbxts/services";
import { PlayerData } from "server/modules/player_data";
import { Event } from "./event";
import { GameData } from "shared/modules/game_data";
import { CWeightPool } from "shared/class/weight_pool";
import { RemapValClamped, Round } from "shared/helper/lualib";

export class SeedShop {
	static SeedShopList: Record<number, SeedShopItem[]> = {};
	static restockTime: number = 300;
	static Init() {
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
			const res = v.Stock.split(";").map(v => {
				const [value, weight] = v.split(",");
				return [value, weight];
			});
			const minValue = tonumber(res[0][0]) as number;
			const minWeight = tonumber(res[0][1]) as number;
			const maxValue = tonumber(res[1][0]) as number;
			const maxWeight = tonumber(res[1][1]) as number;

			for (let i = minValue; i <= maxValue; i++) {
				pool.set(tostring(i), Round(RemapValClamped(i, minValue, maxValue, minWeight, maxWeight)));
			}

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