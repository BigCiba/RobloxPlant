import { GameData } from "shared/modules/game_data";
import { SeedShop } from "./modules/seed_shop";
import { Event } from "./modules/event";

// Both Server and Client
GameData.Init();
Event.Init();

// ClientOnly
SeedShop.Init();