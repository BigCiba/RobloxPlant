interface RemoteEventDeclare {
	CloseShop: [];
	RestockShop: [];
	BuySeed: [{ index: number; }];
}
interface BindableEventDeclare {
	PlayerAdded: [Player];
	PlayerRemoving: [Player];
}