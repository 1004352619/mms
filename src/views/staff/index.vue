<template>
  <div>
    <!-- 搜索组件 -->
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会生效 -->
      <el-form-item prop="username">
        <!-- style="width=200" 按需调整宽度 -->
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
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
      <el-table-column prop="username" label="账号" width="160"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="age" label="年龄" width="120"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="salary" label="薪酬" width="120"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间" width="120"></el-table-column>
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
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="工资" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <!-- value-format 指定绑定值得格式 -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            type="date"
            placeholder="选择入职时间"
          ></el-date-picker>
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
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
      },
      pojo: {
        id: null,
        username: "",
        name: "",
        age: "",
        salary: 0,
        mobile: "",
        entryDate: "",
      },
      dialogFormVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //   获取数据
    fetchData() {
      staffApi
        .searchStaffList(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data.data;
          this.list = resp.rows;
          this.total = resp.total;
        });
    },
    //    打开编辑窗口
    handleEdit(id) {
      this.dialogFormVisible = true;
      staffApi.getStaffById(id).then((response) => {
        const resp = response.data;
        //   console.log(resp)
        this.pojo = resp.data;
      });
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确定删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
      })
        .then(() => {
          staffApi.deleteStaff(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });
            if(resp.flag){
                this.fetchData()
            }
          });
        })
        .catch(() => {
          //  取消删除
        });
    },
    // 新增员工窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //  this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会被执行
        // 弹出窗口打开后，需要加载Dom，需要花费一些时间
        // 我们就应该等它加载dom之后，再调用resetFields方法去重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 改变页数时会调用此方法
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 改变页码时调用此方法
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 修改员工信息
    updateDate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 表单校验通过
          staffApi.updateStaff(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.$message({
                message: "修改成功",
                type: "success",
              });
            } else {
              this.$message({
                message: "修改失败",
                type: "error",
              });
            }
          });
        } else {
          //  表单校验不通过
          return false;
        }
      });
    },
    // 新增员工
    addData(pojoForm) {
      this.$refs[pojoForm].validate((valid) => {
        if (valid) {
          // 校验成功，提交表单
          staffApi.addStaff(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 提交成功，刷新表单
              this.$message({
                message: "员工添加成功，初始密码为：123456",
                type: "success",
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error",
                duration: 2000,
              });
            }
          });
        } else {
          // 校验不通过
          return false;
        }
      });
    },
  },
};
</script>