import { Event } from "shared/event";
import { SeedShop } from "./modules/seed_shop";
import { Players } from "@rbxts/services";
import { PlayerData } from "./player_data.server";

print("Hello from main.server.ts");
// Both Server and Client
Event.Initialize();

// ServerOnly
SeedShop.Init();

Players.PlayerAdded.Connect((player) => {
	Event.FireEvent("PlayerAdded", { player });
});
Players.PlayerRemoving.Connect((player) => {
	Event.FireEvent("PlayerRemoving", { player });
});