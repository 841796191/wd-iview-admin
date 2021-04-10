<template>
  <div>
    <Modal v-model="showStatus" title="批量设置" @on-ok="ok" @on-cancel="cancel">
      <Form :model="localItem" :label-width="80" ref="table">
        <FormItem label="用户禁言">
          <RadioGroup v-model="localItem.status">
            <Radio label>不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    isShow () {
      this.showStatus = this.isShow
    },
    item (newval, oldval) {
      this.localItem = { ...newval }
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        status: ''
      }
    }
  },
  methods: {
    ok () {
      // this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$emit('editEvent', this.localItem)
      this.$Message.info('设置成功！')
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消设置！')
    }
  }
}
</script>
