<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="10">
                             
                    <el-input @clear="getUserList" clearable placeholder="请输入姓名" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            
            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
               <!-- <el-table-column label="角色" prop="role_name"></el-table-column>-->

              <!-- <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row}}
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column> -->
              
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip :enterable="false" effect="dark" content="修改" placement="top-start">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip :enterable="false" effect="dark" content="删除" placement="top-start">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip :enterable="false" effect="dark" content="设置" placement="top-start">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户 对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="dialogVisibleClosed">
            <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>

            </el-form>
            

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 修改用户信息对话框 -->
        <el-dialog
            title="修改信息"
            :visible.sync="dialogVisible2"
            width="50%"
            @close="editDialogClosed">
            <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 分配角色 -->
        <el-dialog
            title="角色分配"
            :visible.sync="dialogVisible3"
            width="50%"
            @close="setRoleDialogClosed">
            <div>
                <p>当前的用户:{{userInfo.username}}</p>
                <p>当前的用户:{{userInfo.role_name}}</p>
                <p>分配新角色:
                      <el-select v-model="selectedRoleId" placeholder="请选择新角色">
                            <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                    </el-select>
                </p>
                <p></p>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
export default {
    data(){
        var checkEmail = (rule,value,callBack)=>{
            //自定义 二次验证邮箱 手机号等验证方式
            //rule是验证规则 , value是需要验证的值, 验证通过就可以调用callBack函数通过验证
            //不通过也是调用callBack同时必须Error对象里面的错误提示信息
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                //合法的邮箱
                return callBack();
            }
            callBack(new Error('请输入合法的邮箱'));
        }

        var checkMobile = (rule,value,callBack)=>{
            
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return callBack();
            }
            callBack('请输入合法的手机号');
        }

        return {
            queryInfo:{
                query:'',
                pagenum:0,
                pagesize:10
            },
            userList:[],
            total:0,
            dialogVisible:false,     
            dialogVisible2:false,
            dialogVisible3:false,

            addForm:{     //添加用户  里面的表单数据
                username:'',
                password:'',
                email: '',
                mobile:'',

            },  
            addFormRules: {   //添加用户的 表单的 验证规则 对象
                username: [
                    { required:true,message:'请输入用户名',trigger:'blur'},
                    { min:2,max:16,message:'用户名的长度在2~16个字符之间',trigger:'blur'}
                ],
                password: [
                    { required:true,message:'请输入密码',trigger:'blur'},
                    { min:6,max:16,message:'密码的长度在6~16个字符之间',trigger:'blur'}
                ],
                mobile: [
                    { required:true,message:'请输入手机号',trigger:'blur'},
                    { validator:checkMobile, trigger:'blur'}
                ],
            },  
            editForm:{ },       //点击修改 查询该用户的信息并赋值给editForm对象
            editFormRules: {     //修改用户信息的 验证规则 对象
                email: [
                    { required:true,message:'请输入邮箱',trigger:'blur'},
                    { validator:checkEmail, trigger:'blur'}
                ],
                mobile: [
                    { required:true,message:'请输入手机号',trigger:'blur'},
                    { validator:checkMobile, trigger:'blur'}
                ],
            }, 
            userInfo:{},         //分配角色 用户信息
            rolesList:[],        //所有角色的列表
            selectedRoleId:'',   //分配切换到新选的角色上
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        getUserList(){
            this.$axios.get('shUser/search',{params:this.queryInfo}).then(res=>{
                console.log(res);
                if(res.data.rows ==undefined){
                    return this.$notify({ message: '请求用户列表失败'});
                };
               this.total = res.data.total;
                this.userList = res.data.rows;
            })
        },
        handleSizeChange(newSize){  //监听pagesize 改变
            console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList();


        },
        handleCurrentChange(newPage){  //监听页码值 改变
            console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },

        userStateChange(userInfo){    //监听 switch 开关的事件
            console.log(userInfo);
            this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res=>{
                console.log(res);
                if(res.data.meta.status !==200){
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$notify({ message: '更新用户状态失败'});
                };
                this.$notify({ message: '更新用户状态成功'});
            })
        },

        dialogVisibleClosed(){       //监听添加用户对话框的关闭事件,并重置输入内容
             this.$refs.addFormRef.resetFields();
        },

        addUser(){                   //输入后,点击确认添加
             this.$refs.addFormRef.validate( (valid) =>{  //预验证 表单内所有的验证是否为真 如果是返回 true 否 false
                 console.log(valid);
                 if(valid){
                     //发起请求
                     this.$axios.post('shUser/add',this.addForm).then(res=>{
                         console.log(res);
                         if(res.data.code != 20000){
                             this.$notify({ message: '添加用户失败'});
                         }else{
                             this.$notify({ message: '添加用户成功'});
                             this.dialogVisible = false;
                             this.getUserList();
                         }
                     })
                 }
             })
        },

        showEditDialog(id){            //修改用户信息(得到用户id,并用id请求用户信息)
            this.dialogVisible2 = true;

            this.$axios.get('users/'+id).then(res=>{
                  console.log(res);
                  if(res.data.meta.status != 200){
                      this.$notify({message:"查询用户信息失败"});
                  }
                  this.editForm = res.data.data;
            })
        },
        editDialogClosed(){            //监听修改用户信息对话框的关闭事件,并重置输入内容
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            this.$refs.editFormRef.validate( (valid)=>{
                 console.log(valid);
                 if(valid){
                     this.$axios.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile}).then(res=>{
                           if(res.data.meta.status != 200){
                               this.$notify({message:"更新用户信息失败"});
                           }else{
                               this.$notify({message:"更新用户信息成功"});

                           }
                           this.dialogVisible2 = false;
                           this.getUserList();
                     })
                 }
            })
        },

        removeUserById(id){            //删除用户
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                                                                        confirmButtonText: '确定',
                                                                        cancelButtonText: '取消',
                                                                        type: 'warning'
                                                                        }
                ).then( res=>{
                    console.log(res); //确定返回 confirm

                    if(res == 'confirm'){
                            this.$axios.delete('shUser/delete/'+id).then(result=>{
                                console.log(result);
                                if(result.data.code != 20000){
                                    this.$notify({message:"用户删除失败"});
                                }else{
                                    this.$notify({message:"用户删除成功"});
                                     this.getUserList();
                                }
                            })
                    }

                }).catch( err =>{
                    console.log(err); //取消返回 cancel
                     this.$notify({message:"用户取消删除"});
                })
        },

        setRole(userInfo){            //打开分配角色 对话框
            this.userInfo = userInfo; 
            this.$axios.get("roles").then(res=>{
                    if(res.data.meta.status !==200){
                        return this.$notify({message:'获取角色接口失败'})
                    }else{
                        this.rolesList = res.data.data;
                    }
            })



            this.dialogVisible3 = true;
        },

        saveRoleInfo(){
            if(!this.selectedRoleId) return this.$notify({message:'请选择新的角色'});
            this.$axios.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId}).then(res=>{
                  if(res.data.meta.status !=200){
                        return this.$notify({message:'更换新的角色API失败'});
                  }
                  this.$notify({message:'更新角色成功'});
                  this.getUserList();
                  this.dialogVisible3 = false;
            })
        },
        setRoleDialogClosed(){    //当重新分配角色对话框,删除已选的内容
                //当对话框被关闭--就会触发这个时间  @close不只是当前右上角的X号点击触发
                //而且也是其他地方触发关闭该对话框，就会触发@close事件
            this.selectedRoleId = '';
            this.userInfo = '';
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
