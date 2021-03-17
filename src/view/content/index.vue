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
      @on-row-remove="handleRowRemove"/>
      <Row type="flex" justify="space-between" align="middle">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Excel文件</Button>
        <Page
        :total="total"
        :current="page"
        :page-size="limit"
        :page-size-opts="pageArr"
        show-elevator
        show-sizer
        show-total
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"/>
      </Row>
    </Card>
    <EditModel
    :isShow="showEdit"
    :item="currentItem"
    @editEvent="handleItemEdit"
    @changeEvent="handleChangeEvent"></EditModel>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditModel from './index/editModel'
import { getList, deletePostById, updatePostById } from '@/api/content'
import dayjs from 'dayjs'
export default {
  name: 'content_management',
  components: {
    Tables,
    EditModel
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      showEdit: false, // 显示编辑框
      currentItem: '', // 编辑显示的数据
      currentIndex: 0, // 记录编辑哪个文章
      pageArr: [10, 15, 20, 25, 30],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 200,
          ellipsis: true,
          tooltip: true,
          search: {
            type: 'input'
          }
        },
        {
          title: '创建时间',
          key: 'created', // 对应字段
          width: 200,
          align: 'center', // 对齐方式
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
          title: '作者',
          key: 'user',
          width: 120,
          align: 'center',
          // 使用render结构化数据
          render: (h, params) => {
            console.log('params: ', params)
            return h('div', [h('span', params.row.uid.name)])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask':
                result = '提问'
                break
              case 'advise':
                result = '建议'
                break
              case 'discuss':
                result = '交流'
                break
              case 'share':
                result = '分享'
                break
              case 'logs':
                result = '动态'
                break
              case 'notice':
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', [h('span', result)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '提问',
                value: 'ask'
              },
              {
                key: '建议',
                value: 'advise'
              },
              {
                key: '交流',
                value: 'discuss'
              },
              {
                key: '分享',
                value: 'share'
              },
              {
                key: '公告',
                value: 'notice'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map((o) => o.name).join(','))
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '阅读记数',
          key: 'reads',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
          align: 'center',
          hidden: true
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isTop === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
            ])
          },
          search: {
            type: 'radio'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          width: 100,
          align: 'center',
          hidden: true
        }
      ],
      tableData: []
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    onPageChange (page) {
      // 页码改变时
      // console.log('page: ', page)
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      // 每页条数改变时
      // console.log('size: ', size)
      this.limit = size
      this._getList()
    },
    _getList () {
      getList({ page: this.page - 1, limit: this.limit }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    // 发送编辑数据给后台
    handleItemEdit (item) {
      updatePostById(item).then((res) => {
        if (res.code === 200) {
          // console.log('更新成功')
          // 更新数据,不能直接对数组单个数据更新(this.tableData[this.currentIndex]),这样不会触发渲染函数
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 编辑模态框
    handleRowEdit (row, index) {
      // console.log('row: ', row)
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row } // 使用扩展运算符缓存,这样编辑取消时里面的数据不会影响到父组件
    },
    // 取消编辑触发的事件
    handleChangeEvent (value) {
      this.showEdit = value
    },
    // 删除
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除文章吗?',
        content: `删除第${index + 1}条数据,文章标题:"${row.title}"?`,
        onOk: () => {
          deletePostById(row._id).then((res) => {
            if (res.code === 200) {
              this.$Message.info('删除成功！')
              // 过滤本地数据
              this.tableData = this.tableData.filter((item) => item._id !== row._id)
            }
          }).catch((err) => {
            this.$Message.info('删除失败!原因: ' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    }
  },
  mounted () {
    this._getList()
  }
}
</script>

<style>

</style>
