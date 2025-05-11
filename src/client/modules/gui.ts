import { Players } from "@rbxts/services";
import { FormatTime } from "shared/helper/localization";
import { Signal } from "shared/helper/signal";

export class Gui {
	screenGui: ScreenGui;
	constructor(screenGuiName: string) {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
		this.screenGui = playerGui.WaitForChild(screenGuiName) as ScreenGui;
	}
	GetNode<T>(nodeName: string): T {
		return this.screenGui.FindFirstChild(nodeName, true) as T;
	}
	BindButtonEvent(nodeName: string, event: () => void) {
		this.GetNode<TextButton>(nodeName).Activated.Connect(() => {
			event();
		});
	}
	BindText<T>(signal: Signal<T>, nodeName: string, formatFn: (value: T) => string) {
		const label = this.GetNode<TextLabel>(nodeName);
		// 初始化时设置文本
		label.Text = formatFn(signal.Get());
		// 当 Signal 值更新时，更新文本
		signal.Connect((value) => {
			label.Text = formatFn(value);
		});
	}
}