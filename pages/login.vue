<template>
  <div style="padding-top: 100px">
    <el-row type="flex" justify="center">
      <el-col :span="8">

        <el-card class="box-card" shadow="never">
          <el-row type="flex" justify="center">
            <el-col :span="16">

              <el-row type="flex" justify="center">
                <img src="logo.png" style="width: 150px"/>
              </el-row>

              <el-row type="flex" justify="center">
                <h4>Вход</h4>
              </el-row>

              <el-form label-position="top" ref="form" :model="form" id="login-form">
                <el-form-item label="Логин" prop="login" :rules="rules.login">
                  <el-input v-model="form.login"/>
                </el-form-item>
                <el-form-item label="Пароль" prop="password" :rules="rules.password"> 
                  <el-input v-model="form.password" prop="pass" show-password/>
                </el-form-item>
              </el-form>

              <el-row type="flex" justify="center">
                <el-button 
                  type="primary" 
                  style="padding: 12px 50px;margin: 15px"
                  :disabled="!isValidForm"
                  @click="auth"
                >Войти</el-button>
              </el-row>
              

            </el-col>
          </el-row>    
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'LoginPage',

  // asyncData(context) {
  //   console.log(context)
  // },

  layout: 'empty',

  data: () => ({
    form: {
      login: null,
      password: null,
    },
    isValidForm: false,
    rules: {
      login: [
        { required: true, message: 'Введите логин', trigger: 'blur' },
        { min: 5, max: 100, message: 'Длина не должна быть меньше 5', trigger: 'blur' }
      ],
      password: [
        { required: true, message: 'Введите пароль', trigger: 'blur' },
        { min: 5, max: 100, message: 'Длина не должна быть меньше 5', trigger: 'blur' }
      ],
    },
  }),

  watch: {
    form: {
      deep: true,
      handler() {
        this.$refs.form.validate(valid => {
          this.isValidForm = valid;
        });
      },
    }
  },

  computed: {
    ...mapState(['token']),
  },

  methods: {
    ...mapActions(['login', 'getFavorites']),
    ...mapMutations(['setToken', 'authSuccess', 'setUserId']),
    async auth(query, push = '/') {
      const data = await this.login(query || this.form);
      if(!data.auth) {
        this.$refs.form.resetFields();
      }
      else {
        this.setToken(data.token);
        this.setUserId(data.id);
        this.authSuccess();
        this.getFavorites({ id: data.id });
        this.$router.push(push)
      }
    },
  },

  beforeMount() {
    const page = this.$route.query.from;
    this.auth({ token: this.token }, `/${ page == 'index' ? '' : page }`)
  },
};
</script>

<style>
#login-form .el-form-item__label {
  line-height: 26px !important;
  padding: 0 !important;
}
</style>