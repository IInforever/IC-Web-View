<!--
  - Copyright (c) IInfo 2022 All rights reserved.
  -->

<template>
  <BasicFramework
    :auth="auth"
    :loading="isFrameLoading"
    title="Hello, IClipboard"
    @logout="logout"
  >
    <el-form
      ref="inputs"
      :model="postForm"
      :rules="rules"
      :status-icon="false"
      style="text-align: left"
    >
      <el-form-item prop="content">
        <el-input
          v-model="postForm.content"
          :autosize="{ minRows: 10, maxRows: 30 }"
          maxlength="5000"
          placeholder="PUT TEXT HERE"
          resize="none"
          show-word-limit
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="Subject" label-width="80px" prop="title">
        <el-input
          v-model="postForm.title"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="Type" label-width="80px" prop="type">
        <el-select v-model="postForm.type" placeholder="Type">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Expire" label-width="80px" prop="expireDuration">
        <el-select v-model="postForm.expireDuration">
          <el-option label="10min" value="600"></el-option>
          <el-option label="30min" value="1800"></el-option>
          <el-option label="1h" value="3600"></el-option>
          <el-option label="2h" value="3600"></el-option>
          <el-option label="5h" value="18000"></el-option>
          <el-option label="12h" value="43200"></el-option>
          <el-option label="1day" value="86400"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Password" label-width="80px" prop="passwd">
        <el-input
          v-model="postForm.passwd"
          :show-password="true"
          maxlength="32"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="Private" label-width="80px">
        <el-tooltip
          :disabled="auth === 0"
          content="login require"
          effect="light"
          placement="right"
        >
          <el-switch
            v-model="isPrivate"
            :disabled="auth !== 0 || isAnonymous"
            active-color="#13ce66"
            active-text="Y"
            inactive-text="N"
            inline-prompt
          ></el-switch>
        </el-tooltip>
      </el-form-item>

      <el-form-item v-if="auth === 0" label="Anonymous" label-width="80px">
        <el-switch
          v-model="isAnonymous"
          :disabled="auth !== 0"
          active-color="#13ce66"
          active-text="Y"
          inactive-text="N"
          inline-prompt
          @click="isPrivate = false"
        ></el-switch>
      </el-form-item>

      <el-form-item label-width="80px">
        <el-button
          :loading="isButtonLoading"
          type="primary"
          @click="createPaste"
          >Create</el-button
        >
      </el-form-item>

      <vue-recaptcha
        ref="recaptcha"
        :recaptchaHost="RECAPTCHA_HOST"
        :sitekey="SITE_KEY"
        size="invisible"
        @error="onError"
        @expred="onExpired"
        @render="onRender"
        @verify="onVerify"
      ></vue-recaptcha>
    </el-form>
  </BasicFramework>
</template>

<script setup>
import { RECAPTCHA_HOST, SITE_KEY } from "../config/config";
import { VueRecaptcha } from "vue-recaptcha";
import { CheckSession } from "../utility/auth";
import BasicFramework from "../components/BasicFramework.vue";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { post } from "../utility/request";

// router
const router = useRouter();

// variables
let isPrivate = ref(false);
let auth = ref(CheckSession());
let isAnonymous = ref(auth.value !== 0);

const isFrameLoading = ref(true);
let isButtonLoading = ref(false);

let isRecaptchaExpired = ref(true);
let recaptchaResponse = ref("");

const postForm = ref({
  content: "",
  type: "raw",
  passwd: "",
  expireDuration: "600",
  title: "",
});

// $refs
const inputs = ref(null);
const recaptcha = ref(null);

// Lifecycle
onMounted(() => {
  setTimeout(() => {
    if (isFrameLoading.value)
      ElMessage({
        message: "Error: Fail to load recaptcha components",
        type: "error",
      });
  }, 5000);
});

// methods
const logout = () => {
  auth.value = -1;
  isPrivate.value = false;
  isAnonymous.value = true;
  ElMessage({
    message: "logged out",
    type: "success",
  });
};

const onRender = (id) => {
  isFrameLoading.value = false;
  console.log("[recaptcha] loaded. (" + id + ")");
};

const onVerify = (response) => {
  recaptchaResponse.value = response;
  isRecaptchaExpired.value = false;
  createPaste();
};

const onError = () => {
  ElMessage({
    message: "Recaptcha check fail, please try again",
    type: "warning",
  });
  isButtonLoading.value = false;
};

const onExpired = () => {
  isRecaptchaExpired.value = true;
  isButtonLoading.value = false;
};

const recaptchaReset = () => {
  isRecaptchaExpired.value = true;
  recaptcha.value.reset();
};

const createPaste = async () => {
  try {
    await inputs.value.validate();
  } catch (e) {
    ElMessage({
      message: "Invalid inputs",
      type: "warning",
    });
    return;
  }
  if (isRecaptchaExpired.value) {
    recaptcha.value.execute();
    return;
  }
  isButtonLoading.value = true;

  let url, headers;
  if (isAnonymous.value) {
    url = "/api/pastes/anonymous";
    headers = {
      "Recaptcha-Token": recaptchaResponse.value,
    };
  } else {
    url = "/api/pastes";
    headers = {
      "Recaptcha-Token": recaptchaResponse.value,
      Authorization: localStorage.getItem("auth-token"),
    };
  }

  // remove blank form items
  let data = {};
  for (const key in postForm.value) {
    if (postForm.value[key] !== "") data[key] = postForm.value[key];
  }

  if (!isAnonymous.value && auth.value === 0) data.isPrivate = isPrivate.value;

  await post(
    url,
    data,
    headers,
    (response) => {
      let id = response.data.id.toString(36);
      ElMessage({
        message: "Create success, ID: " + id,
        type: "success",
      });
      setTimeout(() => {
        router.push({ name: "pastes", params: { id: id } });
      }, 1000);
    },
    {
      hook: () => {
        setTimeout(() => {
          recaptchaReset();
          isButtonLoading.value = false;
        }, 1000);
      },
    }
  );
};

const rules = {
  content: {
    required: true,
    message: "Please input text",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "Please select type",
  },
  expireDuration: {
    required: true,
    message: "Please select expire time",
  },
  passwd: {
    min: 4,
    max: 32,
    message: "Length should be 4 to 32",
    trigger: "blur",
  },
  title: {
    max: 20,
    message: "Subject length should be less than 20",
    trigger: "blur",
  },
};

const typeOptions = [
  {
    value: "raw",
    label: "Plain Text",
  },
  {
    value: "md",
    label: "Markdown",
  },
  {
    value: "yaml",
    label: "YAML",
  },
  {
    value: "c",
    label: "C",
  },
  {
    value: "cxx",
    label: "C++",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "js",
    label: "JavaScript",
  },
  {
    value: "json",
    label: "JSON",
  },
  {
    value: "html",
    label: "HTML",
  },
  {
    value: "css",
    label: "CSS",
  },
  {
    value: "bash",
    label: "Bash",
  },
];
</script>

<style scoped></style>
