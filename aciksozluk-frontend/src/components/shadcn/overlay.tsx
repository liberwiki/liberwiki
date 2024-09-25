import React, {createContext, ReactNode, useContext} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/shadcn/popover";
import {Sheet, SheetContent, SheetTrigger} from "@/components/shadcn/sheet";
import {cn, tailwindConfig} from "@/lib/utils";
import _ from "lodash";

export enum OverlayType {
  Popover = "popover",
  Sheet = "sheet",
}

const OverlayContext = createContext({overlayType: OverlayType.Popover});

const OverlayProvider = ({overlayType, children}: { overlayType: OverlayType; children: ReactNode }) => {
  return (
    <OverlayContext.Provider value={{overlayType}}>
      {children}
    </OverlayContext.Provider>
  );
};

interface OverlayProps extends React.ComponentProps<typeof Popover>, React.ComponentProps<typeof Sheet> {
  children: ReactNode;
  breakpoint: keyof typeof tailwindConfig.theme.screens;
  displayType?: string;
}


export function Overlay({children, breakpoint, displayType="block"}: OverlayProps) {
  // breakpoint:displayType must be in safelist in tailwind configuration for this to work
  return (
    <>
      <OverlayProvider overlayType={OverlayType.Popover}>
        <div className={`hidden ${breakpoint}:${displayType} h-full`}>
          <Popover>{children}</Popover>
        </div>
      </OverlayProvider>
      <OverlayProvider overlayType={OverlayType.Sheet}>
        <div className={`block ${breakpoint}:hidden h-full`}>
          <Sheet>{children}</Sheet>
        </div>
      </OverlayProvider>
    </>
  );
}

interface OverlayTriggerProps extends React.ComponentProps<typeof PopoverTrigger>, React.ComponentProps<typeof SheetTrigger> {
  children: ReactNode;
}


export function OverlayTrigger({children, ...props}: OverlayTriggerProps) {
  const {overlayType} = useContext(OverlayContext);

  const TriggerComponents = {
    [OverlayType.Popover]: PopoverTrigger,
    [OverlayType.Sheet]: SheetTrigger,
  };

  const SelectedTriggerComponent = TriggerComponents[overlayType];

  return (
    <SelectedTriggerComponent asChild {...props}>{children}</SelectedTriggerComponent>
  );
}


interface OverlayContentProps extends React.ComponentProps<typeof PopoverContent>, React.ComponentProps<typeof SheetContent> {
  side: "top" | "bottom" | "left" | "right" | undefined
  children: ReactNode;
  popoverContentProps?: React.ComponentProps<typeof PopoverContent>;
  sheetContentProps?: React.ComponentProps<typeof SheetContent>;
}

export function OverlayContent({children, ...props}: OverlayContentProps) {
  const {overlayType} = useContext(OverlayContext);
  const {
    popoverContentProps,
    sheetContentProps,
    className,
    style,
    ...remainingProps
  } = props;

  const ContentComponents = {
    [OverlayType.Popover]: PopoverContent,
    [OverlayType.Sheet]: SheetContent,
  };

  const ContentProps = {
    [OverlayType.Popover]: {
      className: cn(className, popoverContentProps?.className),
      style:  {...style, ...popoverContentProps?.style},
      ...remainingProps,
      ..._.omit(popoverContentProps, ["className", "style"]),
    },
    [OverlayType.Sheet]: {
      className: cn(className, sheetContentProps?.className),
      style: {...style, ...sheetContentProps?.style},
      ...remainingProps,
      ..._.omit(sheetContentProps, ["className", "style"]),
    },
  };

  const SelectedContent = ContentComponents[overlayType];
  const contentProps = ContentProps[overlayType] as OverlayContentProps;

  return (
    <SelectedContent {...contentProps}>{children}</SelectedContent>
  );
}
