<template>
  <div>
    <!-- 搜索组件 -->
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="name">
        <!-- style="width=200" 按需调整宽度 -->
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="450px" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始，label显示标题,prop数据字段名
            width 列宽
      -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="160"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="80"></el-table-column>
      <el-table-column prop="mobile" label="联系人电话" width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" width="150"></el-table-column>
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
    <!-- 弹出新增窗口
    title 窗口的标题
    :visible.sync 当他为true时，窗口会被弹出
    -->
    <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm') : updateDate('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";

export default {
  data() {
    return {
      list: [],
      pageSize: 10, //每页显示条数 10条
      currentPage: 1, //当前页码
      total: 0, //总记录数
      searchMap: {
        //条件查询的绑定字段值
        name: "",
        linkman: "",
        mobile: "",
      },
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        remark: "",
        mobile: "",
      },
      rules: {
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      //   supplierApi.getList().then((response) => {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const data = response.data.data;
          this.list = data.rows;
          this.total = data.total;
          //   console.log(response.data.data);
        });
    },
    // 编辑
    handleEdit(id) {
      // console.log("编辑", id);
      // 清除原来的表单数据和校验结果
      this.handleAdd();
      supplierApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          // 提示获取数据失败
          this.$message({
            message: resp.message,
            type: "warning",
          });
        }
      });
    },
    // 删除
    handleDelete(id) {
      // console.log("删除", id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancleButtonText: "取消",
      }).then(() => {
        supplierApi.deleteById(id).then((response) => {
          const resp = response.data;
          this.$message({
                message: resp.message,
                type: resp.flag?'success':'error',
              });
          if (resp.flag) {
            // 删除成功，刷新数据
            this.fetchData();
          }
        });
      }).catch(()=>{
        // 取消失败
      })
    },
    // 当每页显示条数改变，进行调用该方法，val是当前改变后的条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 重置搜索框
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新增弹窗
    handleAdd() {
      (this.dialogFormVisible = true),
        this.$nextTick(() => {
          //  this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会被执行
          // 弹出窗口打开后，需要加载Dom，需要花费一些时间
          // 我们就应该等它加载dom之后，再调用resetFields方法去重置表单和清除样式
          this.$refs["pojoForm"].resetFields();
        });
    },
    // 提交新增表单
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          supplierApi.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          // 校验不通过
          return false;
        }
      });
    },
    updateDate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 页面校验通过，才可发送请求进行更新
          supplierApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 更新成功，刷新数据，关闭窗口
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              // 提示更新失败
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>