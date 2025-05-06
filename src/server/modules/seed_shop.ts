import { SeedData } from "shared/game_data/seed";
import { RandomInt } from "shared/helper/math";
import { NetData } from "./net_data";
import { Players } from "@rbxts/services";
import { Event } from "shared/event";

export class SeedShop {
	static SeedShopList: Record<number, SeedShopItem[]> = {};
	static Init() {
		Event.RegisterServerEvent("CloseShop", (player: Player) => {
			SeedShop.CloseSeedShop(player);
		});
		Event.RegisterServerEvent("RestockShop", (player: Player) => {
			SeedShop.RestockShop(player);
		});
		Event.BindEvent("PlayerAdded", (data) => {
			SeedShop.RestockShop(data.player);
		});
		Event.BindEvent("PlayerRemoving", (data) => {
			delete SeedShop.SeedShopList[data.player.UserId];
		});
	}
	static RestockShop(player: Player) {
		SeedShop.SeedShopList[player.UserId] = [];
		for (const [k, v] of pairs(SeedData)) {
			SeedShop.SeedShopList[player.UserId].push({
				name: k,
				price: v.price,
				stock: RandomInt(v.stock[0], v.stock[1]),
				rarity: v.rarity,
			});
		}
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
	static OnBuySeed(player: Player, index: number) {

	}
}

interface SeedShopItem {
	/** 物品名 */
	name: string;
	/** 价格 */
	price: number;
	/** 库存 */
	stock: number;
	/** 物品类型 */
	rarity: string;
	/** 物品图标 */
	icon?: string;
}