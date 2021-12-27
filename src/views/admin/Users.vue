<template>
  <div>
    <transition name="fade" mode="out-in">
      <el-skeleton v-if="isLoading" animated></el-skeleton>
      <div v-else>
        <el-empty v-if="empty"></el-empty>
        <el-table v-else :data="userData" :stripe="true" :border="true" :height="tableHeight" fit>
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="Username"/>
          <el-table-column prop="email" label="Email"/>
          <el-table-column prop="passwd" label="Password"/>
          <el-table-column prop="lastLoginTime" label="Last Login Time"/>
          <el-table-column fixed="right" label="Operations" width="100">
            <template #default="scope">
              <el-button size="small" :icon="Edit" circle @click="handleUpdate(scope.row)"></el-button>
              <el-button size="small" :icon="Delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
    <el-drawer ref="drawer" v-model="drawer" title="Modify" direction="rtl">
      <el-form ref="form" :model="rowData" label-width="100px" :rules="rules">
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
          <el-input v-model="rowData.passwd" placeholder="New Password, allow blank"></el-input>
        </el-form-item>
        <el-button @click="submitUpdate" type="primary">submit</el-button>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {Delete, Edit} from "@element-plus/icons-vue"

const rules = {
  name: [
    {
      required: true,
      message: 'Please input username',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 15,
      message: 'Length of username should between 4 to 15',
      trigger: 'blur'
    }
  ],
  passwd: [
    {
      min: 4,
      max: 40,
      message: 'Length of password should between 4 to 40',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: 'Please input email',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Invalid email',
      trigger: 'blur'
    }
  ]
}
</script>

<script>
import {CheckSession, UpdateToken} from "../../lib/auth-util";
import {ElMessage} from "element-plus";
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
      drawer: false
    }
  },
  methods: {
    onResize() {
      this.tableHeight = window.innerHeight - 160;
    },
    handleUpdate(row) {
      this.rowData = JSON.parse(JSON.stringify(row)) // deep copy
      this.rowData.passwd = undefined
      this.rowData.lastLoginTime = undefined
      this.drawer = true
      this.currentRow = row
    },
    submitUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let id = this.rowData.id
          let data = {
            name: this.rowData.name,
            email: this.rowData.email,
            passwd: this.rowData.passwd,
          }
          console.log(data)
          axios.patch("/api/users/" + id, data, {
            headers: {
              Authorization: sessionStorage.getItem('admin-token')
            }
          })
              .then((response) => {
                UpdateToken(response)
                ElMessage({
                  message: "Success",
                  type: 'success'
                })

                this.$refs.drawer.close()
              })
              .catch((error) => {
                if (error.response) {
                  UpdateToken(error.response)
                  let status = error.response.status
                  if (status >= 500) {
                    ElMessage({
                      message: 'Server error',
                      type: 'error'
                    })
                  } else if (status === 400 && error.response.data.code === 20) {
                    ElMessage({
                      message: 'Login credentials expired',
                      type: 'warning'
                    })
                    setTimeout(() => {
                      this.$router.push({name: 'login', query: {scope: 'admin'}})
                    }, 1000)
                  } else if (status === 404) {
                    ElMessage({
                      message: 'Not found',
                      type: 'warning'
                    })
                  } else {
                    ElMessage({
                      message: 'Fail: unknown error',
                      type: 'error'
                    })
                  }
                }
              })
        } else {
          ElMessage({
            message: "Invalid inputs",
            type: "warning"
          })
        }
      })
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize)
    let auth = CheckSession()
    if (auth !== 1) {
      ElMessage({
        message: 'Admin Authorization required',
        type: 'warning'
      })
      return
    }
    axios.get("/api/users", {
      headers: {
        Authorization: sessionStorage.getItem("admin-token")
      }
    })
        .then((response) => {
          UpdateToken(response)
          this.userData = response.data
          this.isLoading = false
        })
        .catch((error) => {
          if (error.response) {
            UpdateToken(error.response)
            let status = error.response.status
            if (status >= 500) {
              ElMessage({
                message: 'Server error',
                type: 'error'
              })
            } else if (status === 400 && error.response.data.code === 20) {
              ElMessage({
                message: 'Login credentials expired',
                type: 'warning'
              })
              setTimeout(() => {
                this.$router.push({name: 'login', query: {scope: 'admin'}})
              }, 1000)
            } else if (status === 404) {
              this.empty = true
            } else {
              ElMessage({
                message: 'Fail: unknown error',
                type: 'error'
              })
            }
          }
          this.isLoading = false
        })

  },
  unmounted() {
    window.removeEventListener("resize", this.onResize)
  }
}
</script>

<style scoped>

</style>