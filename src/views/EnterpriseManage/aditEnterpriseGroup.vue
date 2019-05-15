<template>
    <div class="add_container">
        <div class="pannel_head">编辑企业组</div>
        <div class="company_item_head">
            <el-row>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建日期：</span>
                            <strong >{{groupDatas.createDateStr}}</strong>
                        </p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="body_left">
                        <p>
                            <span>创建人：</span>
                            <strong>{{groupDatas.createUserName}}</strong>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="company_item baseMes">
            <el-row>
                <el-col :span="24">
                    <div class="title_head">基本信息</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" offset="6">
                    <el-form
                            :rules="rules"
                            :model="updata"
                            ref="forms1"
                            label-width="100px"
                            label-position="right">
                            <el-form-item label="企业组" prop="companyGroupName">
                                <el-input size="small" v-model="updata.companyGroupName"></el-input>
                            </el-form-item>
                            <el-form-item label="账号使用人" prop="companyGroupAccountName">
                                <el-input size="small" v-model="updata.companyGroupAccountName" ></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="companyGroupAccountPhone">
                                <el-input size="small"  v-model="updata.companyGroupAccountPhone"></el-input>
                            </el-form-item>
                            <el-form-item
                                    prop="area"
                                    label="企业地址">
                                <div id="distpicker2" class="form-inline">
                                    <div class="form-group">
                                        <label class="sr-only" for="province5">Province</label>
                                        <select class="form-control" id="province5" v-model="updata.province"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="city5">City</label>
                                        <select class="form-control" id="city5" v-model="updata.city"></select>
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="district5">District</label>
                                        <select class="form-control" id="district5" v-model="updata.area"></select>
                                    </div>
                                </div>
                            </el-form-item>
                        <el-form-item prop="address">
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入详细地址"
                                    v-model="updata.address">
                            </el-input>
                        </el-form-item >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="btnClick" size="small"  style="width: 100px;">保存</el-button>
                            </el-form-item>
                        </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        updateClientGroup,//添加或修改企业组
    } from '../../api/api';
    export default {
        name: "adit-enterprise-group",
        data(){
            return{/*rule*/
                rules:{
                    companyGroupName: [
                        { required: true, message: '请输入企业组名称', trigger: 'blur' }
                    ],
                    companyGroupAccountName: [
                        { required: true, message: '请输入使用人姓名', trigger: 'blur' }
                    ],
                    companyGroupAccountPhone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    area: [
                        { required: true,trigger: 'blur', message: '请输入完整地址'}
                    ],
                },

                /*控制区*/
                dialogFormVisible:false,
                /*存储区*/
                updata:{
                    companyGroupName:'',
                    companyGroupAccountName:'',
                    companyGroupAccountPhone:'',
                    address:'',
                    province:'',//省
                    city:'',//市
                    area:'',//区
                },
                groupDatas:{}
            }
        },
        mounted(){
            //保存企业组ID到sessionStorage
            let groupDatas =  sessionStorage.getItem('groupDatas');
            if(!groupDatas){
                //第一次 进入
                sessionStorage.setItem('groupDatas', JSON.stringify(this.$route.params.aditData));
                this.groupDatas = this.$route.params.aditData;
            }else{
                if(this.$route.params&&!this.$route.params.aditData){
                    //$route不存在 说明为刷新
                    this.groupDatas = JSON.parse(groupDatas);
                }else{
                    //不是刷新  是父进来的
                    this.groupDatas = this.$route.params.aditData;
                    sessionStorage.setItem('groupDatas', JSON.stringify(this.$route.params.aditData));
                }
            }
            this.updata = this.groupDatas;
            let _this = this;
            setTimeout(function(){
                $('#distpicker2').distpicker({
                    province: _this.groupDatas.province,
                    city: _this.groupDatas.city,
                    district:_this.groupDatas.area,
                });
                _this = null;
            },200);
        },
        methods:{
            //提交保存
            btnClick(){
                this.$refs['forms1'].validate((valid) => {
                    if (valid) {
                        let para = {
                            id:this.groupDatas.companyGroupId,
                            name:this.updata.companyGroupName,
                            contactUserName:this.updata.companyGroupAccountName,
                            contactUserPhone:this.updata.companyGroupAccountPhone,
                            province:this.updata.province,
                            city:this.updata.city,
                            area:this.updata.area,
                            address:this.updata.address,

                        };
                        updateClientGroup(para).then(res =>{
                            if(res.data){
                                this.$message({
                                    type:'success',
                                    message:'修改成功'
                                });
                                this.$router.push({
                                    path:'/home/EnterpriseIndex/EnterpriseStatistical',
                                    name:'企业统计'
                                });
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.message
                                });
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .add_container{
        flex: 1;
        /* padding: 10px; */
        padding: 10px 20px;
        box-sizing: border-box;
    }
    .pannel_head{
        padding: 12px 48px 12px 10px;
        border-bottom: 1px solid #0000001c;
        font-size: 16px;
        line-height: 20px;
    }
    .tool {
        text-align: center;
        height: 40px;
        width: 100%;
        float: left;
    }
    .company_item_head{
        float: left;
        background-color: rgba(242, 242, 242, 1);
        width: 100%;
        margin-top: 5px;
        p{
            margin: 20px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        strong{
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .company_item{
        float: left;
        width: 100%;
        padding: 10px 0;
        /*.el-form-item {
            margin-bottom: 10px;
        }*/
        .title_head{
            font-size: 15px;
            padding: 12px 0 12px 15px;
            box-sizing: border-box;
        }
    }
    .body_left{
        float: left;
        padding: 0 20px;
        margin-right: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .form-inline .form-group {
        display: inline-block;
        margin-bottom: 0;
        vertical-align: middle;
        width: 32.5%;
    }

    .form-control {
        display: inline-block;
        width: 100%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 5px;
    }
</style>
