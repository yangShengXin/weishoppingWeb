<template>
    <div class="login-container">
        <table></table>
        <div class="login-box">
            <!-- 头像 -->
            <div class="avatar-box">
                <img src="../assets/user.png">
            </div>
            <!-- 登录表单区域 -->
            <el-form class="login-form" ref="loginRef" :model="form"  :rules="formRules">
                    <!-- 账户 -->
                    <el-form-item prop="username">
                        <el-input  v-model="form.username" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                     <!-- 密码 -->
                    <el-form-item  prop="password">
                        <el-input type="password" v-model="form.password" prefix-icon="iconfont icon-3702mima"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form: {
                username:"admin",
                password:"123456",
            },
            formRules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min:6,max:16, message: '长度在6-16位之间', trigger: 'blur' },
                ]
          },

        }
    },
    methods:{
        resetLoginForm(){
                                           this.$refs.loginRef.resetFields();
        },
        login(){
            this.$refs.loginRef.validate( valid =>{
                 console.log(valid); //true or false
                 if(!valid) return;
                 this.$axios.post("back/login",this.form).then(res=>{
                 
                     console.log(res);
                     if(res.data.code != 200){
                            return this.$notify({ message: '登录失败'});
                     };
                     this.$notify({ message: '登录成功'});
                     //1.将登录成功之后的token,保存到客户端的sessionStorage中
                     //2.项目中除了登录之外的其他有权限的接口，通过token来身份验证访问；
                     //3.token值应该只在当前网站打开期间生效，所以保存在sessionStorage(会话期间)中合适.localStorage(持久性的)
                  //   sessionStorage.setItem("token",res.data.data.token);
                     this.$router.push('/home');
                 });

            });
        },

    }
}
</script>
<style lang="scss" scoped>
.login-container{
    background:rgb(50, 19, 54);
    height: 100%;
    .login-box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        margin: 0 auto;
        margin-top: 200px;
        position: relative;
        .avatar-box{
            height: 130px;
            width: 130px;
            border-radius: 50%;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #eee;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
}
</style>
