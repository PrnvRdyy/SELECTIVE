import { RuleEngine } from "@/content/engine";
import { InstagramReelsBlocker } from "./reels-blocker";
import { InstagramExploreBlocker } from "./explore-blocker";

const engine = new RuleEngine("instagram");

engine.register(new InstagramReelsBlocker());
engine.register(new InstagramExploreBlocker());

engine.start();
