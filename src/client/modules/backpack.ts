import { Gui } from "./gui";

export class Backpack {
	static gui: Gui;
	static Init() {
		Backpack.gui = new Gui("BackPack");
		Backpack.gui.BindButtonEvent("CloseButton", () => {
			Backpack.CloseBackpack();
		});
	}
	static OpenBackpack() {
		Backpack.gui.screenGui.Enabled = true;
	}
	static CloseBackpack() {
		Backpack.gui.screenGui.Enabled = false;
	}
}