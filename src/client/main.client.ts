import { GameData } from "shared/modules/game_data";
import { SeedShop } from "./modules/seed_shop";
import { Event } from "./modules/event";
import { MainScreen } from "./modules/main_screen";
import { Backpack } from "./modules/backpack";

// Both Server and Client
GameData.Init();
Event.Init();

// ClientOnly
SeedShop.Init();
MainScreen.Init();
Backpack.Init();