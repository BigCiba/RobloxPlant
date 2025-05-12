import { Players, Workspace } from "@rbxts/services";
import { Gui } from "./gui";
import { Signal } from "shared/helper/signal";
import { Event } from "./event";
import { Backpack } from "./backpack";


export class MainScreen {
	static gui: Gui;
	static Init() {
		// 传送
		const PETS_SHOP_TRANS = Workspace.FindFirstChild("PETSSHOP", true)?.WaitForChild("Trans") as Part;
		const SEED_SHOP_TRANS = Workspace.FindFirstChild("SEEDSHOP", true)?.WaitForChild("Trans") as Part;
		const SELL_SHOP_TRANS = Workspace.FindFirstChild("SELLSHOP", true)?.WaitForChild("Trans") as Part;
		MainScreen.gui = new Gui("ScreenGui");
		MainScreen.gui.BindButtonEvent("Garden", () => {
			Players.LocalPlayer.Character?.PivotTo(new CFrame(PETS_SHOP_TRANS.Position));
		});
		MainScreen.gui.BindButtonEvent("Seed", () => {
			Players.LocalPlayer.Character?.PivotTo(new CFrame(SEED_SHOP_TRANS.Position));
		});
		MainScreen.gui.BindButtonEvent("Sell", () => {
			Players.LocalPlayer.Character?.PivotTo(new CFrame(SELL_SHOP_TRANS.Position));
		});

		// 资源
		const coin = new Signal(Players.LocalPlayer.GetAttribute("Gold"));
		Players.LocalPlayer.GetAttributeChangedSignal("Gold").Connect(() => {
			coin.Set(Players.LocalPlayer.GetAttribute("Gold"));
		});
		MainScreen.gui.BindText(coin, "CoinTextLabel", (v) => tostring(v));

		const ticket = new Signal(Players.LocalPlayer.GetAttribute("PetTicket"));
		Players.LocalPlayer.GetAttributeChangedSignal("PetTicket").Connect(() => {
			ticket.Set(Players.LocalPlayer.GetAttribute("PetTicket"));
		});
		MainScreen.gui.BindText(ticket, "TicketTextLabel", (v) => tostring(v));

		// 背包
		MainScreen.gui.BindButtonEvent("BackpackButton", () => {
			Backpack.OpenBackpack();
		});
	}
}