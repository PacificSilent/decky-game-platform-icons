import {
  DropdownItem,
  DropdownOption,
  Field,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ToggleField,
} from "@decky/ui";
import { FC, useReducer } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { tagCapsules } from "./cardBadges";
import { getUserCollections } from "./collections";
import {
  matchPlatform,
  Platform,
  PLATFORMS_SORTED,
  PlatformGroup,
} from "./platforms";
import {
  BadgePosition,
  NONE_PLATFORM,
  setOverride,
  updateSettings,
  useSettings,
} from "./settings";

const AUTO = "__auto__";

const POSITION_OPTIONS: DropdownOption[] = [
  { data: "top-left", label: "Arriba · izquierda" },
  { data: "top-right", label: "Arriba · derecha" },
  { data: "bottom-left", label: "Abajo · izquierda" },
  { data: "bottom-right", label: "Abajo · derecha" },
];

const GROUP_ORDER: PlatformGroup[] = [
  "Nintendo",
  "Sony",
  "Microsoft",
  "Sega",
  "Retro",
  "PC & Stores",
  "Other",
];

const PlatformLabel: FC<{ platform: Platform }> = ({ platform }) => {
  const Icon = platform.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <Icon size={16} color={platform.color} />
      <span>{platform.label}</span>
    </span>
  );
};

function platformGroupOptions(): DropdownOption[] {
  return GROUP_ORDER.map((g) => ({
    label: g,
    options: PLATFORMS_SORTED.filter((p) => p.group === g).map((p) => ({
      data: p.id,
      label: <PlatformLabel platform={p} />,
    })),
  })).filter((grp) => (grp.options as DropdownOption[]).length > 0);
}

export const QuickAccessPanel: FC = () => {
  const settings = useSettings();
  const [, forceRefresh] = useReducer((x: number) => x + 1, 0);

  const collections = getUserCollections();
  const platformOptions = platformGroupOptions();
  const badgedCount = collections.filter((c) => {
    const ov = settings.overrides[c.id];
    if (ov === NONE_PLATFORM) return false;
    if (ov) return true;
    return settings.autoDetect && matchPlatform(c.name) != null;
  }).length;

  return (
    <>
      <PanelSection title="General">
        <PanelSectionRow>
          <ToggleField
            label="Activar iconos"
            description="Muestra el logo de plataforma en las cards"
            checked={settings.enabled}
            onChange={(v) => updateSettings({ enabled: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Detección automática"
            description="Asigna el logo según el nombre de la colección (ej. «Xbox 360» → Xbox)"
            checked={settings.autoDetect}
            onChange={(v) => updateSettings({ autoDetect: v })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Apariencia">
        <PanelSectionRow>
          <DropdownItem
            label="Posición"
            rgOptions={POSITION_OPTIONS}
            selectedOption={settings.position}
            onChange={(o) => updateSettings({ position: o.data as BadgePosition })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            label="Tamaño"
            value={settings.size}
            min={16}
            max={64}
            step={2}
            showValue
            valueSuffix="px"
            onChange={(v) => updateSettings({ size: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            label="Opacidad"
            value={Math.round(settings.opacity * 100)}
            min={30}
            max={100}
            step={5}
            showValue
            valueSuffix="%"
            onChange={(v) => updateSettings({ opacity: v / 100 })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Fondo (chip)"
            description="Dibuja un recuadro de color detrás del logo"
            checked={settings.showChip}
            onChange={(v) => updateSettings({ showChip: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Color de marca"
            description={
              settings.showChip
                ? "El chip usa el color de cada plataforma"
                : "El logo se pinta con el color de cada plataforma"
            }
            checked={settings.useColor}
            onChange={(v) => updateSettings({ useColor: v })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField
            label="Mostrar en Inicio"
            description="También en los carruseles de la pantalla de Inicio"
            checked={settings.showOnHome}
            onChange={(v) => updateSettings({ showOnHome: v })}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Colecciones">
        <PanelSectionRow>
          <Field
            label={`${collections.length} colecciones · ${badgedCount} con logo`}
            icon={<FaArrowsRotate />}
            focusable
            onClick={() => {
              tagCapsules();
              forceRefresh();
            }}
            bottomSeparator="none"
          >
            Refrescar
          </Field>
        </PanelSectionRow>

        {collections.length === 0 ? (
          <PanelSectionRow>
            <Field description="No se encontraron colecciones. Crea categorías en tu biblioteca (mantén pulsado un juego → Administrar → Colecciones) y aparecerán aquí." />
          </PanelSectionRow>
        ) : (
          collections.map((c) => {
            const detected = matchPlatform(c.name);
            const autoLabel = detected
              ? `Automático · ${detected.label}`
              : "Automático (sin coincidencia)";
            const rgOptions: DropdownOption[] = [
              { data: AUTO, label: autoLabel },
              { data: NONE_PLATFORM, label: "Ocultar logo" },
              ...platformOptions,
            ];
            const selected = settings.overrides[c.id] ?? AUTO;
            return (
              <PanelSectionRow key={c.id}>
                <DropdownItem
                  label={c.name}
                  menuLabel={c.name}
                  rgOptions={rgOptions}
                  selectedOption={selected}
                  onChange={(o) =>
                    setOverride(c.id, o.data === AUTO ? null : (o.data as string))
                  }
                />
              </PanelSectionRow>
            );
          })
        )}
      </PanelSection>
    </>
  );
};
