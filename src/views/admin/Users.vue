<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <div>
    <transition mode="out-in" name="fade">
      <el-skeleton v-if="isLoading" animated></el-skeleton>
      <div v-else>
        <el-empty v-if="empty"></el-empty>
        <el-table
          v-else
          :border="true"
          :data="userData"
          :height="tableHeight"
          :stripe="true"
          fit
        >
          <el-table-column label="ID" prop="id" />
          <el-table-column label="Username" prop="name" />
          <el-table-column label="Email" prop="email" />
          <el-table-column label="Password" prop="passwd" />
          <el-table-column label="Last Login Time" prop="lastLoginTime" />
          <el-table-column label="Create Time" prop="createTime" />
          <el-table-column fixed="right" label="Operations" width="100">
            <template #default="scope">
              <el-button
                :icon="Edit"
                circle
                size="small"
                type="primary"
                @click="handleUpdate(scope.row)"
              ></el-button>
              <el-button
                :icon="Delete"
                circle
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
    <el-drawer
      ref="drawer"
      v-model="isDrawerOpen"
      :direction="isLarge ? 'rtl' : 'btt'"
      size="45%"
      title="Modify"
    >
      <el-form ref="form" :model="rowData" :rules="rules" label-width="100px">
        <el-form-item label="ID">
          <el-input v-model="rowData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Username" prop="name">
          <el-input v-model="rowData.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="rowData.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="passwd">
          <el-input
            v-model="rowData.passwd"
            placeholder="New Password, allow blank"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitUpdate">submit</el-button>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { Delete, Edit } from "@element-plus/icons-vue";
import { ref } from "vue";

const drawer = ref(null);
const form = ref(null);

const rules = {
  name: [
    {
      required: true,
      message: "Please input username",
      trigger: "blur",
    },
    {
      min: 1,
      max: 15,
      message: "Length of username should between 4 to 15",
      trigger: "blur",
    },
  ],
  passwd: [
    {
      min: 4,
      max: 40,
      message: "Length of password should between 4 to 40",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Please input email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Invalid email",
      trigger: "blur",
    },
  ],
};
</script>

<script>
import { CheckSession, UpdateToken } from "../../utility/auth";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";

export default {
  name: "Users",
  data() {
    return {
      tableHeight: window.innerHeight - 160,
      isLoading: true,
      userData: [],
      empty: false,
      rowData: {},
      currentRow: {},
      isDrawerOpen: false,
      isLarge: window.innerWidth > 768,
    };
  },
  methods: {
    onResize() {
      this.tableHeight = window.innerHeight - 160;
      this.isLarge = window.innerWidth > 768;
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row)); // deep copy
      this.rowData.passwd = undefined;
      this.rowData.lastLoginTime = undefined;
      this.isDrawerOpen = true;
      this.currentRow = row;
    },
    submitUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let id = this.rowData.id;
          let data = {
            name: this.rowData.name,
            email: this.rowData.email,
            passwd: this.rowData.passwd,
          };
          console.log(data);
          axios
            .patch("/api/admin/users/" + id, data, {
              headers: {
                Authorization: localStorage.getItem("admin-token"),
              },
            })
            .then((response) => {
              UpdateToken(response);
              if (data.passwd) {
                // update row
                axios
                  .get("/api/admin/users/" + id, {
                    headers: {
                      Authorization: localStorage.getItem("admin-token"),
                    },
                  })
                  .then((r) => {
                    this.currentRow.name = r.data.name;
                    this.currentRow.email = r.data.email;
                    this.currentRow.passwd = r.data.passwd;
                    this.currentRow.lastLoginTime = r.data.lastLoginTime;
                    ElMessage({
                      message: "Table updated",
                      type: "success",
                    });
                  })
                  .catch((error) => {
                    this.responseErrorHandler(error);
                    this.currentRow.name = data.name;
                    this.currentRow.email = data.email;
                    ElMessage({
                      message: "Table update error",
                      type: "error",
                    });
                  });
              } else {
                this.currentRow.name = data.name;
                this.currentRow.email = data.email;
                ElMessage({
                  message: "Success",
                  type: "success",
                });
              }
              this.$refs.drawer.close();
            })
            .catch(this.responseErrorHandler);
        } else {
          ElMessage({
            message: "Invalid inputs",
            type: "warning",
          });
        }
      });
    },
    handleDelete(index, id) {
      ElMessageBox.confirm(
        "Operation will permanent delete the user. Confirm?",
        "Delete Confirm",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          axios
            .delete("/api/admin/users/" + id, {
              headers: {
                Authorization: localStorage.getItem("admin-token"),
              },
            })
            .then((response) => {
              UpdateToken(response);
              ElMessage({
                message: "Success",
                type: "success",
              });
              this.userData.splice(index, 1);
            })
            .catch(this.responseErrorHandler);
        })
        .catch(() => {
          ElMessage("Delete canceled");
        });
    },
    responseErrorHandler(error) {
      if (error.response) {
        UpdateToken(error.response);
        let status = error.response.status;
        if (status >= 500) {
          ElMessage({
            message: "Server error",
            type: "error",
          });
        } else if (status === 400) {
          if (error.response.data.code === 20)
            ElMessage({
              message: "Credentials expired",
              type: "warning",
            });
          else if (error.response.data.code === 21)
            ElMessage({
              message: "Duplicated username or email",
              type: "warning",
            });
        } else if (status === 404) {
          ElMessage({
            message: "Not found",
            type: "warning",
          });
        } else {
          ElMessage({
            message: "Fail: unknown error",
            type: "error",
          });
        }
      } else {
        console.log(error);
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    let auth = CheckSession();
    if (auth !== 1) {
      ElMessage({
        message: "Admin Authorization required",
        type: "warning",
      });
      return;
    }
    axios
      .get("/api/admin/users", {
        headers: {
          Authorization: localStorage.getItem("admin-token"),
        },
      })
      .then((response) => {
        UpdateToken(response);
        this.userData = response.data;
        this.isLoading = false;
      })
      .catch(this.responseErrorHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped></style>
