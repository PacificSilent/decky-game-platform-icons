import os
import json
import asyncio

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo and add the
# `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in
# `.vscode/settings.json`
import decky

SETTINGS_FILE = "settings.json"

# Default settings applied the first time the plugin runs (or when the saved
# file is missing/corrupt). The frontend owns the real schema; the backend only
# stores and returns whatever JSON-serialisable object it is given.
DEFAULT_SETTINGS = {
    "enabled": True,
    "position": "top-right",
    "size": 34,
    "opacity": 0.95,
    "showOnHome": True,
    "useColor": True,
    "showChip": True,
    "autoDetect": True,
    "overrides": {},
}


class Plugin:
    def _settings_path(self) -> str:
        return os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, SETTINGS_FILE)

    # Read the persisted settings, falling back to defaults for any missing key
    # so the frontend always receives a complete object.
    async def get_settings(self) -> dict:
        path = self._settings_path()
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, dict):
                    merged = dict(DEFAULT_SETTINGS)
                    merged.update(data)
                    # `overrides` must always be a dict.
                    if not isinstance(merged.get("overrides"), dict):
                        merged["overrides"] = {}
                    return merged
        except Exception as e:
            decky.logger.error(f"Failed to read settings: {e}")
        return dict(DEFAULT_SETTINGS)

    # Persist the full settings object sent by the frontend.
    async def save_settings(self, settings: dict) -> bool:
        path = self._settings_path()
        try:
            os.makedirs(decky.DECKY_PLUGIN_SETTINGS_DIR, exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(settings, f, indent=2)
            return True
        except Exception as e:
            decky.logger.error(f"Failed to save settings: {e}")
            return False

    async def _main(self):
        self.loop = asyncio.get_event_loop()
        decky.logger.info("Game Platform Icons: backend loaded")

    async def _unload(self):
        decky.logger.info("Game Platform Icons: backend unloaded")
        pass

    async def _uninstall(self):
        decky.logger.info("Game Platform Icons: uninstalled")
        pass

    async def _migration(self):
        # Migrate any legacy settings that lived under ~/.config before the
        # decky settings dir was standardised. Safe no-op when nothing exists.
        decky.migrate_settings(
            os.path.join(decky.DECKY_HOME, "settings", "game-platform-icons.json"),
            os.path.join(decky.DECKY_USER_HOME, ".config", "decky-game-platform-icons"),
        )
