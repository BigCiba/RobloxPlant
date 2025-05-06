import { Event } from "shared/event";
import { SeedShop } from "./modules/seed_shop";

// Both Server and Client
Event.Initialize();

// ClientOnly
SeedShop.Init();
