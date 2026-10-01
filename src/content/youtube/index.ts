import { RuleEngine } from "@/content/engine";
import { YouTubeShortsBlocker } from "./shorts-blocker";
import { YouTubeHomeBlocker } from "./home-blocker";

const engine = new RuleEngine("youtube");

engine.register(new YouTubeShortsBlocker());
engine.register(new YouTubeHomeBlocker());

engine.start();
