import browser from "webextension-polyfill";

import { TUICData } from "./data.ts";
import { TUICLibrary } from "./library.ts";
import { isSafemode } from "./safemode.ts";

import { DOG, TWITTER, X } from "./icons/index.ts";
import { TUICPref } from "./modules/index.ts";

export function addCssElement() {
    document.querySelector("#twitter_ui_customizer_css")?.remove();
    document.querySelector("#twitter_ui_customizer")?.remove();

    const twitterHead = document.querySelector("head");

    const elemSYSCSS = document.createElement("style");
    elemSYSCSS.id = "twitter_ui_customizer";
    twitterHead.appendChild(elemSYSCSS);
    applySystemCss();

    if (!isSafemode) {
        const customCssElement = document.createElement("style");
        customCssElement.id = "twitter_ui_customizer_css";
        twitterHead.appendChild(customCssElement);
        applyCustomCss();
    }
}

export function applyDataCss() {
    document.querySelector("#twitter_ui_customizer_cssData")?.remove();
    const twitterHead = document.querySelector("head");

    const elemDataCSS = document.createElement("style");
    elemDataCSS.id = "twitter_ui_customizer_cssData";
    twitterHead.appendChild(elemDataCSS);
    elemDataCSS.textContent = `
    .TUICTwitterIcon_Dog {
        background-image: url('${browser.runtime.getURL(DOG)}');
    }
    .TUICTwitterIcon_Twitter {
        --TUIC-twitter-icon: url('${browser.runtime.getURL(TWITTER)}') !important;
    }
    .TUICTwitterIcon_X {
        --TUIC-twitter-icon:url('${browser.runtime.getURL(X)}') !important;
    }`;
}

export function applyCustomIcon() {
    document.querySelector("#twitter_ui_customizer_cssCustomIcon")?.remove();
    const twitterHead = document.querySelector("head");

    const dataCssElement = document.createElement("style");
    dataCssElement.id = "twitter_ui_customizer_cssCustomIcon";
    twitterHead.appendChild(dataCssElement);
    dataCssElement.textContent = `
    .TUICTwitterIcon_IconImg,
    #TUICIcon_IconImg {
        background-image: url('${localStorage.getItem("TUIC_IconImg") ?? ""}');
    }`;
}

export function applySystemCss() {
    const backgroundColor = TUICLibrary.backgroundColorCheck();

    const settingsArr = [
        "sidebarSetting.buttonConfigsmallerSidebarContent",
        "otherBoolSetting.roundIcon",
        "invisibleItems.subscribe-profile",
        "invisibleItems.hideBelowDM",
        "tweetDisplaySetting.bottomSpace",
        "sidebarSetting.buttonConfig.sidebarNoneScrollbar",
        "tweetDisplaySetting.noNumberBottomTweetButtons",
        "accountSwitcher.icon",
        "accountSwitcher.nameID",
        "accountSwitcher.moreMenu",
        "profileSetting.tabs.pinnedTab",
        "uncategorizedSettings.disableBackdropFilter",
        "composetweet.hideDraft",
    ];
    let settingsOutput = "|";
    for (const elem of settingsArr) {
        if (TUICPref.getPref(elem)) {
            settingsOutput += elem + "|";
        }
    }
    document.documentElement.setAttribute("TUICSettings", settingsOutput);

    const r = document.querySelector(":root");
    if (r instanceof HTMLElement) {
        const rs = r.style;

        for (const elem in TUICData.colors) {
            for (const el of ["background", "border", "color"]) {
                if (TUICData.colors[elem][el]) {
                    rs.setProperty(`--twitter-${elem}-${el}`, TUICLibrary.color.getColorFromPref(elem, el, null));
                }
            }
        }

        rs.setProperty("--twitter-TUIC-color", TUICData.styleColor[backgroundColor].textColor);
        rs.setProperty("--TUIC-container-background", TUICData.styleColor[backgroundColor].containerBackground);
        rs.setProperty("--TUIC-container-background2", TUICData.styleColor[backgroundColor].containerBackground2);
        rs.setProperty("--TUIC-color-hover-efect", TUICData.styleColor[backgroundColor].colorHover);

        rs.setProperty("--TUIC-sidebar-hover-color", TUICLibrary.backgroundColorCheck() == "light" ? "rgba(15,20,25,0.1)" : "rgba(247,249,249,0.1)");
        rs.setProperty("--TUIC-sidebar-active-color", TUICLibrary.backgroundColorCheck() == "light" ? "rgba(15,20,25,0.2)" : "rgba(247,249,249,0.2)");
        rs.setProperty("--TUIC-sidebar-focus-color", TUICLibrary.backgroundColorCheck() == "light" ? "rgb(135,138,140)" : "rgb(251,252,252)");

        rs.setProperty("--TUIC-detail-border", TUICData.styleColor[backgroundColor].detailBorder);

        rs.setProperty("--TUIC-pinnedTab-background", `rgba(${TUICLibrary.backgroundColorClass("0, 0, 0, 0.65", "21, 32, 43, 0.75", "255, 255, 255, 0.85")})`);

        rs.setProperty("--TUIC-pinnedTab-top", `${TUICLibrary.fontSizeClass("47", "49", "52", "57", "63")}px`);
    }
}

export function applyCustomCss() {
    document.querySelector("#twitter_ui_customizer_css").textContent = localStorage.getItem("TUIC_CSS");
}
