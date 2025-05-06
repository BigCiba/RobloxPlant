import { Workspace } from "@rbxts/services";
import { SeedShop } from "./modules/seed_shop";

const PETSSHOP = Workspace.FindFirstChild("PETSSHOP", true);
const SEEDSHOP = Workspace.FindFirstChild("SEEDSHOP", true);
const SELLSHOP = Workspace.FindFirstChild("SELLSHOP", true);

const petPrompt = new Instance("ProximityPrompt");
petPrompt.Parent = PETSSHOP;
petPrompt.Triggered.Connect((player) => {
	// local SeedShopManager = require(player.PlayerGui.SeedShop2.SeedShopManager)
	// SeedShopManager:OpenShop()
	print("open pet shop");
	SeedShop.OpenSeedShop(player);
});
const seedPrompt = new Instance("ProximityPrompt");
seedPrompt.Parent = SEEDSHOP;
seedPrompt.Triggered.Connect((player) => {
	// local SeedShopManager = require(player.PlayerGui.SeedShop2.SeedShopManager)
	// SeedShopManager:OpenShop()
	print("open seed shop");
});
const sellPrompt = new Instance("ProximityPrompt");
sellPrompt.Parent = SELLSHOP;
sellPrompt.Triggered.Connect((player) => {
	// local SeedShopManager = require(player.PlayerGui.SeedShop2.SeedShopManager)
	// SeedShopManager:OpenShop()
	print("open sell shop");
});