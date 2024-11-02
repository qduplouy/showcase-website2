"use client";

import { Fragment, useState } from "react";

import { Locale } from "@/locales/config";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/locales/dictionaries";

import Image from "next/image";
import { OFFER_IMAGES } from "./images";

export function DesktopTimeline({ locale }: { locale: Locale }) {
    const [selected, setSelected] = useState<number>(0);

    // Need to listen for arrows

    const t = getDictionary(locale).pages.offer.timeline;
    return (
        <>
            <div className="flex h-full flex-col items-center w-fit">
                <div className="h-[10px] w-[2px] bg-primary" />
                {t.steps.map(({ title }, i) => (
                    <Fragment key={i}>
                        <Button
                            variant="ghost"
                            className={cn("border-[2px] w-full border-primary", selected === i ? "bg-primary hover:bg-primary" : "")}
                            key={i}
                            onClick={() => setSelected(i)}
                        >
                            <p>{title}</p>
                        </Button>
                        <div className="h-[10px] w-[2px] bg-primary" />
                    </Fragment>
                ))}
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-primary" />
            </div>
            <div className="h-full flex flex-col items-center space-y-8">
                <Image src={OFFER_IMAGES[selected]} width={300} height={300} alt="" />
                <p className="h-[250px]">{t.steps[selected].text}</p>
            </div>
        </>
    );
}
