import decky


class Plugin:
    """Frontend-only plugin: all the work happens in the Steam client UI.

    Settings are stored in the client's localStorage, so the backend just logs
    lifecycle events to make problems visible in ~/homebrew/logs.
    """

    async def _main(self):
        decky.logger.info("Game Platform Icons loaded")

    async def _unload(self):
        decky.logger.info("Game Platform Icons unloaded")

    async def _uninstall(self):
        decky.logger.info("Game Platform Icons uninstalled")
