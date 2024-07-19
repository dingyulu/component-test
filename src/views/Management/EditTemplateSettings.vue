<template>
  <Modal v-bind="$attrs" v-on="$listeners" title="配置参数" ref="Modal" :mask-closable="false" :closable="false">
    <Form
      v-if="currentDocument"
      ref="Form"
      :model="currentDocument"
      :rules="rules"
      label-position="top"
    >
      <FormItem prop="default_config_in" label="模板密钥名称与实际使用字段对应关系">
        <JSONEditor v-model="currentDocument.default_config_in" class="json-editor" />
      </FormItem>
    </Form>
    <template #footer>
      <Button @click="onCancel">取消</Button>
      <Button type="primary" :loading="loading" @click="onConfirm">确定</Button>
    </template>
  </Modal>
</template>
<script>
import JSONEditor from '@/components/JsonEditor'
export default {
  name: "EditTemplateSettings",
  props: {
    document: {
      type: Object,
      default: () => ({
        default_config_in: {},
      }),
    },
  },
  components: {
    "ivw-upload": () => import("@/components/ivw-upload"),
    JSONEditor,
  },
  data() {
    return {
      loading: false,
      currentDocument: null,
      rules: {
        default_config_in: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              var config;
              try {
                config = (typeof this.currentDocument.default_config_in == 'object' ? this.currentDocument.default_config_in : JSON.parse(this.currentDocument.default_config_in))
              } catch {}
              if (!this.currentDocument.default_config_in && !config) {
                callback(new Error("请输入JSON类型配置数据"));
                return;
              }
              callback();
            },
          },
        ],
      },

      templateList: [],
    };
  },
  watch: {},
  methods: {
    initWatch() {
      this.$watch(
        () => {
          return this.$refs.Modal.value;
        },
        () => {
          if (this.$refs.Modal.value) {
            // visible
            this.currentDocument = JSON.parse(JSON.stringify(this.document));
            let config;
            try {
              config = (typeof this.currentDocument.default_config_in == 'object' ? this.currentDocument.default_config_in : JSON.parse(this.currentDocument.default_config_in))
            } catch {}
            this.currentDocument.default_config_in = config || {}
          } else {
            // hide
            this.currentDocument = null;
          }
        },
        {
          deep: true,
        }
      );
    },
    onCancel() {
      this.$emit("update:value", false);
    },
    onConfirm() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("tenantId", this.$store.state.user.tenantId);
          formData.append("userId", this.$store.state.user.userId);
          formData.append("user", this.$store.state.user.user_name);

          this.$http.post(`/updateAttachName`, {
            id: this.currentDocument.id,
            defaultConfigIn: typeof this.currentDocument.default_config_in == 'object' ? JSON.stringify(this.currentDocument.default_config_in) : this.currentDocument.default_config_in,
          }).then(res => {
            if (res && res.data && res.data.code == '0') {
              this.$emit("update:value", false);
              this.$emit("update:document", this.currentDocument);
              this.$emit("success");
              this.$Message.success('配置成功')
            } else {
              this.$Message.error('配置失败')
            }
          })
        } else {

          // this.$Message.error("验证失败!")
        }
      });
    },
  },
  mounted() {
    this.initWatch();
  },
};
</script>
<style lang="scss" scoped>
</style>
