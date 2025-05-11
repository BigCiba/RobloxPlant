import { Players } from "@rbxts/services";
import { NetData } from "./net_data";
import { Signal } from "shared/helper/signal";
import { Gui } from "./gui";
import { FormatTime } from "shared/helper/localization";
import { ipcClient } from '@rbxts/abstractify';
import { Event } from "./event";

export class SeedShop {
	static gui: Gui;
	static Init() {
		const restockTime = new Signal(300);
		NetData.ListenNetData("SeedShop", (data) => {
			SeedShop.RestockShop();
		}, Players.LocalPlayer);
		NetData.ListenNetData("SeedShopRestock", (data) => {
			restockTime.Set(data.time);
		});
		SeedShop.gui = new Gui("SeedShop2");
		SeedShop.gui.BindText(restockTime, "CD", (v) => "New seeds in " + FormatTime(v));

		const CloneUI1 = SeedShop.gui.GetNode<CloneUI1>("CloneUI1");
		const CloneUI2 = SeedShop.gui.GetNode<Frame>("CloneUI2");
		CloneUI1.Visible = false;
		CloneUI2.Visible = false;

		SeedShop.gui.BindButtonEvent("CloseButton", () => {
			Event.Emit('CloseShop');
		});
		SeedShop.gui.BindButtonEvent("RestockButton", () => {
			Event.Emit("RestockShop");
		});
		SeedShop.RestockShop();
	}
	static RestockShop() {
		const SeedShopList = NetData.GetNetData("SeedShop", Players.LocalPlayer) as SeedShopItem[];
		const playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui");
		if (playerGui === undefined) {
			warn("PlayerGui not found");
			return;
		}
		const SeedInfo = SeedShop.gui.GetNode<ScrollingFrame>("SeedInfo");
		const CloneUI1 = SeedShop.gui.GetNode<CloneUI1>("CloneUI1");
		SeedInfo.GetChildren().forEach((child) => {
			if (child.Name !== "CloneUI1" && child.Name !== "CloneUI2" && child.Name !== "UIListLayout") {
				child.Destroy();
			}
		});
		for (const [i, v] of ipairs(SeedShopList)) {
			const clone = CloneUI1.Clone();
			clone.Name = v.name;
			clone.SeedName.Text = v.name;
			clone.SeedGrade.TextLabel.Text = v.rarity;
			clone.SeedStockNum.Text = tostring(v.stock);
			clone.SeedStockPrice.Text = tostring(v.price);
			clone.Parent = SeedInfo;
			clone.Visible = true;
			clone.Activated.Connect(() => {
				// 购买种子
				Event.Emit("BuySeed", { index: i });
			});
		}
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