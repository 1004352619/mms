<template>
  <div>
    <!-- 搜索组件 -->
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <!-- style="width=200" 按需调整宽度 -->
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible=true"
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="450px" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始，label显示标题,prop数据字段名
            width 列宽
      -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="160"></el-table-column>
      <el-table-column prop="code" label="商品编号" width="80"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="120"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="120"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="120"></el-table-column>
      <el-table-column prop="storageNum" label="进货数量" width="120"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="120"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 选择供应商对话框 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input readonly @click.native="editOptionSupplier" v-model="pojo.supplierName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary"
          @click="pojo.id === null ? addData('pojoForm') : updateDate('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  // 注册子主键
  components: { Supplier },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogSupplierVisible: false, //弹出选择供应商对话窗口
      dialogFormVisible: false, //弹出编辑对话窗
      searchMap: {
        name: "",
        code: "",
        supplierName: "",
      },
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "商品编号不能为空", trigger: "blur" },
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" },
        ],
      },
      pojo: {
        id:null,
        supplierId:null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
      },
      isEdit: false, //是否为编辑窗口
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const data = response.data.data;
          this.list = data.rows;
          this.total = data.total;
          // console.log(data.rows)
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 添加表单
    handleAdd() {
      (this.dialogFormVisible = true),
        this.$nextTick(() => {
          //  this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会被执行
          // 弹出窗口打开后，需要加载Dom，需要花费一些时间
          // 我们就应该等它加载dom之后，再调用resetFields方法去重置表单和清除样式
          this.$refs["pojoForm"].resetFields();
        });
    },
    // 重置搜索框
    resetForm() {},
    // 供应商对话框
    optionSupplier(currentRow) {
      //   console.log("parent", currentRow);
      if (this.isEdit) {
        // 编辑窗口打开的供应商
        this.pojo.supplierName = currentRow.name; //供应商名称
        this.pojo.supplierId = currentRow.id; //供应商ID
      } else {
        // 搜索打开的供应商
        this.searchMap.supplierName = currentRow.name; //供应商名称
        this.searchMap.supplierId = currentRow.id; //供应商ID
      }
    
      this.dialogSupplierVisible = false; //关闭窗口
      this.isEdit=false
    },
    // 添加商品
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          goodsApi.add(this.pojo).then(response=>{
              const resp=response.data
              if(resp.flag){
                  this.fetchData()
                  this.dialogFormVisible=false
              }else{
                  this.$message({
                      message:resp.message,
                      type:'warning'
                  })
              }
          })
        } else {
          // 校验不通过
          return false;
        }
      });
    },
    // 编辑商品信息
    updateDate(formName){
        this.$refs[formName].validate(valid=>{
            if(valid){
                // 校验通过
                goodsApi.update(this.pojo).then(response=>{
                    const resp =response.data
                    if(resp.flag){
                        // 修改成功，刷新数据,关闭窗口
                        this.fetchData()
                        this.dialogFormVisible=false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:'warning'
                        })
                    }
                })
            }else{
                // 页面没有校验通过
                return false
            }
        })
    },
    editOptionSupplier() {
      this.isEdit = true; //当前是通过选择供应商打开的窗口
      this.dialogSupplierVisible = true;
    },
    // 打开编辑窗口
    handleEdit(id){
        this.handleAdd()
        goodsApi.getById(id).then(response=>{
            const resp=response.data
            if(resp.flag){
                this.pojo=resp.data
            }
        })
    },
    // 删除商品
    handleDelete(id){
        this.$confirm('确定删除这条记录吗？','提示',{
            confirmButtonText:'确定',
            cancleButtonText:'取消'
        }).then(()=>{
            goodsApi.deleteById(id).then(response=>{
                const resp=response.data
                // 提示更新是否成功
                this.$message({
                    message:resp.message,
                    type:resp.flag?'success':'error'
                })
                if(resp.flag){
                    // 删除成功.刷新数据
                    this.fetchData()
                }
            })
        }).catch(()=>{
            //  取消删除
        })
    }
  },
};
</script>