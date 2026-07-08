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
import { subscribeSettings } from "./settings";
import { QuickAccessPanel } from "./QuickAccess";

export default definePlugin(() => {
  let unsubscribe: () => void = () => {};

  try {
    // Settings are already loaded synchronously from localStorage on import.
    applyStyles();
    startObserver();
    // Re-apply CSS + re-tag capsules whenever the user changes settings.
    unsubscribe = subscribeSettings(() => {
      applyStyles();
      tagCapsules();
    });
  } catch (e) {
    console.error("[GamePlatformIcons] init failed", e);
  }

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
