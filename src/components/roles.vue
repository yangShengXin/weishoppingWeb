<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">

                        <template slot-scope="scope">
                            <el-row :class="['bdbottom','vcenter',i1 ===0?'bdtop':'']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                                <!-- 渲染一级权限 -->
                                <el-col :span="5">
                                    <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级&三级权限 -->
                                <el-col :span="19">
                                    <el-row :class="['vcenter', i2 ===0 ? '':'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                            <el-col :span="6">
                                                <el-tag closable @close="removeRightById(scope.row,item2.id)" type="warning">{{item2.authName}}</el-tag>
                                                <i class="el-icon-caret-right"></i>
                                            </el-col>
                                            <el-col :span="18">
                                                <el-tag closable @close="removeRightById(scope.row,item3.id)" type="success" v-for="(item3,i3) in item2.children" :key="item3.id">
                                                    {{item3.authName}}
                                                </el-tag>
                                            </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                        
                </el-table-column>

                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>

                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button  size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button  size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
        
        <!-- 分配权限 -->
        <el-dialog
            title="分配权限"
            :visible.sync="dialogVisible"
            width="50%"
            @close="setRightDialogClosed">
            <el-tree ref="treeRef" :default-checked-keys="defKeys" node-key="id" default-expand-all show-checkbox :data="rightsList" :props="treeProps"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data(){
        return {
            rolesList:[],
            dialogVisible:false,
            rightsList:[],  //分配权限的数据
            treeProps:{
                label:'authName',   //层级名字
                children:'children' //以谁为层级
            },
            defKeys:[],      //点击分配权限 默选中的节点是已有(开展里面的权限);
            roleId:'',       //当前即将分配权限的角色ID
        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
        getRolesList(){
            this.$axios.get('roles').then(res=>{
                console.log(res);
                if(res.data.meta.status != 200){
                    return this.$notify({message:'获取角色列表失败'});
                }else{
                    this.rolesList  = res.data.data;
                }
            })
        },
        removeRightById(role,rightId){
            this.$confirm('确认删除此权限?','提示',
                            {
                                confirmButtonText:'确认',
                                cancelButtonText:'取消',
                                type:'warning'
                            }
            ).then(confirm=>{
                  if(confirm == 'confirm'){
                      this.$axios.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
                          if(res.data.meta.status == 200){
                                this.$notify({message:'删除成功'});
                                //this.getRolesList();//重新调用接口 会导致页面重新渲染(也就是得重新打开expand框)
                                role.children = res.data.data;
                         }
                      })
                  }
            }).catch(cancel=>{
                  if(cancel == 'cancel'){
                      this.$notify({message:'取消删除!'});
                  }
            })
        },

        showRightDialog(role){    //分配权限
            this.roleId = role.id;

            this.$axios.get('rights/tree').then(res=>{
                if(res.data.meta.status != 200){
                      return this.$notify({message:'获取权限API失败'});
                }else{
                    this.dialogVisible = true;
                    this.rightsList = res.data.data;
                    this.getLeafKeys(role,this.defKeys);
                }
            })
        },

        getLeafKeys(node,arr){ //通过递归,获取角色下所有三级 权限的id,并保存到defkeys数组中
            // 如果当前node 节点不包含children属性,则是三级节点
            if(!node.children){
                return arr.push(node.id); 
            }else{
                node.children.forEach( item =>{
                    this.getLeafKeys(item,arr);
                })
            }
        },

        setRightDialogClosed(){ //监听分配权限对话框的关闭事件
            this.defKeys = [];
        },
        allotRights(){       //点击确定为角色分配权限
            const keys =[ ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys() ]
            console.log(keys);
            const idStr  = keys.join(',');
            this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res=>{
                 if(res.data.meta.status !== 200){
                     return this.$notify({message:'设置权限失败'});
                 }else{
                     this.$notify({message:'设置权限成功'});
                     this.getRolesList();
                     this.dialogVisible = false
                 }
            })

        }
    }
}
</script>
<style lang="scss" scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom:1px solid #eee;
}

.vcenter{
    display: flex;
    align-items: center;
}
</style>
