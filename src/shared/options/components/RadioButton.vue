<template>
    <div class="TUICCheckBoxParent">
        <input type="radio" :id="`${id.replace(/\./g, '-_-')}-_-${valueName}`" :name="id.replace(/\./g, '-_-')" :value="valueName" :checked="TUICPref.getPref(id) == valueName" @change="changePref(id, valueName)" />
        <div>
            <label class="TUIC_setting_text" :for="`${id.replace(/\./g, '-_-')}-_-${valueName}`">{{ TUICI18N.get(name) }}</label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TUICI18N } from "@content/i18n";
import { TUICLibrary } from "@content/library";
import { TUICObserver } from "@content/observer";
import { TUICPref } from "@content/modules";

export default defineComponent({
    props: ["id", "valueName", "name"],
    setup() {
        const changePref = (path, valueName) => {
            TUICPref.setPref(path, valueName);
            TUICPref.save();
            TUICLibrary.getClasses.update();
            TUICObserver.observerFunction(null);
        };
        return { TUICI18N, TUICPref, changePref };
    },
});
</script>
