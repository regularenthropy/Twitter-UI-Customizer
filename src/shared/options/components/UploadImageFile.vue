<template>
    <input type="file" accept="image/*" class="TUIC_setting_text TUICSelectImg" @change="changeCustomCSS()" ref="twitterIcon" />
    <p class="TUIC_setting_text">{{ TUICI18N.get("twitterIcon-nowIcon") }}</p>
    <span id="TUICIcon_IconImg" class="TUICUploadedImg"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { applyCustomIcon, applySystemCss } from "@content/applyCSS";
import { TUICI18N } from "@content/i18n";
import EMPTY from "@content/icons/logo/empty.svg?url";

import { TUICPref } from "@content/modules";

export default defineComponent({
    setup() {
        return { TUICI18N };
    },
    methods: {
        async changeCustomCSS() {
            if (this.$refs.twitterIcon.files.length >= 1) {
                await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        localStorage.setItem(`TUIC_IconImg`, reader.result);
                        const element = document.createElement("canvas");
                        element.height = 200;
                        element.width = 200;
                        const context = element.getContext("2d");
                        context.beginPath();
                        context.arc(100, 100, 100, (0 * Math.PI) / 180, (360 * Math.PI) / 180);
                        context.clip();
                        const image = new Image();
                        image.onload = function () {
                            context.beginPath();
                            context.drawImage(this, 0, 0, this.naturalHeight, this.naturalWidth, 0, 0, 200, 200);
                            localStorage.setItem(`TUIC_IconImg_Favicon`, element.toDataURL());
                            resolve(null);
                        };
                        image.src = reader.result;
                    });
                    reader.readAsDataURL(this.$refs.twitterIcon.files[0]);
                });
            } else {
                localStorage.setItem(`TUIC_IconImg`, "");
                localStorage.setItem(`TUIC_IconImg_Favicon`, "");
            }

            applySystemCss();
            applyCustomIcon();
            if (TUICPref.getPref("twitterIcon") == "custom" && TUICPref.getPref("otherBoolSetting.faviconSet")) {
                const imageURL = localStorage.getItem(TUICPref.getPref("otherBoolSetting.roundIcon") ? "TUIC_IconImg_Favicon" : "TUIC_IconImg");
                document.querySelector<HTMLLinkElement>(`[rel="shortcut icon"]`).href = imageURL ?? chrome.runtime.getURL(EMPTY);
            }
        },
    },
});
</script>

<style scoped></style>
