import { Players } from "@rbxts/services";
import { NetData } from "./net_data";
import { Event } from "shared/event";

export class SeedShop {
	static Init() {
		NetData.ListenNetData("SeedShop", (data: SeedShopItem[]) => {
			SeedShop.RestockShop();
		}, Players.LocalPlayer);
		const playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui");
		if (playerGui === undefined) {
			warn("PlayerGui not found");
			return;
		}
		const CloseButton = playerGui.WaitForChild("SeedShop2").FindFirstChild("CloseButton", true) as TextButton;
		const RestockButton = playerGui.WaitForChild("SeedShop2").FindFirstChild("RestockButton", true) as ImageButton;
		const CD = playerGui.WaitForChild("SeedShop2").FindFirstChild("CD", true) as TextLabel;
		const SeedInfo = playerGui.WaitForChild("SeedShop2").FindFirstChild("SeedInfo", true) as ScrollingFrame;
		const CloneUI1 = playerGui.WaitForChild("SeedShop2").FindFirstChild("CloneUI1", true) as CloneUI1;
		const CloneUI2 = playerGui.WaitForChild("SeedShop2").FindFirstChild("CloneUI2", true) as Frame;
		CloneUI1.Visible = false;
		CloneUI2.Visible = false;
		CloseButton.Activated.Connect(() => {
			Event.FireServer("CloseShop", {});
		});
		RestockButton.Activated.Connect(() => {
			Event.FireServer("RestockShop", {});
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
		const SeedInfo = playerGui.WaitForChild("SeedShop2").FindFirstChild("SeedInfo", true) as ScrollingFrame;
		const CloneUI1 = playerGui.WaitForChild("SeedShop2").FindFirstChild("CloneUI1", true) as CloneUI1;
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