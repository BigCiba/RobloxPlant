import { SeedShop } from "./modules/seed_shop";
import { Players } from "@rbxts/services";
import { PlayerData } from "./modules/player_data";
import { NetData } from "./modules/net_data";
import { Event } from "./modules/event";
import { GameData } from "shared/modules/game_data";

// Both Server and Client
GameData.Init();
Event.Init();

// ServerOnly
NetData.Init();
PlayerData.Init();
SeedShop.Init();

Players.PlayerAdded.Connect((player) => {
	Event.EmitServer("PlayerAdded", player);
});
Players.PlayerRemoving.Connect((player) => {
	Event.EmitServer("PlayerRemoving", player);
});