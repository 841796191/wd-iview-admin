<template>
  <div>
    <Card>
      <tables
        ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary">
            <Icon type="md-person-add" />&nbsp;&nbsp;新增用户
          </Button>
        </template>
      </tables>

      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </Col>
        <Col>
          <Page
            :total="total"
            :current="page"
            :page-size="limit"
            :page-size-opts="pageArr"
            show-elevator
            show-sizer
            show-total
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </Col>
      </Row>
    </Card>
    <EditModel
    :isShow="showEdit"
    :item="currentItem"
    @editEvent="handleItemEdit"
    @changeEvent="handleChangeEvent">
    </EditModel>
    <AddModel
    :isShow="showAdd"
    @editEvent="handleItemAdd"
    @changeEvent="handleAddChangeEvent">
    </AddModel>
    <BatchSet
    :isShow="showSet"
    @editEvent="handleItemSet"
    @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import { userDispatch } from '@/api/admin'
import EditModel from './edit'
import AddModel from './add'
import BatchSet from './batchSet'
export default {
  name: 'user_management',
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchSet
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      option: {}, // 接收要搜索的值
      roles: [],
      showEdit: false, // 编辑框
      showAdd: false, // 新增框
      showSet: false, // 批量设置框
      currentIndex: 0, // 记录要修改、删除的下标
      currentItem: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true // 搜索框展示选项时隐藏
        },
        {
          title: '用户昵称',
          key: 'name',
          minWidth: 140,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 160,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 260,
          render: (h, params) => {
            return h('div', [h('span', params.row.roles.join(','))])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true,
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: 'VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 100,
          align: 'center'
        }
      ],
      pageArr: [10, 20, 30, 50, 100],
      tableData: [],
      selection: []
    }
  },
  mounted () {
    this._getlist()
  },
  methods: {
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    },

    // 显示编辑模态框并传递数据
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 更新用户信息
    handleItemEdit (item) {
      userDispatch.use('update', item).then((res) => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, item)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },

    // 显示新增用户框
    handleAddUser () {
      this.showAdd = true
    },
    // 接收子组件传递的新用户信息
    handleItemAdd (item) {
      userDispatch.use('add', item).then((res) => {
        if (res.code === 200) {
          this.tableData.splice(0, 0, res.data)
        }
      })
    },
    // 控制新增框显隐
    handleAddChangeEvent (value) {
      this.showAdd = value
    },

    // 接收模态框显隐变量
    handleChangeEvent (value) {
      this.showEdit = value
    },
    // 删除用户信息
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${row.name}的用户`,
        onOk: () => {
          userDispatch.use('delete', { ids: [row._id] }).then((res) => {
            this.tableData.splice(index, 1)
            this.$Message.success('删除成功！')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },

    // 导出表格
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },

    // 批量选择
    handleSelect (selection) {
      this.selection = selection
    },
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据')
        return
      }
      const msg = this.selection.map(o => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗',
        content: `删除${msg}用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          userDispatch.use('delete', { ids: arr }).then((res) => {
            // 直接本地过滤删除数据,减少请求
            this.tableData = this.tableData.filter((item) => !arr.includes(item._id))
            this.$Message.success('删除成功')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    // 批量设置模态框控制
    handleSetBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据')
        return
      }
      this.showSet = true
    },
    // 取消批量设置
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    // 批量设置 -> 请求
    handleItemSet (settings) {
      console.log('settings: ', settings)
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定修改用户吗',
        content: `修改${msg}用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          userDispatch.use('batch', { ids: arr, settings }).then((res) => {
            this.tableData.map((item) => {
              if (arr.includes(item._id)) {
                for (var keys of Object.keys(settings)) {
                  // 请求成功, 按照id修改本地数据
                  item[keys] = settings[keys]
                }
              }
            })
            this.$Message.success('批量设置成功')
          })
        }
      })
    },

    // 搜索
    handleSearch (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      if (
        (typeof this.option.search !== 'undefined' &&
          value.search !== this.option.search) ||
        this.option === {}
      ) {
        this.page = 1 // 从1开始
      }
      this.option = value // 要搜索的值
      this._getlist()
    },
    // 获取用户列表
    _getlist () {
      userDispatch.use('get', {
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then((res) => {
        if (res.code === 200) {
          console.log('data: ', res.data)
          this.tableData = res.data
          this.total = res.total
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
