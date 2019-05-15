<template>
    <section id="login">
        <!--<div class="bgCanvas">
            <canvas id="Mycanvas" width="100%" height="100%"></canvas>
        </div>-->
        <div style="border: 1px #fff solid;position: absolute;top: 0;right: 0;left: 0;bottom: 0;">
            <div class="login-container animated fadeInDown">
                <div class="loginBox">
                    <el-form :model="ruleForm3" :rules="rules2" ref="ruleForm3" label-position="left" label-width="0px" >
                        <h3 class="title">企业运营端</h3>
                        <el-form-item prop="account">
                            <el-input type="text" v-model="ruleForm3.account" auto-complete="off" placeholder="账号" @keydown.native.enter="handleSubmit3"></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPass">
                            <el-input type="password"  v-model="ruleForm3.checkPass" auto-complete="off" placeholder="密码" @keydown.native.enter="handleSubmit3"></el-input>
                        </el-form-item>
                        <el-form-item prop="inputCheck"  class="codeBox">
                            <el-input placeholder="请输入验证码" v-model="ruleForm3.inputCheck" @keydown.native.enter="handleSubmit3">
                                <template slot="append">
                                    <img alt="验证码" :src="imgCode" style="height: 40px" @click="getCodeImage" />
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-checkbox v-model="checked1" class="remember">记住账号</el-checkbox>
                        <span style="float: right;" >
                            <a  @click="isShowForgot" class="forgotPassword">忘记密码</a>
                        </span>
                        <el-form-item style="width:100%;">
                            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit3" :loading="logining1">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
    import {
        defaultKaptcha,
        requestLogin,//登录
        sendLoginCode,//获取验证码
    } from '../../api/api';
    import util from '../../utils/util';
    import {canvasDemo} from '@/utils/canvas';
    import {generateMenuData} from '../../utils/mUtils';
    import { mapState,mapActions} from "vuex";
    export default {
        data() {
            return {
                logining1: false,
                imgCode:defaultKaptcha,
                /*ruleForm2: {
                    account: '',
                    checkPass: '',
                    inputCheck:''
                },*/
                ruleForm3: {
                    account: '',
                    checkPass: '',
                    inputCheck:''
                },
                rules2: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    checkPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    inputCheck: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                    ],
                },
                checked1: true,
                /*忘记密码*/
                ruleForm:{
                    inputCount:'',//帐户名
                    inputCheck:'',//验证码
                }
            };
        },
        methods: {
            ...mapActions(["setMenuData"]),
            //忘记密码
            isShowForgot(){
                this.$router.push({
                    name: '忘记密码',
                    path:'/forgetPwd'
                })
            },
            //获取图片验证码
            getCodeImage(e){
                this.imgCode = defaultKaptcha + '?d='+new Date()*1;
            },
            //企业客户系统登录
            handleSubmit3(ev) {
                let _this = this;
                this.$refs.ruleForm3.validate((valid) => {
                    if (valid) {
                        this.logining1 = true;
                        let loginParams = {
                            account: _this.ruleForm3.account,
                            password: _this.ruleForm3.checkPass,
                            systemTye:0,
                            vrifyCode:_this.ruleForm3.inputCheck
                        };
                        //登录：
                        //systemTye：0.订单系统；1.订单系统
                        requestLogin(loginParams).then(data => {
                            this.logining1 = false;
                            let code = data.code;
                            let message = data.message;
                            if (code !== '0') {
                                this.$message({
                                    message: message,
                                    type: 'error'
                                });
                                _this.getCodeImage();
                            } else {
                                let temps = JSON.parse(data.data);
                                if(this.checked1 === true){
                                    util.setCookie('user',_this.ruleForm3.account,7);
                                }else{
                                    util.setCookie('user',_this.ruleForm3.account,-2);
                                }
                                sessionStorage.setItem('user', JSON.stringify(_this.ruleForm3.account));
                                sessionStorage.setItem('name', JSON.stringify(temps.name));
                                temps.resources[0].children =  generateMenuData(temps.resources[0].children);
                                //同时存入内存 store中
                                this.setMenuData(temps);
                                //将角色权限数据保存到缓存
                                sessionStorage.setItem('menuData', JSON.stringify(temps));

                                 this.$router.push({ path: '/home/index' });
                            }
                        },error =>{
                            this.logining1 = false;
                            this.$message({
                                message: '出错了，请稍后再试',
                                type: 'error',
                                duration:3000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
        },
        mounted(){
          /*  let canvas = document.getElementById('Mycanvas');
            canvasDemo(canvas);*/
        },
        created() {
            let order = util.getCookie('order');
            if(order){
                this.ruleForm3.account = order;
            }else{
                this.ruleForm3.account = '';
            }
        }
    }

</script>

<style lang="scss">
    #login{
        width: 100%;
        height: 100%;
    }

    .forgotPassword{
        color: #409EFF;
        text-decoration: none;
        cursor: pointer;
    }
    .forgotPassword:hover{
        color: #E4393C;
        text-decoration: underline;
    }
    .bgCanvas{
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        top: 0;
        overflow: hidden;
    }
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto 20px;
        width: 420px;
        padding: 0 0 15px 0;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 15px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
        .loginBox{
            padding: 35px 35px 0;
        }
        .codeBox{
            .el-input-group__append{
                padding: 0;
                font-size: 0;
                border: 0;
                img{
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
        }
    }
    .login-container:hover{
        box-shadow: 0 0 30px #cac6c6;
    }
    .mean{
        display: block;
        width: 178px;
        text-align: center;
    }
</style>
