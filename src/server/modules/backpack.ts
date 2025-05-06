import { DataStoreService } from "@rbxts/services";
const BackpackStore = DataStoreService.GetDataStore("BackpackStore");

/**
 * 背包类，玩家拥有数字键0-9的快捷背包，还有容量100的仓库背包
 */
export class Backpack {
	player: Player;
	maxSlot: number = 110;
	backpackList: { [slot: number]: BackpackItemProp; } = {};
	constructor(player: Player) {
		this.player = player;
		const [success, data] = pcall(() => {
			return BackpackStore.GetAsync("backpack_" + player.UserId);
		});
		if (success) {
			if (data !== undefined) {
				this.backpackList = data as { [slot: number]: BackpackItemProp; };
			}
		} else {
			warn("GetAsync failed");
		}
	}
}

interface BackpackItemProp {
	/** 物品名 */
	name: string;
	/** 物品数量 */
	count: number;
	/** 索引位置 */
	slot: number;
}