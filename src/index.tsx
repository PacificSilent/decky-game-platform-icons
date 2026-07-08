import { staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { FaGamepad } from "react-icons/fa6";
import {
  applyStyles,
  removeStyles,
  startObserver,
  stopObserver,
  tagCapsules,
} from "./cardBadges";
import { loadSettings, subscribeSettings } from "./settings";
import { QuickAccessPanel } from "./QuickAccess";

export default definePlugin(() => {
  let unsubscribe: () => void = () => {};

  const init = async () => {
    await loadSettings();
    applyStyles();
    startObserver();
    // Re-apply CSS + re-tag capsules whenever the user changes settings.
    unsubscribe = subscribeSettings(() => {
      applyStyles();
      tagCapsules();
    });
  };

  init().catch((e) => console.error("[GamePlatformIcons] init failed", e));

  return {
    name: "Game Platform Icons",
    titleView: (
      <div className={staticClasses.Title}>Game Platform Icons</div>
    ),
    content: <QuickAccessPanel />,
    icon: <FaGamepad />,
    onDismount() {
      try {
        unsubscribe();
        stopObserver();
        removeStyles();
      } catch (e) {
        console.error("[GamePlatformIcons] unload failed", e);
      }
    },
  };
});
