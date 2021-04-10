import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  GridItem,
  IconButton,
  Switch,
  Text,
  Tooltip,
  useColorMode,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useOutsideClick,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import SettingsStore from "../Stores/SettingsStore";

const DisabledTooltip = ({ condition, text }: { condition: boolean; text: string }) => (
  <Tooltip
    isDisabled={condition}
    label="Dark mode only"
    aria-label="dark mode tooltip"
    placement="auto"
  >
    <Text>{text}</Text>
  </Tooltip>
);

const SettingSlider = ({
  value,
  min,
  max,
  step,
  isDisabled,
  onChange,
  ariaLabel: label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  isDisabled: boolean;
  onChange: (newVal: number) => void;
  ariaLabel: string;
}) => (
  <Slider
    isDisabled={isDisabled}
    aria-label={label}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    step={step}
  >
    <SliderTrack>
      <SliderFilledTrack />
    </SliderTrack>
    <SliderThumb />
  </Slider>
);

export default function SettingsMenu() {
  const ref = useRef();

  const [open, setOpen] = useState(false);

  const [transparentMenu] = useMediaQuery("(min-width: 800px)");

  useOutsideClick({
    ref: ref as any,
    handler: (ev: any) => {
      let contains = false;
      for (const el of ev.path) {
        if (el.id == "settingsButton") {
          contains = true;
          break;
        }
      }
      if (!contains) {
        setOpen(false);
      }
    },
  });

  const { colorMode, toggleColorMode } = useColorMode();

  const settings = SettingsStore.useState((state) => state);
  const { blurLevel, brightnessLevel, fontSize, fontSpacing } = settings;

  useEffect(() => {
    const localSettings = localStorage.getItem("settings");

    // inefficient but who cares
    if (localSettings) {
      const parsedSettings = JSON.parse(localSettings);
      SettingsStore.update((state: any) => {
        for (const [key, _] of Object.entries(parsedSettings)) {
          state[key] = parsedSettings[key];
        }
      });
    }

    SettingsStore.subscribe(
      (state) => state,
      (newState) => {
        localStorage.setItem("settings", JSON.stringify(newState));
      }
    );
  }, []);

  const sliders = [
    {
      value: blurLevel,
      change: "blurLevel",
      title: "Blur level",
      min: 0,
      max: 50,
      step: 1,
      isDisabled: colorMode === "light",
      ariaLabel: "blur slider",
    },
    {
      value: brightnessLevel,
      change: "brightnessLevel",
      title: "Brightness",
      min: 10,
      max: 80,
      step: 5,
      isDisabled: colorMode === "light",
      ariaLabel: "brightness slider",
    },
    {
      value: fontSize,
      change: "fontSize",
      title: "Font size",
      min: 0.9,
      max: 1.4,
      step: 0.05,
      isDisabled: false,
      ariaLabel: "font size slider",
    },
    {
      value: fontSpacing,
      change: "fontSpacing",
      title: "Font spacing",
      min: 0,
      max: 15,
      step: 1,
      isDisabled: false,
      ariaLabel: "font spacing slider",
    },
  ];

  function logout() {
    localStorage.removeItem("auth");
    window.location.href = "./";
  }

  const chooseBackgroundColor = () => {
    if (colorMode == "dark" && transparentMenu) {
      return "transparent";
    }
    if (colorMode == "light") {
      return "white";
    }

    return "gray.800";
  };

  return (
    <>
      <IconButton
        id="settingsButton"
        aria-label="settings icon"
        icon={<FaCog />}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      />
      {open && (
        <VStack
          ref={ref as any}
          position="fixed"
          right="10px"
          top="60px"
          alignItems="right"
          p="10px"
          borderRadius="lg"
          borderWidth="1px"
          backgroundColor={chooseBackgroundColor()}
        >
          <Grid templateColumns="repeat(2, auto)" fontWeight="bold" gap="10px">
            <GridItem>
              <Text>Dark mode</Text>
            </GridItem>
            <GridItem>
              <Switch isChecked={colorMode === "dark" ? true : false} onChange={toggleColorMode} />
            </GridItem>
            <GridItem>
              <DisabledTooltip condition={colorMode === "dark"} text="Blurred background" />
            </GridItem>
            {sliders.map((slider, index): any => (
              <GridItem colSpan={2} key={index}>
                <DisabledTooltip condition={slider.isDisabled} text={slider.title} />
                <SettingSlider
                  value={slider.value}
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  isDisabled={slider.isDisabled}
                  ariaLabel={slider.ariaLabel}
                  onChange={(value) => {
                    SettingsStore.update((state: any) => {
                      state[slider.change] = value;
                    });
                  }}
                />
              </GridItem>
            ))}
          </Grid>
          <Button onClick={logout}>Log out</Button>
        </VStack>
      )}
    </>
  );
}
