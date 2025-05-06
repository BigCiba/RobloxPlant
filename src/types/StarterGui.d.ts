interface StarterGui extends Instance {
	SeedShop2: ScreenGui & {
		SeedShop: Frame & {
			Info: Frame & {
				SeedInfo: Frame & {
					CloneUI1: CloneUI1;
					CloneUI2: TextButton;
				};
			};
		};
	};
}
interface PlayerGui extends StarterGui { }
interface CloneUI1 extends ImageButton {
	SeedName: TextLabel;
	SeedIcon: ImageLabel;
	SeedGrade: ImageLabel & {
		TextLabel: TextLabel;
	};
	SeedStockNum: TextLabel;
	SeedStockPrice: TextLabel;
}