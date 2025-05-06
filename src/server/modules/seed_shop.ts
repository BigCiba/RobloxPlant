import { SeedData } from "shared/game_data/seed";
import { RandomInt } from "shared/helper/math";
import { NetData } from "./net_data";

export class SeedShop {
	static SeedShopList: SeedShopItem[] = [];
	static Init() {
		for (const [k, v] of pairs(SeedData)) {
			this.SeedShopList.push({
				name: k,
				price: v.price,
				stock: RandomInt(v.stock[0], v.stock[1]),
				rarity: v.rarity,
			});
		}

		NetData.SetNetData("SeedShop", this.SeedShopList);
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